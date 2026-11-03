using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReservaUpla.Application.DTOs;
using ReservaUpla.Application.Interfaces;
using ReservaUpla.Domain.Enums;

namespace ReservaUpla.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReservasController : ControllerBase
{
    private readonly IReservaService _reservaService;

    public ReservasController(IReservaService reservaService)
    {
        _reservaService = reservaService;
    }

    // Trazabilidad: RF-03 · Solicitante registra solicitudes de reserva
    [HttpPost]
    [Authorize(Roles = "Solicitante")]
    public async Task<ActionResult<ReservaDto>> Crear([FromBody] CrearReservaDto dto, CancellationToken cancellationToken)
    {
        var idUsuario = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var creada = await _reservaService.CrearAsync(dto, idUsuario, cancellationToken);
        return CreatedAtAction(nameof(ObtenerPorId), new { id = creada.Id }, creada);
    }

    // Trazabilidad: RF-05 · Listado con filtros y paginación
    [HttpGet]
    public async Task<ActionResult<PaginaReservasDto>> ObtenerTodos(
        [FromQuery] DateOnly? fecha,
        [FromQuery] Guid? ambienteId,
        [FromQuery] string? estado,
        [FromQuery] int pagina = 1,
        [FromQuery] int tamanoPagina = 10,
        CancellationToken cancellationToken = default)
    {
        var idUsuario = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var rolStr = User.FindFirstValue(ClaimTypes.Role)!;
        var rol = Enum.Parse<RolUsuario>(rolStr);

        var resultado = await _reservaService.ObtenerPaginadoAsync(
            fecha,
            ambienteId,
            estado,
            idUsuario,
            rol,
            pagina,
            tamanoPagina,
            cancellationToken);

        return Ok(resultado);
    }

    // Trazabilidad: RF-06 · Detalle de una reserva
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ReservaDto>> ObtenerPorId(Guid id, CancellationToken cancellationToken)
    {
        var idUsuario = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var rolStr = User.FindFirstValue(ClaimTypes.Role)!;
        var rol = Enum.Parse<RolUsuario>(rolStr);

        var reserva = await _reservaService.ObtenerPorIdAsync(id, idUsuario, rol, cancellationToken);
        return Ok(reserva);
    }

    // Trazabilidad: RF-07 · Cambiar estado de reserva
    [HttpPatch("{id:guid}/estado")]
    public async Task<ActionResult<ReservaDto>> CambiarEstado(
        Guid id,
        [FromBody] CambiarEstadoDto dto,
        CancellationToken cancellationToken)
    {
        var idActor = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var rolStr = User.FindFirstValue(ClaimTypes.Role)!;
        var rolActor = Enum.Parse<RolUsuario>(rolStr);

        var actualizada = await _reservaService.CambiarEstadoAsync(id, dto.NuevoEstado, idActor, rolActor, cancellationToken);
        return Ok(actualizada);
    }
}
