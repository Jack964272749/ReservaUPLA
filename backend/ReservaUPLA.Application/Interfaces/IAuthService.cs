using ReservaUpla.Application.DTOs;

namespace ReservaUpla.Application.Interfaces;

public interface IAuthService
{
    Task<UsuarioDto> LoginAsync(LoginDto dto, CancellationToken cancellationToken = default);
    Task<UsuarioDto> RegistrarSolicitanteAsync(RegistroSolicitanteDto dto, CancellationToken cancellationToken = default);
    Task<UsuarioDto> ObtenerUsuarioPorIdAsync(Guid id, CancellationToken cancellationToken = default);
}
