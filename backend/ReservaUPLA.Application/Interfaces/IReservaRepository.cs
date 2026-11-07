using ReservaUpla.Domain.Entities;
using ReservaUpla.Domain.Enums;

namespace ReservaUpla.Application.Interfaces;

public interface IReservaRepository
{
    Task<Reserva?> ObtenerPorIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<(IEnumerable<Reserva> Items, int Total)> ObtenerPaginadoAsync(
        DateOnly? fecha,
        Guid? ambienteId,
        EstadoReserva? estado,
        Guid? usuarioId,
        IEnumerable<Guid>? ambientesPermitidos,
        int pagina,
        int tamanoPagina,
        CancellationToken cancellationToken = default);

    Task<IEnumerable<Reserva>> ObtenerPorAmbienteYFechaAsync(
        Guid ambienteId,
        DateOnly fecha,
        CancellationToken cancellationToken = default);

    Task<bool> HayConflictoAprobadoAsync(
        Guid ambienteId,
        DateOnly fecha,
        TimeSpan inicio,
        TimeSpan fin,
        Guid? excluirReservaId = null,
        CancellationToken cancellationToken = default);

    Task AgregarAsync(Reserva reserva, CancellationToken cancellationToken = default);
    Task ActualizarAsync(Reserva reserva, CancellationToken cancellationToken = default);
    Task<int> ContarPorEstadoAsync(EstadoReserva? estado, CancellationToken cancellationToken = default);
    Task<(string NombreAmbiente, int Cantidad)?> ObtenerAmbienteMasUtilizadoAsync(CancellationToken cancellationToken = default);
    Task<Dictionary<string, int>> ObtenerDistribucionPorTipoAmbienteAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<Reserva>> ObtenerReservasDeFechaAsync(DateOnly fecha, int limite = 5, CancellationToken cancellationToken = default);
    Task EjecutarEnTransaccionSerializableAsync(Func<Task> accion, CancellationToken cancellationToken = default);
}
