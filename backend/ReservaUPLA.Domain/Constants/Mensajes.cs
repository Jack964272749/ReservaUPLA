namespace ReservaUpla.Domain.Constants;

// Trazabilidad: Nielsen H9 - Ayuda ante errores · Shneiderman 5 · Mensajes claros y no técnicos
public static class Mensajes
{
    public const string CorreoRequerido = "El correo electrónico es obligatorio. Ingrese su correo institucional (RV-01).";
    public const string CorreoInvalido = "El formato de correo no es válido. Ejemplo: usuario@upla.edu.pe (RV-01).";
    public const string NombreRequerido = "El nombre completo es obligatorio (RV-02).";
    public const string NombreLongitud = "El nombre debe tener entre 3 y 150 caracteres (RV-02).";
    public const string NombreInvalido = "El nombre solo puede contener letras, espacios y tildes (RV-02).";
    public const string ClaveRequerida = "La contraseña es obligatoria (RV-03).";
    public const string ClaveLongitud = "La contraseña debe tener entre 8 y 64 caracteres (RV-03).";
    public const string CredencialesInvalidas = "Credenciales incorrectas. Verifique correo y contraseña (E-08).";
    public const string UsuarioNoExiste = "El usuario especificado no existe.";
    public const string NoSePuedeDesactivarPropiaCuenta = "No puede desactivar su propia cuenta de administrador en uso.";
    public const string RolInvalido = "El rol especificado no es válido.";

    public const string NombreAmbienteRequerido = "El nombre del ambiente es obligatorio (RV-04).";
    public const string NombreAmbienteLongitud = "El nombre del ambiente debe tener entre 3 y 100 caracteres (RV-04).";
    public const string CapacidadInvalida = "La capacidad debe ser un número entero entre 1 y 1000 personas (RV-06, E-11).";
    public const string UbicacionRequerida = "La ubicación del ambiente es obligatoria (RV-07).";
    public const string UbicacionLongitud = "La ubicación del ambiente no puede exceder 100 caracteres (RV-07).";
    public const string ResponsableNoExiste = "El responsable asignado no existe.";
    public const string UsuarioNoEsResponsable = "El usuario asignado debe tener el rol Responsable y encontrarse activo.";
    public const string AmbienteNoDisponible = "El ambiente seleccionado no se encuentra en estado Disponible (RV-13).";

    public const string FechaPasada = "La fecha de reserva no puede pertenecer al pasado (RV-08, E-16).";
    public const string HorasRequeridas = "Las horas de inicio y fin son obligatorias (RV-09).";
    public const string HoraFinMenorIgual = "La hora de fin debe ser estrictamente posterior a la hora de inicio (RN-03, RV-10, E-14).";
    public const string HorarioFueraRango = "Las reservas solo pueden realizarse dentro del horario de 07:00 a 22:00 horas (RN-04, RV-11, E-15).";
    public const string MotivoLongitud = "El motivo debe detallar el uso académico entre 10 y 500 caracteres (RV-12).";
    public const string ConflictoDisponibilidad = "El ambiente ya cuenta con una reserva aprobada en este horario (RN-01, RV-14, E-17).";
    public const string ReservaRechazadaInmodificable = "Una reserva rechazada no puede ser modificada ni reactivada (RN-06, RV-15, E-20).";
    public const string SoloAdminApruebaRechaza = "Solo el Administrador tiene autorización para aprobar o rechazar reservas (RN-05, RV-16, E-18).";
    public const string SolicitanteSoloCancelaPropia = "Solo puede cancelar reservas solicitadas por usted mismo (RV-17).";
    public const string SoloAdminOSolicitanteDuenioCancela = "Solo el Administrador o el Solicitante dueño de la reserva tienen autorización para cancelarla.";
    public const string TransicionEstadoInvalida = "La transición de estado solicitada no es válida para el ciclo de vida de la reserva (RV-15, E-21).";
}
