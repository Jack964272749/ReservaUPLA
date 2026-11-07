namespace ReservaUpla.Application.DTOs;

// Trazabilidad: RF-08 · Indicadores de gestión y analítica de campus
public record ReservaResumenDto(
    Guid Id,
    string NombreAmbiente,
    string NombreSolicitante,
    string HoraInicio,
    string HoraFin,
    string Estado,
    string Motivo
);

public record DashboardDto(
    int TotalReservas,
    int ReservasPendientes,
    int ReservasAprobadas,
    int ReservasRechazadas,
    string AmbienteMasUtilizado,
    int CantidadAmbienteMasUtilizado,
    double TasaAprobacion = 0,
    Dictionary<string, int>? ReservasPorTipo = null,
    List<ReservaResumenDto>? ReservasHoy = null
);
