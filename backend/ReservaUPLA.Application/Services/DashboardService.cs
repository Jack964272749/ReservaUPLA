using ReservaUPLA.Application.DTOs;
using ReservaUPLA.Application.Interfaces;

namespace ReservaUPLA.Application.Services;

public class DashboardService : IDashboardService
{
    private readonly IReservaRepository _reservaRepository;

    public DashboardService(IReservaRepository reservaRepository)
    {
        _reservaRepository = reservaRepository;
    }

    public async Task<DashboardIndicadoresDto> ObtenerIndicadoresAsync()
    {
        var total = await _reservaRepository.CountByEstadoAsync(null);
        var pendientes = await _reservaRepository.CountByEstadoAsync("Pendiente");
        var aprobadas = await _reservaRepository.CountByEstadoAsync("Aprobada");
        var rechazadas = await _reservaRepository.CountByEstadoAsync("Rechazada");
        var canceladas = await _reservaRepository.CountByEstadoAsync("Cancelada");

        var masUtilizado = await _reservaRepository.GetAmbienteMasUtilizadoAsync();

        return new DashboardIndicadoresDto(
            TotalReservas: total,
            ReservasPendientes: pendientes,
            ReservasAprobadas: aprobadas,
            ReservasRechazadas: rechazadas,
            ReservasCanceladas: canceladas,
            AmbienteMasUtilizado: masUtilizado?.AmbienteNombre ?? "Ninguno",
            TotalAmbienteMasUtilizado: masUtilizado?.Cantidad ?? 0
        );
    }
}
