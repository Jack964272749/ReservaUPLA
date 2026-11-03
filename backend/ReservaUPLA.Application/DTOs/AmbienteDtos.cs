namespace ReservaUPLA.Application.DTOs;

public record CreateAmbienteDto(
    string Nombre,
    string Tipo,
    int Capacidad,
    string Ubicacion
);

public record AmbienteResponseDto(
    Guid Id,
    string Nombre,
    string Tipo,
    int Capacidad,
    string Ubicacion,
    string Estado,
    DateTime FechaCreacion
);
