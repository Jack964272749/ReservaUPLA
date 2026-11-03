namespace ReservaUPLA.Application.DTOs;

public record CreateUsuarioDto(
    string NombreCompleto,
    string Correo,
    string Rol
);

public record UsuarioResponseDto(
    Guid Id,
    string NombreCompleto,
    string Correo,
    string Rol,
    bool Activo,
    DateTime FechaCreacion
);
