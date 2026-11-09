namespace ReservaUpla.Application.DTOs;

// Trazabilidad: Nielsen H4 - Consistencia · DTOs camelCase en español
public record LoginDto(string Correo, string Contrasena);

public record RegistroSolicitanteDto(
    string NombreCompleto,
    string Correo,
    string Contrasena,
    string? Codigo = null
);

public record CrearUsuarioPorAdminDto(
    string NombreCompleto,
    string Correo,
    string Rol,
    string Contrasena,
    string? Codigo = null,
    bool Activo = true
);

public record UsuarioDto(
    Guid Id,
    string NombreCompleto,
    string Correo,
    string Rol,
    bool Activo,
    string? Codigo = null
);

public record ActualizarUsuarioDto(
    string NombreCompleto,
    string Rol,
    bool Activo,
    string? Codigo = null
);

public record CambiarEstadoUsuarioDto(bool Activo);
