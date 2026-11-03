namespace ReservaUpla.Application.DTOs;

public record DashboardDto(
    int TotalReservas,
    int ReservasPendientes,
    int ReservasAprobadas,
    int ReservasRechazadas,
    string AmbienteMasUtilizado,
    int CantidadAmbienteMasUtilizado
);
