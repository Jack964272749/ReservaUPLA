using ReservaUPLA.Domain.Entities;

namespace ReservaUPLA.Application.Interfaces;

public interface IUsuarioRepository
{
    Task<Usuario?> GetByIdAsync(Guid id);
    Task<IEnumerable<Usuario>> GetAllAsync();
    Task<Usuario?> GetByCorreoAsync(string correo);
    Task<Usuario> AddAsync(Usuario usuario);
}
