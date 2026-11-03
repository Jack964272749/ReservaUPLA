using ReservaUpla.Application.DTOs;
using ReservaUpla.Application.Interfaces;
using ReservaUpla.Application.Mappers;
using ReservaUpla.Domain.Entities;
using ReservaUpla.Domain.Enums;
using ReservaUpla.Domain.Exceptions;

namespace ReservaUpla.Application.Services;

public class AmbienteService : IAmbienteService
{
    private readonly IAmbienteRepository _ambienteRepository;
    private readonly IReservaRepository _reservaRepository;

    public AmbienteService(IAmbienteRepository ambienteRepository, IReservaRepository reservaRepository)
    {
        _ambienteRepository = ambienteRepository;
        _reservaRepository = reservaRepository;
    }

    public async Task<IEnumerable<AmbienteDto>> ObtenerTodosAsync(CancellationToken cancellationToken = default)
    {
        var ambientes = await _ambienteRepository.ObtenerTodosAsync(cancellationToken);
        return ambientes.Select(AmbienteMapper.ToDto);
    }

    public async Task<AmbienteDto> ObtenerPorIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var ambiente = await _ambienteRepository.ObtenerPorIdAsync(id, cancellationToken);
        if (ambiente is null)
            throw new DomainException($"Ambiente con ID {id} no encontrado.", 404);

        return AmbienteMapper.ToDto(ambiente);
    }

    public async Task<AmbienteDto> CrearAsync(CrearAmbienteDto dto, CancellationToken cancellationToken = default)
    {
        if (!Enum.TryParse<TipAmbiente>(dto.Tipo, true, out var tipoEnum))
            throw new DomainException($"Tipo de ambiente inválido: '{dto.Tipo}'. Opciones válidas: LaboratorioComputo, Auditorio, SalaReuniones, LaboratorioEspecializado (RV-05).");

        var ambiente = Ambiente.Crear(dto.Nombre, tipoEnum, dto.Capacidad, dto.Ubicacion, dto.ResponsableId);
        await _ambienteRepository.AgregarAsync(ambiente, cancellationToken);
        return AmbienteMapper.ToDto(ambiente);
    }

    // Trazabilidad: RF-04 · Shneiderman 8 (Disponibilidad visible para reducir memoria a corto plazo)
    public async Task<IEnumerable<DisponibilidadDiaDto>> ConsultarDisponibilidadAsync(
        Guid ambienteId,
        DateOnly fecha,
        CancellationToken cancellationToken = default)
    {
        var reservas = await _reservaRepository.ObtenerPorAmbienteYFechaAsync(ambienteId, fecha, cancellationToken);
        return reservas
            .OrderBy(r => r.Hin_Reserva)
            .Select(r => new DisponibilidadDiaDto(r.Hin_Reserva, r.Hfi_Reserva, r.Est_Reserva.ToString()));
    }
}
