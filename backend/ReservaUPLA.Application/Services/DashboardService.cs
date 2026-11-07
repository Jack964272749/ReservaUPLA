using ReservaUpla.Application.DTOs;
using ReservaUpla.Application.Interfaces;
using ReservaUpla.Domain.Enums;

namespace ReservaUpla.Application.Services;

// Trazabilidad: RF-08 · E-30 · Indicadores calculados en servidor y analítica universitaria
public class DashboardService : IDashboardService
{
    private readonly IReservaRepository _reservaRepository;
    private readonly IRelojService _relojService;

    public DashboardService(IReservaRepository reservaRepository, IRelojService relojService)
    {
        _reservaRepository = reservaRepository;
        _relojService = relojService;
    }

    public async Task<DashboardDto> ObtenerIndicadoresAsync(CancellationToken cancellationToken = default)
    {
        var total = await _reservaRepository.ContarPorEstadoAsync(null, cancellationToken);
        var pendientes = await _reservaRepository.ContarPorEstadoAsync(EstadoReserva.Pendiente, cancellationToken);
        var aprobadas = await _reservaRepository.ContarPorEstadoAsync(EstadoReserva.Aprobada, cancellationToken);
        var rechazadas = await _reservaRepository.ContarPorEstadoAsync(EstadoReserva.Rechazada, cancellationToken);
        var masUtilizado = await _reservaRepository.ObtenerAmbienteMasUtilizadoAsync(cancellationToken);

        var tasaAprobacion = total > 0
            ? Math.Round((double)aprobadas / total * 100, 1)
            : 0.0;

        var porTipo = await _reservaRepository.ObtenerDistribucionPorTipoAmbienteAsync(cancellationToken);

        var hoyLima = _relojService.HoyLima();
        var reservasHoyEntidades = await _reservaRepository.ObtenerReservasDeFechaAsync(hoyLima, 6, cancellationToken);

        var reservasHoy = reservasHoyEntidades.Select(r => new ReservaResumenDto(
            r.Id_Reserva,
            r.Ambiente?.Nom_Ambiente ?? "Ambiente sin nombre",
            r.Usuario?.Nom_Usuario ?? "Solicitante",
            r.Hin_Reserva.ToString(@"hh\:mm"),
            r.Hfi_Reserva.ToString(@"hh\:mm"),
            r.Est_Reserva.ToString(),
            r.Mot_Reserva
        )).ToList();

        return new DashboardDto(
            TotalReservas: total,
            ReservasPendientes: pendientes,
            ReservasAprobadas: aprobadas,
            ReservasRechazadas: rechazadas,
            AmbienteMasUtilizado: masUtilizado?.NombreAmbiente ?? "Sin registros",
            CantidadAmbienteMasUtilizado: masUtilizado?.Cantidad ?? 0,
            TasaAprobacion: tasaAprobacion,
            ReservasPorTipo: porTipo,
            ReservasHoy: reservasHoy
        );
    }
}
