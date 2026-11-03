namespace ReservaUPLA.Application.DTOs;

public record DashboardIndicadoresDto(
    int TotalReservas,
    int ReservasPendientes,
    int ReservasAprobadas,
    int ReservasRechazadas,
    int ReservasCanceladas,
    string AmbienteMasUtilizado,
    int TotalAmbienteMasUtilizado
);
