using ReservaUpla.Application.DTOs;

namespace ReservaUpla.Application.Interfaces;

// Trazabilidad: RF-01 · Servicio de gestión administrativa de usuarios
public interface IUsuarioService
{
    Task<IEnumerable<UsuarioDto>> ObtenerTodosAsync(CancellationToken cancellationToken = default);
    Task<UsuarioDto> CrearPorAdminAsync(CrearUsuarioPorAdminDto dto, CancellationToken cancellationToken = default);
    Task<UsuarioDto> ActualizarAsync(Guid id, ActualizarUsuarioDto dto, Guid adminEjecutorId, CancellationToken cancellationToken = default);
    Task<UsuarioDto> CambiarEstadoAsync(Guid id, bool activo, Guid adminEjecutorId, CancellationToken cancellationToken = default);
}
