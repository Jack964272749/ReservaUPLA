namespace ReservaUpla.Application.DTOs;

public record CrearAmbienteDto(
    string Nombre,
    string Tipo,
    int Capacidad,
    string Ubicacion,
    Guid? ResponsableId
);

public record AmbienteDto(
    Guid Id,
    string Nombre,
    string Tipo,
    int Capacidad,
    string Ubicacion,
    string Estado,
    Guid? ResponsableId,
    string? ResponsableNombre
);
