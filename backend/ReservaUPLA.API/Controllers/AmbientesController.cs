using Microsoft.AspNetCore.Mvc;
using ReservaUPLA.Application.DTOs;
using ReservaUPLA.Application.Interfaces;
using ReservaUPLA.Domain.Entities;

namespace ReservaUPLA.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AmbientesController : ControllerBase
{
    private readonly IAmbienteRepository _ambienteRepository;

    public AmbientesController(IAmbienteRepository ambienteRepository)
    {
        _ambienteRepository = ambienteRepository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AmbienteResponseDto>>> GetAll()
    {
        var ambientes = await _ambienteRepository.GetAllAsync();
        var dtos = ambientes.Select(a => new AmbienteResponseDto(
            a.Id,
            a.Nombre,
            a.Tipo,
            a.Capacidad,
            a.Ubicacion,
            a.Estado,
            a.FechaCreacion
        ));
        return Ok(dtos);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<AmbienteResponseDto>> GetById(Guid id)
    {
        var a = await _ambienteRepository.GetByIdAsync(id);
        if (a is null) return NotFound(new { message = $"Ambiente con ID {id} no encontrado." });

        return Ok(new AmbienteResponseDto(
            a.Id,
            a.Nombre,
            a.Tipo,
            a.Capacidad,
            a.Ubicacion,
            a.Estado,
            a.FechaCreacion
        ));
    }

    [HttpPost]
    public async Task<ActionResult<AmbienteResponseDto>> Create([FromBody] CreateAmbienteDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Nombre))
            return BadRequest(new { message = "El nombre del ambiente es obligatorio." });
        if (string.IsNullOrWhiteSpace(dto.Tipo))
            return BadRequest(new { message = "El tipo de ambiente es obligatorio." });
        if (dto.Capacidad <= 0)
            return BadRequest(new { message = "La capacidad debe ser un número entero positivo mayor a cero." });

        var ambiente = new Ambiente
        {
            Nombre = dto.Nombre.Trim(),
            Tipo = dto.Tipo.Trim(),
            Capacidad = dto.Capacidad,
            Ubicacion = dto.Ubicacion?.Trim() ?? string.Empty,
            Estado = "Disponible",
            FechaCreacion = DateTime.UtcNow
        };

        var creado = await _ambienteRepository.AddAsync(ambiente);

        var responseDto = new AmbienteResponseDto(
            creado.Id,
            creado.Nombre,
            creado.Tipo,
            creado.Capacidad,
            creado.Ubicacion,
            creado.Estado,
            creado.FechaCreacion
        );

        return CreatedAtAction(nameof(GetById), new { id = responseDto.Id }, responseDto);
    }
}
