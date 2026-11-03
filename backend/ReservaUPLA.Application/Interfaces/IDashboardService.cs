using ReservaUpla.Application.DTOs;

namespace ReservaUpla.Application.Interfaces;

public interface IDashboardService
{
    Task<DashboardDto> ObtenerIndicadoresAsync(CancellationToken cancellationToken = default);
}
