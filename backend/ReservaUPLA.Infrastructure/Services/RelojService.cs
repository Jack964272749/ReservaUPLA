using ReservaUpla.Application.Interfaces;

namespace ReservaUpla.Infrastructure.Services;

// Trazabilidad: Zona Horaria · Cálculo de fecha en zona horaria institucional America/Lima (UTC-5)
public class RelojService : IRelojService
{
    private static readonly TimeZoneInfo ZonaLima = ObtenerZonaLima();

    public DateOnly HoyLima()
    {
        var ahoraLima = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, ZonaLima);
        return DateOnly.FromDateTime(ahoraLima);
    }

    private static TimeZoneInfo ObtenerZonaLima()
    {
        try
        {
            return TimeZoneInfo.FindSystemTimeZoneById("America/Lima");
        }
        catch (TimeZoneNotFoundException)
        {
            return TimeZoneInfo.FindSystemTimeZoneById("SA Pacific Standard Time");
        }
    }
}
