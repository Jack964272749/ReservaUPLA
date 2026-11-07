using ReservaUpla.Domain.Entities;

namespace ReservaUpla.Application.Interfaces;

public interface IUsuarioRepository
{
    Task<Usuario?> ObtenerPorIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Usuario?> ObtenerPorCorreoAsync(string correo, CancellationToken cancellationToken = default);
    Task<IEnumerable<Usuario>> ObtenerTodosAsync(CancellationToken cancellationToken = default);
    Task AgregarAsync(Usuario usuario, CancellationToken cancellationToken = default);
    Task ActualizarAsync(Usuario usuario, CancellationToken cancellationToken = default);
}
