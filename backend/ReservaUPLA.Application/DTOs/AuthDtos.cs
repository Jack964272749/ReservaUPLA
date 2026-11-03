namespace ReservaUpla.Application.DTOs;

// Trazabilidad: Nielsen H4 - Consistencia · DTOs camelCase en español
public record LoginDto(string Correo, string Contrasena);

public record RegistroSolicitanteDto(string NombreCompleto, string Correo, string Contrasena);

public record UsuarioDto(
    Guid Id,
    string NombreCompleto,
    string Correo,
    string Rol,
    bool Activo
);
