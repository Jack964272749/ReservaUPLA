namespace ReservaUpla.Domain.Constants;

// Trazabilidad: Nielsen H5 - Prevención de errores · Reglas institucionales de reserva (RN-01 a RN-06, RV-08 a RV-17)
public static class ReglasReserva
{
    public static readonly TimeSpan HoraApertura = new(7, 0, 0);  // 07:00 (RN-04)
    public static readonly TimeSpan HoraCierre = new(22, 0, 0);   // 22:00 (RN-04)
    public const int MinLongitudMotivo = 10;                     // RV-12
    public const int MaxLongitudMotivo = 500;                    // RV-12
}
