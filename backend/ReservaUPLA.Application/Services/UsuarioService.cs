using ReservaUpla.Application.DTOs;
using ReservaUpla.Application.Interfaces;
using ReservaUpla.Application.Mappers;
using ReservaUpla.Domain.Constants;
using ReservaUpla.Domain.Enums;
using ReservaUpla.Domain.Exceptions;

namespace ReservaUpla.Application.Services;

// Trazabilidad: RF-01 · Gestión administrativa de usuarios (modificar datos y estado)
public class UsuarioService : IUsuarioService
{
    private readonly IUsuarioRepository _usuarioRepository;

    public UsuarioService(IUsuarioRepository usuarioRepository)
    {
        _usuarioRepository = usuarioRepository;
    }

    public async Task<IEnumerable<UsuarioDto>> ObtenerTodosAsync(CancellationToken cancellationToken = default)
    {
        var usuarios = await _usuarioRepository.ObtenerTodosAsync(cancellationToken);
        return usuarios.Select(UsuarioMapper.ToDto);
    }

    public async Task<UsuarioDto> ActualizarAsync(Guid id, ActualizarUsuarioDto dto, Guid adminEjecutorId, CancellationToken cancellationToken = default)
    {
        var usuario = await _usuarioRepository.ObtenerPorIdAsync(id, cancellationToken);
        if (usuario is null)
            throw new DomainException(Mensajes.UsuarioNoExiste, 404);

        if (!Enum.TryParse<RolUsuario>(dto.Rol, true, out var rolEnum))
            throw new DomainException(Mensajes.RolInvalido, 400);

        if (id == adminEjecutorId && !dto.Activo)
            throw new DomainException(Mensajes.NoSePuedeDesactivarPropiaCuenta, 400);

        usuario.Actualizar(dto.NombreCompleto, rolEnum, dto.Activo);
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
