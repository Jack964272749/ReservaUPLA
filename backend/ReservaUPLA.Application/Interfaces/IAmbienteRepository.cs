using ReservaUPLA.Domain.Entities;

namespace ReservaUPLA.Application.Interfaces;

public interface IAmbienteRepository
{
    Task<Ambiente?> GetByIdAsync(Guid id);
    Task<IEnumerable<Ambiente>> GetAllAsync();
    Task<Ambiente> AddAsync(Ambiente ambiente);
    Task<Ambiente> UpdateAsync(Ambiente ambiente);
}
