using Microsoft.EntityFrameworkCore;
using ReservaUPLA.Application.Interfaces;
using ReservaUPLA.Domain.Entities;
using ReservaUPLA.Infrastructure.Data;

namespace ReservaUPLA.Infrastructure.Repositories;

public class ReservaRepository : IReservaRepository
{
    private readonly AppDbContext _context;

    public ReservaRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Reserva?> GetByIdAsync(Guid id)
    {
        return await _context.Reservas
            .Include(r => r.Usuario)
            .Include(r => r.Ambiente)
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task<IEnumerable<Reserva>> GetAllAsync(DateOnly? fecha = null, Guid? ambienteId = null, string? estado = null)
    {
        var query = _context.Reservas
            .Include(r => r.Usuario)
            .Include(r => r.Ambiente)
            .AsQueryable();

        if (fecha.HasValue)
        {
            query = query.Where(r => r.Fecha == fecha.Value);
        }

        if (ambienteId.HasValue && ambienteId.Value != Guid.Empty)
        {
            query = query.Where(r => r.AmbienteId == ambienteId.Value);
        }

        if (!string.IsNullOrWhiteSpace(estado))
        {
            var est = estado.Trim();
            query = query.Where(r => r.Estado.ToLower() == est.ToLower());
        }

        return await query
            .OrderByDescending(r => r.Fecha)
            .ThenBy(r => r.HoraInicio)
            .ToListAsync();
    }

    public async Task<Reserva> AddAsync(Reserva reserva)
    {
        await _context.Reservas.AddAsync(reserva);
        await _context.SaveChangesAsync();

        // Reload navigation properties
        await _context.Entry(reserva).Reference(r => r.Usuario).LoadAsync();
        await _context.Entry(reserva).Reference(r => r.Ambiente).LoadAsync();

        return reserva;
    }

    public async Task<Reserva> UpdateAsync(Reserva reserva)
    {
        _context.Reservas.Update(reserva);
        await _context.SaveChangesAsync();

        await _context.Entry(reserva).Reference(r => r.Usuario).LoadAsync();
        await _context.Entry(reserva).Reference(r => r.Ambiente).LoadAsync();

        return reserva;
    }

    public async Task<bool> ExisteConflictoAprobadoAsync(
        Guid ambienteId,
        DateOnly fecha,
        TimeSpan horaInicio,
        TimeSpan horaFin,
        Guid? excludeReservaId = null)
    {
        var query = _context.Reservas
            .Where(r => r.AmbienteId == ambienteId
                        && r.Fecha == fecha
                        && r.Estado == "Aprobada");

        if (excludeReservaId.HasValue)
        {
            query = query.Where(r => r.Id != excludeReservaId.Value);
        }

        // Overlap: existing.Start < new.End && existing.End > new.Start
        return await query.AnyAsync(r => r.HoraInicio < horaFin && r.HoraFin > horaInicio);
    }

    public async Task<int> CountByEstadoAsync(string? estado)
    {
        if (string.IsNullOrWhiteSpace(estado))
        {
            return await _context.Reservas.CountAsync();
        }
        return await _context.Reservas.CountAsync(r => r.Estado.ToLower() == estado.ToLower());
    }

    public async Task<(string AmbienteNombre, int Cantidad)?> GetAmbienteMasUtilizadoAsync()
    {
        var item = await _context.Reservas
            .Include(r => r.Ambiente)
            .Where(r => r.Ambiente != null)
            .GroupBy(r => r.Ambiente!.Nombre)
            .Select(g => new { Nombre = g.Key, Cantidad = g.Count() })
            .OrderByDescending(g => g.Cantidad)
            .FirstOrDefaultAsync();

        return item is null ? null : (item.Nombre, item.Cantidad);
    }
}
