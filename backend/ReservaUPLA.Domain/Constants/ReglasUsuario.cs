using System.Text.RegularExpressions;

namespace ReservaUpla.Domain.Constants;

// Trazabilidad: Nielsen H5 - Prevención de errores · Reglas de validación para Usuario (RV-01, RV-02, RV-03)
public static class ReglasUsuario
{
    public const int MinLongitudNombre = 3;
    public const int MaxLongitudNombre = 150;
    public const int MaxLongitudCorreo = 150;
    public const int MinLongitudClave = 8;
    public const int MaxLongitudClave = 64;

    // Solo letras, espacios y tildes (RV-02)
    public static readonly Regex RegexNombreValido = new(@"^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$", RegexOptions.Compiled);
    public static readonly Regex RegexCorreoValido = new(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", RegexOptions.Compiled);

    public static string NormalizarCorreo(string correo) =>
        correo?.Trim().ToLowerInvariant() ?? string.Empty;

    public static string NormalizarNombre(string nombre) =>
        nombre?.Trim() ?? string.Empty;
}
