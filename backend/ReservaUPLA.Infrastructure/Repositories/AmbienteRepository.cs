using Microsoft.EntityFrameworkCore;
using ReservaUPLA.Application.Interfaces;
using ReservaUPLA.Domain.Entities;
using ReservaUPLA.Infrastructure.Data;

namespace ReservaUPLA.Infrastructure.Repositories;

public class AmbienteRepository : IAmbienteRepository
{
    private readonly AppDbContext _context;

    public AmbienteRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Ambiente?> GetByIdAsync(Guid id)
    {
        return await _context.Ambientes.FindAsync(id);
    }

    public async Task<IEnumerable<Ambiente>> GetAllAsync()
    {
        return await _context.Ambientes
            .OrderBy(a => a.Nombre)
            .ToListAsync();
    }

    public async Task<Ambiente> AddAsync(Ambiente ambiente)
    {
        await _context.Ambientes.AddAsync(ambiente);
        await _context.SaveChangesAsync();
        return ambiente;
    }

    public async Task<Ambiente> UpdateAsync(Ambiente ambiente)
    {
        _context.Ambientes.Update(ambiente);
        await _context.SaveChangesAsync();
        return ambiente;
    }
}
