namespace ReservaUPLA.Application.DTOs;

public record CreateReservaDto(
    DateOnly Fecha,
    TimeSpan HoraInicio,
    TimeSpan HoraFin,
    string Motivo,
    Guid UsuarioId,
    Guid AmbienteId
);

public record CambiarEstadoReservaDto(
    string NuevoEstado, // Aprobada, Rechazada, Cancelada
    string? ObservacionAdmin
);

public record ValidarDisponibilidadDto(
    Guid AmbienteId,
    DateOnly Fecha,
    TimeSpan HoraInicio,
    TimeSpan HoraFin
);

public record DisponibilidadResponseDto(
    bool Disponible,
    string Mensaje
);

public record ReservaResponseDto(
    Guid Id,
    DateOnly Fecha,
    TimeSpan HoraInicio,
    TimeSpan HoraFin,
    string Motivo,
    string Estado,
    string? ObservacionAdmin,
    DateTime FechaRegistro,
    Guid UsuarioId,
    string UsuarioNombre,
    string UsuarioCorreo,
    Guid AmbienteId,
    string AmbienteNombre,
    string AmbienteTipo,
    string AmbienteUbicacion
);
