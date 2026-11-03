using ReservaUPLA.Application.DTOs;
using ReservaUPLA.Application.Interfaces;
using ReservaUPLA.Domain.Entities;

namespace ReservaUPLA.Application.Services;

public class ReservaService : IReservaService
{
    private readonly IReservaRepository _reservaRepository;
    private readonly IAmbienteRepository _ambienteRepository;
    private readonly IUsuarioRepository _usuarioRepository;

    private static readonly TimeSpan LimiteInicio = new(7, 0, 0);   // 07:00
    private static readonly TimeSpan LimiteFin = new(22, 0, 0);     // 22:00

    public ReservaService(
        IReservaRepository reservaRepository,
        IAmbienteRepository ambienteRepository,
        IUsuarioRepository usuarioRepository)
    {
        _reservaRepository = reservaRepository;
        _ambienteRepository = ambienteRepository;
        _usuarioRepository = usuarioRepository;
    }

    public async Task<ReservaResponseDto> CrearReservaAsync(CreateReservaDto dto)
    {
        // RN-02: Campos obligatorios
        if (dto.UsuarioId == Guid.Empty)
            throw new ArgumentException("El solicitante es obligatorio (RN-02).");
        if (dto.AmbienteId == Guid.Empty)
            throw new ArgumentException("El ambiente es obligatorio (RN-02).");
        if (string.IsNullOrWhiteSpace(dto.Motivo))
            throw new ArgumentException("El motivo de la reserva es obligatorio (RN-02).");

        // RN-03: Hora de fin debe ser mayor a hora de inicio
        if (dto.HoraFin <= dto.HoraInicio)
            throw new ArgumentException("La hora de fin debe ser mayor que la hora de inicio (RN-03).");

        // RN-04: Rango permitido de 07:00 a 22:00
        if (dto.HoraInicio < LimiteInicio || dto.HoraFin > LimiteFin)
            throw new ArgumentException("Las reservas solo pueden realizarse entre las 07:00 y las 22:00 horas (RN-04).");

        // Validar existencia de usuario y ambiente
        var usuario = await _usuarioRepository.GetByIdAsync(dto.UsuarioId)
            ?? throw new KeyNotFoundException("El usuario solicitante no existe.");
        if (!usuario.Activo)
            throw new InvalidOperationException("El usuario solicitante no se encuentra activo.");

        var ambiente = await _ambienteRepository.GetByIdAsync(dto.AmbienteId)
            ?? throw new KeyNotFoundException("El ambiente seleccionado no existe.");
        if (ambiente.Estado != "Disponible")
            throw new InvalidOperationException($"El ambiente no está disponible (Estado actual: {ambiente.Estado}).");

        // RN-01 & RF-04: Validar disponibilidad antes de registrar
        var existeConflicto = await _reservaRepository.ExisteConflictoAprobadoAsync(
            dto.AmbienteId,
            dto.Fecha,
            dto.HoraInicio,
            dto.HoraFin);

        if (existeConflicto)
            throw new InvalidOperationException("El ambiente ya cuenta con una reserva aprobada en la fecha y horario solicitado (RN-01).");

        var reserva = new Reserva
        {
            Fecha = dto.Fecha,
            HoraInicio = dto.HoraInicio,
            HoraFin = dto.HoraFin,
            Motivo = dto.Motivo.Trim(),
            Estado = "Pendiente",
            UsuarioId = dto.UsuarioId,
            AmbienteId = dto.AmbienteId,
            FechaRegistro = DateTime.UtcNow
        };

        var creada = await _reservaRepository.AddAsync(reserva);
        return MapToResponse(creada);
    }

    public async Task<IEnumerable<ReservaResponseDto>> ListarReservasAsync(DateOnly? fecha = null, Guid? ambienteId = null, string? estado = null)
    {
        var reservas = await _reservaRepository.GetAllAsync(fecha, ambienteId, estado);
        return reservas.Select(MapToResponse);
    }

    public async Task<ReservaResponseDto?> ObtenerPorIdAsync(Guid id)
    {
        var reserva = await _reservaRepository.GetByIdAsync(id);
        return reserva is null ? null : MapToResponse(reserva);
    }

    public async Task<ReservaResponseDto> CambiarEstadoAsync(Guid id, CambiarEstadoReservaDto dto)
    {
        var reserva = await _reservaRepository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Reserva con ID {id} no encontrada.");

        // RN-06: Una reserva rechazada no podrá modificarse
        if (reserva.Estado == "Rechazada")
            throw new InvalidOperationException("Una reserva rechazada no puede modificarse (RN-06).");

        var estadoNormalizado = dto.NuevoEstado.Trim();
        var estadosValidos = new[] { "Aprobada", "Rechazada", "Cancelada", "Pendiente" };
        if (!estadosValidos.Contains(estadoNormalizado, StringComparer.OrdinalIgnoreCase))
            throw new ArgumentException($"Estado no válido: {dto.NuevoEstado}. Estados permitidos: {string.Join(", ", estadosValidos)}");

        // Si se va a aprobar, validar nuevamente que no haya colisión (RN-01)
        if (estadoNormalizado.Equals("Aprobada", StringComparison.OrdinalIgnoreCase))
        {
            var conflicto = await _reservaRepository.ExisteConflictoAprobadoAsync(
                reserva.AmbienteId,
                reserva.Fecha,
                reserva.HoraInicio,
                reserva.HoraFin,
                excludeReservaId: reserva.Id);

            if (conflicto)
                throw new InvalidOperationException("No se puede aprobar la reserva porque ya existe otra reserva aprobada en este horario (RN-01).");
        }

        reserva.Estado = estadoNormalizado;
        if (!string.IsNullOrWhiteSpace(dto.ObservacionAdmin))
        {
            reserva.ObservacionAdmin = dto.ObservacionAdmin.Trim();
        }

        var actualizada = await _reservaRepository.UpdateAsync(reserva);
        return MapToResponse(actualizada);
    }

    public async Task<DisponibilidadResponseDto> ValidarDisponibilidadAsync(ValidarDisponibilidadDto dto)
    {
        if (dto.HoraFin <= dto.HoraInicio)
        {
            return new DisponibilidadResponseDto(false, "La hora de fin debe ser mayor que la hora de inicio.");
        }

        if (dto.HoraInicio < LimiteInicio || dto.HoraFin > LimiteFin)
        {
            return new DisponibilidadResponseDto(false, "El horario debe encontrarse dentro del rango permitido (07:00 - 22:00).");
        }

        var conflicto = await _reservaRepository.ExisteConflictoAprobadoAsync(
            dto.AmbienteId,
            dto.Fecha,
            dto.HoraInicio,
            dto.HoraFin);

        if (conflicto)
        {
            return new DisponibilidadResponseDto(false, "No disponible: Existe una reserva aprobada en ese horario.");
        }

        return new DisponibilidadResponseDto(true, "Ambiente disponible para reservar.");
    }

    private static ReservaResponseDto MapToResponse(Reserva r) => new(
        r.Id,
        r.Fecha,
        r.HoraInicio,
        r.HoraFin,
        r.Motivo,
        r.Estado,
        r.ObservacionAdmin,
        r.FechaRegistro,
        r.UsuarioId,
        r.Usuario?.NombreCompleto ?? "Sin usuario",
        r.Usuario?.Correo ?? "",
        r.AmbienteId,
        r.Ambiente?.Nombre ?? "Sin ambiente",
        r.Ambiente?.Tipo ?? "",
        r.Ambiente?.Ubicacion ?? ""
    );
}
