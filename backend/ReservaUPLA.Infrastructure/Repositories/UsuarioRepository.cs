using Microsoft.EntityFrameworkCore;
using ReservaUpla.Application.Interfaces;
using ReservaUpla.Domain.Entities;
using ReservaUpla.Infrastructure.Data;

namespace ReservaUpla.Infrastructure.Repositories;

public class UsuarioRepository : IUsuarioRepository
{
    private readonly AppDbContext _context;

    public UsuarioRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Usuario?> ObtenerPorIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Usuarios
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id_Usuario == id, cancellationToken);
    }

    public async Task<Usuario?> ObtenerPorCorreoAsync(string correo, CancellationToken cancellationToken = default)
    {
        var correoNorm = correo.Trim().ToLowerInvariant();
        return await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Cor_Usuario == correoNorm, cancellationToken);
    }

    public async Task<IEnumerable<Usuario>> ObtenerTodosAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Usuarios
            .AsNoTracking()
            .OrderBy(u => u.Nom_Usuario)
            .ToListAsync(cancellationToken);
    }

    public async Task AgregarAsync(Usuario usuario, CancellationToken cancellationToken = default)
    {
        await _context.Usuarios.AddAsync(usuario, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task ActualizarAsync(Usuario usuario, CancellationToken cancellationToken = default)
    {
        var local = _context.Usuarios.Local.FirstOrDefault(u => u.Id_Usuario == usuario.Id_Usuario);
        if (local != null && !ReferenceEquals(local, usuario))
        {
            _context.Entry(local).State = EntityState.Detached;
        }
        _context.Usuarios.Update(usuario);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
