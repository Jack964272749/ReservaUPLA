using ReservaUpla.Domain.Entities;

namespace ReservaUpla.Application.Interfaces;

public interface IAmbienteRepository
{
    Task<Ambiente?> ObtenerPorIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<Ambiente>> ObtenerTodosAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<Ambiente>> ObtenerPorResponsableAsync(Guid idResponsable, CancellationToken cancellationToken = default);
    Task AgregarAsync(Ambiente ambiente, CancellationToken cancellationToken = default);
    Task ActualizarAsync(Ambiente ambiente, CancellationToken cancellationToken = default);
}
