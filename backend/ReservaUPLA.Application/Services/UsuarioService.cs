using ReservaUpla.Application.DTOs;
using ReservaUpla.Application.Interfaces;
using ReservaUpla.Application.Mappers;
using ReservaUpla.Domain.Constants;
using ReservaUpla.Domain.Entities;
using ReservaUpla.Domain.Enums;
using ReservaUpla.Domain.Exceptions;

namespace ReservaUpla.Application.Services;

// Trazabilidad: RF-01 · Gestión administrativa de usuarios (creación, modificación y activación)
public class UsuarioService : IUsuarioService
{
    private readonly IUsuarioRepository _usuarioRepository;
    private readonly IPasswordHasherService _passwordHasher;

    public UsuarioService(IUsuarioRepository usuarioRepository, IPasswordHasherService passwordHasher)
    {
        _usuarioRepository = usuarioRepository;
        _passwordHasher = passwordHasher;
    }

    public async Task<IEnumerable<UsuarioDto>> ObtenerTodosAsync(CancellationToken cancellationToken = default)
    {
        var usuarios = await _usuarioRepository.ObtenerTodosAsync(cancellationToken);
        return usuarios.Select(UsuarioMapper.ToDto);
    }

    public async Task<UsuarioDto> CrearPorAdminAsync(CrearUsuarioPorAdminDto dto, CancellationToken cancellationToken = default)
    {
        var nomNorm = ReglasUsuario.NormalizarNombre(dto.NombreCompleto);
        var corNorm = ReglasUsuario.NormalizarCorreo(dto.Correo);

        var existente = await _usuarioRepository.ObtenerPorCorreoAsync(corNorm, cancellationToken);
        if (existente is not null)
            throw new DomainException($"El correo institucional '{corNorm}' ya se encuentra registrado.", 409);

        if (!Enum.TryParse<RolUsuario>(dto.Rol, true, out var rolEnum))
            throw new DomainException(Mensajes.RolInvalido, 400);

        if (string.IsNullOrWhiteSpace(dto.Contrasena) || dto.Contrasena.Length < ReglasUsuario.MinLongitudClave || dto.Contrasena.Length > ReglasUsuario.MaxLongitudClave)
            throw new DomainException(Mensajes.ClaveLongitud, 400);

        var hash = _passwordHasher.Hash(dto.Contrasena);
        var usuario = Usuario.Crear(
            nomNorm,
            corNorm,
            hash,
            rolEnum,
            dto.Codigo,
            dto.Activo);

        await _usuarioRepository.AgregarAsync(usuario, cancellationToken);
        return UsuarioMapper.ToDto(usuario);
    }

    public async Task<UsuarioDto> ActualizarAsync(Guid id, ActualizarUsuarioDto dto, Guid adminEjecutorId, CancellationToken cancellationToken = default)
    {
        var usuario = await _usuarioRepository.ObtenerPorIdAsync(id, cancellationToken);
        if (usuario is null)
            throw new DomainException(Mensajes.UsuarioNoExiste, 404);

        if (!Enum.TryParse<RolUsuario>(dto.Rol, true, out var rolEnum))
            throw new DomainException(Mensajes.RolInvalido, 400);

        if (rolEnum != usuario.Rol_Usuario)
            throw new DomainException(Mensajes.RolNoModificable, 400);

        if (id == adminEjecutorId && !dto.Activo)
            throw new DomainException(Mensajes.NoSePuedeDesactivarPropiaCuenta, 400);

        usuario.Actualizar(dto.NombreCompleto, rolEnum, dto.Activo, dto.Codigo);
        await _usuarioRepository.ActualizarAsync(usuario, cancellationToken);

        return UsuarioMapper.ToDto(usuario);
    }

    public async Task<UsuarioDto> CambiarEstadoAsync(Guid id, bool activo, Guid adminEjecutorId, CancellationToken cancellationToken = default)
    {
        var usuario = await _usuarioRepository.ObtenerPorIdAsync(id, cancellationToken);
        if (usuario is null)
            throw new DomainException(Mensajes.UsuarioNoExiste, 404);

        if (id == adminEjecutorId && !activo)
            throw new DomainException(Mensajes.NoSePuedeDesactivarPropiaCuenta, 400);

        usuario.CambiarEstado(activo);
        await _usuarioRepository.ActualizarAsync(usuario, cancellationToken);

        return UsuarioMapper.ToDto(usuario);
    }
}
