using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReservaUpla.Application.DTOs;
using ReservaUpla.Application.Interfaces;

namespace ReservaUpla.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    // Trazabilidad: RF-08 · Indicadores de reservas en dashboard
    [HttpGet]
    public async Task<ActionResult<DashboardDto>> ObtenerIndicadores(CancellationToken cancellationToken)
    {
        var indicadores = await _dashboardService.ObtenerIndicadoresAsync(cancellationToken);
        return Ok(indicadores);
    }
}
