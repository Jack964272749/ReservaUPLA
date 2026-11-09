using ReservaUpla.Application.DTOs;
using ReservaUpla.Application.Interfaces;
using ReservaUpla.Application.Mappers;
using ReservaUpla.Domain.Constants;
using ReservaUpla.Domain.Entities;
using ReservaUpla.Domain.Enums;
using ReservaUpla.Domain.Exceptions;

namespace ReservaUpla.Application.Services;

// Trazabilidad: Nielsen H5 · Shneiderman 5 · Seguridad y Autenticación HttpOnly
public class AuthService : IAuthService
{
    private readonly IUsuarioRepository _usuarioRepository;
    private readonly IPasswordHasherService _passwordHasher;

    public AuthService(IUsuarioRepository usuarioRepository, IPasswordHasherService passwordHasher)
    {
        _usuarioRepository = usuarioRepository;
        _passwordHasher = passwordHasher;
    }

    public async Task<UsuarioDto> LoginAsync(LoginDto dto, CancellationToken cancellationToken = default)
    {
        var corNorm = ReglasUsuario.NormalizarCorreo(dto.Correo);
        var usuario = await _usuarioRepository.ObtenerPorCorreoAsync(corNorm, cancellationToken);

        if (usuario is null || !usuario.Act_Usuario)
        {
            // Trazabilidad: E-08 · Mitigación de timing attack ejecutando hash ficticio
            _passwordHasher.VerifyDummy();
            throw new DomainException(Mensajes.CredencialesInvalidas, 401);
        }

        var valido = _passwordHasher.Verify(usuario.Has_Usuario, dto.Contrasena);
        if (!valido)
        {
            throw new DomainException(Mensajes.CredencialesInvalidas, 401);
        }

        return UsuarioMapper.ToDto(usuario);
    }

    public async Task<UsuarioDto> RegistrarSolicitanteAsync(RegistroSolicitanteDto dto, CancellationToken cancellationToken = default)
    {
        var corNorm = ReglasUsuario.NormalizarCorreo(dto.Correo);
        var existente = await _usuarioRepository.ObtenerPorCorreoAsync(corNorm, cancellationToken);
        if (existente is not null)
            throw new DomainException($"El correo '{corNorm}' ya se encuentra registrado (E-04).", 409);

        if (string.IsNullOrWhiteSpace(dto.Contrasena) || dto.Contrasena.Length < ReglasUsuario.MinLongitudClave || dto.Contrasena.Length > ReglasUsuario.MaxLongitudClave)
            throw new DomainException(Mensajes.ClaveLongitud);

        var hash = _passwordHasher.Hash(dto.Contrasena);

        // Al ser un software universitario, el auto-registro queda en estado PENDIENTE DE VALIDACIÓN (activo = false)
        // hasta que el Administrador Central lo valide y active en el módulo de Usuarios.
        var usuario = Usuario.Crear(
            dto.NombreCompleto,
            corNorm,
            hash,
            RolUsuario.Solicitante,
            dto.Codigo,
            activo: false);

        await _usuarioRepository.AgregarAsync(usuario, cancellationToken);
        return UsuarioMapper.ToDto(usuario);
    }

    public async Task<UsuarioDto> ObtenerUsuarioPorIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var usuario = await _usuarioRepository.ObtenerPorIdAsync(id, cancellationToken);
        if (usuario is null)
            throw new DomainException("Usuario no encontrado.", 404);

        return UsuarioMapper.ToDto(usuario);
    }
}
