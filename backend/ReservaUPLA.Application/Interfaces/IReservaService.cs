using ReservaUpla.Application.DTOs;
using ReservaUpla.Domain.Enums;

namespace ReservaUpla.Application.Interfaces;

public interface IReservaService
{
    Task<ReservaDto> CrearAsync(CrearReservaDto dto, Guid idUsuario, CancellationToken cancellationToken = default);
    Task<PaginaReservasDto> ObtenerPaginadoAsync(
        DateOnly? fecha,
        Guid? ambienteId,
        string? estado,
        Guid idUsuario,
        RolUsuario rolUsuario,
        int pagina = 1,
        int tamanoPagina = 10,
        CancellationToken cancellationToken = default);

    Task<ReservaDto> ObtenerPorIdAsync(
        Guid id,
        Guid idUsuario,
        RolUsuario rolUsuario,
        CancellationToken cancellationToken = default);

    Task<ReservaDto> CambiarEstadoAsync(
        Guid id,
        string nuevoEstadoStr,
        Guid idActor,
        RolUsuario rolActor,
        CancellationToken cancellationToken = default);
}
