using System.Data;
using Microsoft.EntityFrameworkCore;
using ReservaUpla.Application.Interfaces;
using ReservaUpla.Domain.Entities;
using ReservaUpla.Domain.Enums;
using ReservaUpla.Infrastructure.Data;

namespace ReservaUpla.Infrastructure.Repositories;

// Trazabilidad: RN-01 · Transacción Serializable y consultas optimizadas AsNoTracking
public class ReservaRepository : IReservaRepository
{
    private readonly AppDbContext _context;

    public ReservaRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Reserva?> ObtenerPorIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Reservas
            .Include(r => r.Usuario)
            .Include(r => r.Ambiente)
            .FirstOrDefaultAsync(r => r.Id_Reserva == id, cancellationToken);
    }

    public async Task<(IEnumerable<Reserva> Items, int Total)> ObtenerPaginadoAsync(
        DateOnly? fecha,
        Guid? ambienteId,
        EstadoReserva? estado,
        Guid? usuarioId,
        IEnumerable<Guid>? ambientesPermitidos,
        int pagina,
        int tamanoPagina,
        CancellationToken cancellationToken = default)
    {
        var query = _context.Reservas
            .Include(r => r.Usuario)
            .Include(r => r.Ambiente)
            .AsNoTracking()
            .AsQueryable();

        if (fecha.HasValue)
            query = query.Where(r => r.Fec_Reserva == fecha.Value);

        if (ambienteId.HasValue && ambienteId.Value != Guid.Empty)
            query = query.Where(r => r.Ida_Reserva == ambienteId.Value);

        if (estado.HasValue)
            query = query.Where(r => r.Est_Reserva == estado.Value);

        if (usuarioId.HasValue && usuarioId.Value != Guid.Empty)
            query = query.Where(r => r.Idu_Reserva == usuarioId.Value);

        if (ambientesPermitidos != null)
        {
            var ids = ambientesPermitidos.ToList();
            query = query.Where(r => ids.Contains(r.Ida_Reserva));
        }

        var total = await query.CountAsync(cancellationToken);

        var paginaValida = pagina < 1 ? 1 : pagina;
        var tamanoValido = tamanoPagina < 1 ? 10 : (tamanoPagina > 50 ? 50 : tamanoPagina);

        var items = await query
            .OrderBy(r => r.Est_Reserva == EstadoReserva.Pendiente ? 0 : 1)
            .ThenByDescending(r => r.Fre_Reserva)
            .ThenByDescending(r => r.Id_Reserva)
            .Skip((paginaValida - 1) * tamanoValido)
            .Take(tamanoValido)
            .ToListAsync(cancellationToken);

        return (items, total);
    }

    public async Task<IEnumerable<Reserva>> ObtenerPorAmbienteYFechaAsync(
        Guid ambienteId,
        DateOnly fecha,
        CancellationToken cancellationToken = default)
    {
        return await _context.Reservas
            .Include(r => r.Usuario)
            .Include(r => r.Ambiente)
            .AsNoTracking()
            .Where(r => r.Ida_Reserva == ambienteId && r.Fec_Reserva == fecha)
            .OrderBy(r => r.Hin_Reserva)
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> HayConflictoAprobadoAsync(
        Guid ambienteId,
        DateOnly fecha,
        TimeSpan inicio,
        TimeSpan fin,
        Guid? excluirReservaId = null,
        CancellationToken cancellationToken = default)
    {
        var query = _context.Reservas
            .Where(r => r.Ida_Reserva == ambienteId
                        && r.Fec_Reserva == fecha
                        && r.Est_Reserva == EstadoReserva.Aprobada);

        if (excluirReservaId.HasValue)
            query = query.Where(r => r.Id_Reserva != excluirReservaId.Value);

        return await query.AnyAsync(
            r => r.Hin_Reserva < fin && r.Hfi_Reserva > inicio,
            cancellationToken);
    }

    public async Task AgregarAsync(Reserva reserva, CancellationToken cancellationToken = default)
    {
        await _context.Reservas.AddAsync(reserva, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task ActualizarAsync(Reserva reserva, CancellationToken cancellationToken = default)
    {
        _context.Reservas.Update(reserva);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<int> ContarPorEstadoAsync(EstadoReserva? estado, CancellationToken cancellationToken = default)
    {
        if (!estado.HasValue)
            return await _context.Reservas.CountAsync(cancellationToken);

        return await _context.Reservas.CountAsync(r => r.Est_Reserva == estado.Value, cancellationToken);
    }

    public async Task<(string NombreAmbiente, int Cantidad)?> ObtenerAmbienteMasUtilizadoAsync(CancellationToken cancellationToken = default)
    {
        var resultado = await _context.Reservas
            .Include(r => r.Ambiente)
            .Where(r => r.Ambiente != null)
            .GroupBy(r => r.Ambiente!.Nom_Ambiente)
            .Select(g => new { Nombre = g.Key, Cantidad = g.Count() })
            .OrderByDescending(x => x.Cantidad)
            .FirstOrDefaultAsync(cancellationToken);

        return resultado is null ? null : (resultado.Nombre, resultado.Cantidad);
    }

    public async Task<Dictionary<string, int>> ObtenerDistribucionPorTipoAmbienteAsync(CancellationToken cancellationToken = default)
    {
        // Se agrupa por el enum y la conversión a texto se realiza en memoria:
        // traducir ToString() dentro de la consulta no está garantizado por todos los proveedores.
        var grupos = await _context.Reservas
            .Where(r => r.Ambiente != null)
            .GroupBy(r => r.Ambiente!.Tip_Ambiente)
            .Select(g => new { Tipo = g.Key, Cantidad = g.Count() })
            .ToListAsync(cancellationToken);

        return grupos.ToDictionary(g => g.Tipo.ToString(), g => g.Cantidad);
    }

    public async Task<IEnumerable<Reserva>> ObtenerReservasDeFechaAsync(DateOnly fecha, int limite = 5, CancellationToken cancellationToken = default)
    {
        return await _context.Reservas
            .Include(r => r.Ambiente)
            .Include(r => r.Usuario)
            .AsNoTracking()
            .Where(r => r.Fec_Reserva == fecha)
            .OrderBy(r => r.Hin_Reserva)
            .Take(limite)
            .ToListAsync(cancellationToken);
    }

    // Trazabilidad: E-17 · E-31 · Aislamiento Serializable para concurrencia
    public async Task EjecutarEnTransaccionSerializableAsync(Func<Task> accion, CancellationToken cancellationToken = default)
    {
        using var tx = await _context.Database.BeginTransactionAsync(IsolationLevel.Serializable, cancellationToken);
        try
        {
            await accion();
            await tx.CommitAsync(cancellationToken);
        }
        catch
        {
            await tx.RollbackAsync(cancellationToken);
            throw;
        }
    }
}
