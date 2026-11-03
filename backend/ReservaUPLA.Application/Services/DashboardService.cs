using ReservaUpla.Application.DTOs;
using ReservaUpla.Application.Interfaces;
using ReservaUpla.Domain.Enums;

namespace ReservaUpla.Application.Services;

// Trazabilidad: RF-08 · E-30 · Indicadores calculados en servidor
public class DashboardService : IDashboardService
{
    private readonly IReservaRepository _reservaRepository;

    public DashboardService(IReservaRepository reservaRepository)
    {
        _reservaRepository = reservaRepository;
    }

    public async Task<DashboardDto> ObtenerIndicadoresAsync(CancellationToken cancellationToken = default)
    {
        var total = await _reservaRepository.ContarPorEstadoAsync(null, cancellationToken);
        var pendientes = await _reservaRepository.ContarPorEstadoAsync(EstadoReserva.Pendiente, cancellationToken);
        var aprobadas = await _reservaRepository.ContarPorEstadoAsync(EstadoReserva.Aprobada, cancellationToken);
        var rechazadas = await _reservaRepository.ContarPorEstadoAsync(EstadoReserva.Rechazada, cancellationToken);
        var masUtilizado = await _reservaRepository.ObtenerAmbienteMasUtilizadoAsync(cancellationToken);

        return new DashboardDto(
            TotalReservas: total,
            ReservasPendientes: pendientes,
            ReservasAprobadas: aprobadas,
            ReservasRechazadas: rechazadas,
            AmbienteMasUtilizado: masUtilizado?.NombreAmbiente ?? "Sin registros",
            CantidadAmbienteMasUtilizado: masUtilizado?.Cantidad ?? 0
        );
    }
}
