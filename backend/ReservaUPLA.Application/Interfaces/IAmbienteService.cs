using ReservaUpla.Application.DTOs;

namespace ReservaUpla.Application.Interfaces;

public interface IAmbienteService
{
    Task<IEnumerable<AmbienteDto>> ObtenerTodosAsync(CancellationToken cancellationToken = default);
    Task<AmbienteDto> ObtenerPorIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<AmbienteDto> CrearAsync(CrearAmbienteDto dto, CancellationToken cancellationToken = default);
    Task<IEnumerable<DisponibilidadDiaDto>> ConsultarDisponibilidadAsync(Guid ambienteId, DateOnly fecha, CancellationToken cancellationToken = default);
}
