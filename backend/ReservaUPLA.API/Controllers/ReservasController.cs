using Microsoft.AspNetCore.Mvc;
using ReservaUPLA.Application.DTOs;
using ReservaUPLA.Application.Interfaces;

namespace ReservaUPLA.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReservasController : ControllerBase
{
    private readonly IReservaService _reservaService;

    public ReservasController(IReservaService reservaService)
    {
        _reservaService = reservaService;
    }

    // RF-05: Listar reservas registradas con filtros opcionales
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ReservaResponseDto>>> GetAll(
        [FromQuery] DateOnly? fecha,
        [FromQuery] Guid? ambienteId,
        [FromQuery] string? estado)
    {
        var reservas = await _reservaService.ListarReservasAsync(fecha, ambienteId, estado);
        return Ok(reservas);
    }

    // RF-06: Consultar detalle de una reserva
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ReservaResponseDto>> GetById(Guid id)
    {
        var reserva = await _reservaService.ObtenerPorIdAsync(id);
        if (reserva is null)
            return NotFound(new { message = $"Reserva con ID {id} no encontrada." });

        return Ok(reserva);
    }

    // RF-03: Registrar solicitudes de reserva (con validaciones RN-01 a RN-04)
    [HttpPost]
    public async Task<ActionResult<ReservaResponseDto>> Create([FromBody] CreateReservaDto dto)
    {
        try
        {
            var creada = await _reservaService.CrearReservaAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = creada.Id }, creada);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // RF-04: Validar disponibilidad del ambiente antes de registrar la reserva
    [HttpPost("validar-disponibilidad")]
    public async Task<ActionResult<DisponibilidadResponseDto>> ValidarDisponibilidad([FromBody] ValidarDisponibilidadDto dto)
    {
        var resultado = await _reservaService.ValidarDisponibilidadAsync(dto);
        return Ok(resultado);
    }

    // RF-07: Cambiar estado (Pendiente, Aprobada, Rechazada, Cancelada) - RN-05, RN-06
    [HttpPatch("{id:guid}/estado")]
    public async Task<ActionResult<ReservaResponseDto>> CambiarEstado(Guid id, [FromBody] CambiarEstadoReservaDto dto)
    {
        try
        {
            var actualizada = await _reservaService.CambiarEstadoAsync(id, dto);
            return Ok(actualizada);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}
