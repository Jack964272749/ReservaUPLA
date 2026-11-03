using ReservaUPLA.Domain.Entities;

namespace ReservaUPLA.Application.Interfaces;

public interface IReservaRepository
{
    Task<Reserva?> GetByIdAsync(Guid id);
    Task<IEnumerable<Reserva>> GetAllAsync(DateOnly? fecha = null, Guid? ambienteId = null, string? estado = null);
    Task<Reserva> AddAsync(Reserva reserva);
    Task<Reserva> UpdateAsync(Reserva reserva);
    Task<bool> ExisteConflictoAprobadoAsync(Guid ambienteId, DateOnly fecha, TimeSpan horaInicio, TimeSpan horaFin, Guid? excludeReservaId = null);
    Task<int> CountByEstadoAsync(string? estado);
    Task<(string AmbienteNombre, int Cantidad)?> GetAmbienteMasUtilizadoAsync();
}
