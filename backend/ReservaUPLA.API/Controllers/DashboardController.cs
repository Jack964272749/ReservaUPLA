using Microsoft.AspNetCore.Mvc;
using ReservaUPLA.Application.DTOs;
using ReservaUPLA.Application.Interfaces;

namespace ReservaUPLA.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    // RF-08: Indicadores básicos de reservas en dashboard
    [HttpGet("indicadores")]
    public async Task<ActionResult<DashboardIndicadoresDto>> GetIndicadores()
    {
        var indicadores = await _dashboardService.ObtenerIndicadoresAsync();
        return Ok(indicadores);
    }
}
