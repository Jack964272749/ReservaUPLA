using ReservaUPLA.Application.DTOs;

namespace ReservaUPLA.Application.Interfaces;

public interface IDashboardService
{
    Task<DashboardIndicadoresDto> ObtenerIndicadoresAsync();
}
