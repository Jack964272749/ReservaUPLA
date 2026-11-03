using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReservaUpla.Application.DTOs;
using ReservaUpla.Application.Interfaces;

namespace ReservaUpla.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AmbientesController : ControllerBase
{
    private readonly IAmbienteService _ambienteService;

    public AmbientesController(IAmbienteService ambienteService)
    {
        _ambienteService = ambienteService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AmbienteDto>>> ObtenerTodos(CancellationToken cancellationToken)
    {
        var ambientes = await _ambienteService.ObtenerTodosAsync(cancellationToken);
        return Ok(ambientes);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<AmbienteDto>> ObtenerPorId(Guid id, CancellationToken cancellationToken)
    {
        var ambiente = await _ambienteService.ObtenerPorIdAsync(id, cancellationToken);
        return Ok(ambiente);
    }

    // Trazabilidad: RF-02 · Solo Administrador registra ambientes
    [HttpPost]
    [Authorize(Roles = "Administrador")]
    public async Task<ActionResult<AmbienteDto>> Crear([FromBody] CrearAmbienteDto dto, CancellationToken cancellationToken)
    {
        var creado = await _ambienteService.CrearAsync(dto, cancellationToken);
        return CreatedAtAction(nameof(ObtenerPorId), new { id = creado.Id }, creado);
    }

    // Trazabilidad: RF-04 · Consulta de disponibilidad por fecha
    [HttpGet("{id:guid}/disponibilidad")]
    public async Task<ActionResult<IEnumerable<DisponibilidadDiaDto>>> ConsultarDisponibilidad(
        Guid id,
        [FromQuery] DateOnly fecha,
        CancellationToken cancellationToken)
    {
        var disponibilidad = await _ambienteService.ConsultarDisponibilidadAsync(id, fecha, cancellationToken);
        return Ok(disponibilidad);
    }
}
