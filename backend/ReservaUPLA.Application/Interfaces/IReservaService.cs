using ReservaUPLA.Application.DTOs;

namespace ReservaUPLA.Application.Interfaces;

public interface IReservaService
{
    Task<ReservaResponseDto> CrearReservaAsync(CreateReservaDto dto);
    Task<IEnumerable<ReservaResponseDto>> ListarReservasAsync(DateOnly? fecha = null, Guid? ambienteId = null, string? estado = null);
    Task<ReservaResponseDto?> ObtenerPorIdAsync(Guid id);
    Task<ReservaResponseDto> CambiarEstadoAsync(Guid id, CambiarEstadoReservaDto dto);
    Task<DisponibilidadResponseDto> ValidarDisponibilidadAsync(ValidarDisponibilidadDto dto);
}
