namespace ReservaUpla.Application.DTOs;

public record CrearReservaDto(
    DateOnly Fecha,
    TimeSpan HoraInicio,
    TimeSpan HoraFin,
    string Motivo,
    Guid AmbienteId
);

public record CambiarEstadoDto(
    string NuevoEstado
);

public record DisponibilidadDiaDto(
    TimeSpan HoraInicio,
    TimeSpan HoraFin,
    string Estado
);

public record ReservaDto(
    Guid Id,
    DateOnly Fecha,
    TimeSpan HoraInicio,
    TimeSpan HoraFin,
    string Motivo,
    string Estado,
    Guid UsuarioId,
    string UsuarioNombre,
    string UsuarioCorreo,
    Guid AmbienteId,
    string AmbienteNombre,
    string AmbienteTipo,
    string AmbienteUbicacion,
    DateTime FechaRegistro
);

public record PaginaReservasDto(
    IEnumerable<ReservaDto> Items,
    int TotalItems,
    int Pagina,
    int TamanoPagina
);
