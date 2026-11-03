using Microsoft.EntityFrameworkCore;
using ReservaUpla.Application.Interfaces;
using ReservaUpla.Domain.Entities;
using ReservaUpla.Infrastructure.Data;

namespace ReservaUpla.Infrastructure.Repositories;

public class AmbienteRepository : IAmbienteRepository
{
    private readonly AppDbContext _context;

    public AmbienteRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Ambiente?> ObtenerPorIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Ambientes
            .Include(a => a.Responsable)
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.Id_Ambiente == id, cancellationToken);
    }

    public async Task<IEnumerable<Ambiente>> ObtenerTodosAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Ambientes
            .Include(a => a.Responsable)
            .AsNoTracking()
            .OrderBy(a => a.Nom_Ambiente)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Ambiente>> ObtenerPorResponsableAsync(Guid idResponsable, CancellationToken cancellationToken = default)
    {
        return await _context.Ambientes
            .Where(a => a.Idr_Ambiente == idResponsable)
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    public async Task AgregarAsync(Ambiente ambiente, CancellationToken cancellationToken = default)
    {
        await _context.Ambientes.AddAsync(ambiente, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task ActualizarAsync(Ambiente ambiente, CancellationToken cancellationToken = default)
    {
        _context.Ambientes.Update(ambiente);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
