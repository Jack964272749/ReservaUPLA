using ReservaUpla.Application.DTOs;
using ReservaUpla.Application.Interfaces;
using ReservaUpla.Application.Mappers;
using ReservaUpla.Domain.Constants;
using ReservaUpla.Domain.Entities;
using ReservaUpla.Domain.Enums;
using ReservaUpla.Domain.Exceptions;

namespace ReservaUpla.Application.Services;

// Trazabilidad: RN-01 a RN-06 · RF-03 a RF-07 · ISO 9241-11 Eficacia y Eficiencia
public class ReservaService : IReservaService
{
    private readonly IReservaRepository _reservaRepository;
    private readonly IAmbienteRepository _ambienteRepository;
    private readonly IUsuarioRepository _usuarioRepository;
    private readonly IRelojService _relojService;

    public ReservaService(
        IReservaRepository reservaRepository,
        IAmbienteRepository ambienteRepository,
        IUsuarioRepository usuarioRepository,
        IRelojService relojService)
    {
        _reservaRepository = reservaRepository;
        _ambienteRepository = ambienteRepository;
        _usuarioRepository = usuarioRepository;
        _relojService = relojService;
    }

    public async Task<ReservaDto> CrearAsync(CrearReservaDto dto, Guid idUsuario, CancellationToken cancellationToken = default)
    {
        // RV-08 · E-16: Fecha obligatoria y no pasada
        var hoy = _relojService.HoyLima();
        if (dto.Fecha < hoy)
            throw new DomainException(Mensajes.FechaPasada);

        // RV-13: Ambiente existente y disponible
        var ambiente = await _ambienteRepository.ObtenerPorIdAsync(dto.AmbienteId, cancellationToken)
            ?? throw new DomainException("El ambiente especificado no existe.", 404);

        if (ambiente.Est_Ambiente != EstAmbiente.Disponible)
            throw new DomainException(Mensajes.AmbienteNoDisponible, 409);

        // Trazabilidad: E-17 · E-31 · Validación en transacción Serializable para prevenir condiciones de carrera
        Reserva reservaCreada = null!;
        await _reservaRepository.EjecutarEnTransaccionSerializableAsync(async () =>
        {
            var conflicto = await _reservaRepository.HayConflictoAprobadoAsync(
                dto.AmbienteId,
                dto.Fecha,
                dto.HoraInicio,
                dto.HoraFin,
                null,
                cancellationToken);

            if (conflicto)
                throw new DomainException(Mensajes.ConflictoDisponibilidad, 409);

            var reserva = Reserva.Crear(
                dto.Fecha,
                dto.HoraInicio,
                dto.HoraFin,
                dto.Motivo,
                idUsuario,
                dto.AmbienteId);

            await _reservaRepository.AgregarAsync(reserva, cancellationToken);
            reservaCreada = reserva;
        }, cancellationToken);

        var guardada = await _reservaRepository.ObtenerPorIdAsync(reservaCreada.Id_Reserva, cancellationToken);
        return ReservaMapper.ToDto(guardada ?? reservaCreada);
    }

    public async Task<PaginaReservasDto> ObtenerPaginadoAsync(
        DateOnly? fecha,
        Guid? ambienteId,
        string? estado,
        Guid idUsuario,
        RolUsuario rolUsuario,
        int pagina = 1,
        int tamanoPagina = 10,
        CancellationToken cancellationToken = default)
    {
        EstadoReserva? estadoEnum = null;
        if (!string.IsNullOrWhiteSpace(estado) && Enum.TryParse<EstadoReserva>(estado, true, out var parsedEstado))
            estadoEnum = parsedEstado;

        Guid? filtroUsuario = null;
        IEnumerable<Guid>? ambientesPermitidos = null;

        if (rolUsuario == RolUsuario.Solicitante)
        {
            filtroUsuario = idUsuario;
        }
        else if (rolUsuario == RolUsuario.Responsable)
        {
            // Trazabilidad: E-32 · Responsable solo ve reservas de sus ambientes
            var misAmbientes = await _ambienteRepository.ObtenerPorResponsableAsync(idUsuario, cancellationToken);
            ambientesPermitidos = misAmbientes.Select(a => a.Id_Ambiente).ToList();
        }

        var (items, total) = await _reservaRepository.ObtenerPaginadoAsync(
            fecha,
            ambienteId,
            estadoEnum,
            filtroUsuario,
            ambientesPermitidos,
            pagina,
            tamanoPagina,
            cancellationToken);

        return new PaginaReservasDto(
            items.Select(ReservaMapper.ToDto),
            total,
            pagina,
            tamanoPagina
        );
    }

    public async Task<ReservaDto> ObtenerPorIdAsync(
        Guid id,
        Guid idUsuario,
        RolUsuario rolUsuario,
        CancellationToken cancellationToken = default)
    {
        var reserva = await _reservaRepository.ObtenerPorIdAsync(id, cancellationToken)
            ?? throw new DomainException("Reserva no encontrada.", 404);

        if (rolUsuario == RolUsuario.Solicitante && reserva.Idu_Reserva != idUsuario)
            throw new DomainException("No tiene permisos para consultar esta reserva.", 403);

        if (rolUsuario == RolUsuario.Responsable)
        {
            var misAmbientes = await _ambienteRepository.ObtenerPorResponsableAsync(idUsuario, cancellationToken);
            if (!misAmbientes.Any(a => a.Id_Ambiente == reserva.Ida_Reserva))
                throw new DomainException("No tiene permisos para consultar reservas de este ambiente.", 403);
        }

        return ReservaMapper.ToDto(reserva);
    }

    public async Task<ReservaDto> CambiarEstadoAsync(
        Guid id,
        string nuevoEstadoStr,
        Guid idActor,
        RolUsuario rolActor,
        CancellationToken cancellationToken = default)
    {
        if (!Enum.TryParse<EstadoReserva>(nuevoEstadoStr, true, out var nuevoEstado))
            throw new DomainException(Mensajes.TransicionEstadoInvalida, 400);

        var reserva = await _reservaRepository.ObtenerPorIdAsync(id, cancellationToken)
            ?? throw new DomainException("Reserva no encontrada.", 404);

        // Trazabilidad: E-17 · E-31 · Aprobación con transacción serializable y chequeo de colisión
        if (nuevoEstado == EstadoReserva.Aprobada)
        {
            await _reservaRepository.EjecutarEnTransaccionSerializableAsync(async () =>
            {
                var conflicto = await _reservaRepository.HayConflictoAprobadoAsync(
                    reserva.Ida_Reserva,
                    reserva.Fec_Reserva,
                    reserva.Hin_Reserva,
                    reserva.Hfi_Reserva,
                    reserva.Id_Reserva,
                    cancellationToken);

                if (conflicto)
                    throw new DomainException(Mensajes.ConflictoDisponibilidad, 409);

                reserva.CambiarEstado(nuevoEstado, rolActor, idActor);
                await _reservaRepository.ActualizarAsync(reserva, cancellationToken);
            }, cancellationToken);
        }
        else
        {
            reserva.CambiarEstado(nuevoEstado, rolActor, idActor);
            await _reservaRepository.ActualizarAsync(reserva, cancellationToken);
        }

        var actualizada = await _reservaRepository.ObtenerPorIdAsync(id, cancellationToken);
        return ReservaMapper.ToDto(actualizada ?? reserva);
    }
}
