using Microsoft.AspNetCore.Mvc;
using ReservaUPLA.Application.DTOs;
using ReservaUPLA.Application.Interfaces;
using ReservaUPLA.Domain.Entities;

namespace ReservaUPLA.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsuariosController : ControllerBase
{
    private readonly IUsuarioRepository _usuarioRepository;

    public UsuariosController(IUsuarioRepository usuarioRepository)
    {
        _usuarioRepository = usuarioRepository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UsuarioResponseDto>>> GetAll()
    {
        var usuarios = await _usuarioRepository.GetAllAsync();
        var dtos = usuarios.Select(u => new UsuarioResponseDto(
            u.Id,
            u.NombreCompleto,
            u.Correo,
            u.Rol,
            u.Activo,
            u.FechaCreacion
        ));
        return Ok(dtos);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<UsuarioResponseDto>> GetById(Guid id)
    {
        var u = await _usuarioRepository.GetByIdAsync(id);
        if (u is null) return NotFound(new { message = $"Usuario con ID {id} no encontrado." });

        return Ok(new UsuarioResponseDto(
            u.Id,
            u.NombreCompleto,
            u.Correo,
            u.Rol,
            u.Activo,
            u.FechaCreacion
        ));
    }

    [HttpPost]
    public async Task<ActionResult<UsuarioResponseDto>> Create([FromBody] CreateUsuarioDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.NombreCompleto))
            return BadRequest(new { message = "El nombre completo es obligatorio." });
        if (string.IsNullOrWhiteSpace(dto.Correo))
            return BadRequest(new { message = "El correo electrónico es obligatorio." });

        var existente = await _usuarioRepository.GetByCorreoAsync(dto.Correo);
        if (existente != null)
            return Conflict(new { message = $"Ya existe un usuario registrado con el correo {dto.Correo}." });

        var usuario = new Usuario
        {
            NombreCompleto = dto.NombreCompleto.Trim(),
            Correo = dto.Correo.Trim().ToLower(),
            Rol = string.IsNullOrWhiteSpace(dto.Rol) ? "Solicitante" : dto.Rol.Trim(),
            Activo = true,
            FechaCreacion = DateTime.UtcNow
        };

        var creado = await _usuarioRepository.AddAsync(usuario);

        var responseDto = new UsuarioResponseDto(
            creado.Id,
            creado.NombreCompleto,
            creado.Correo,
            creado.Rol,
            creado.Activo,
            creado.FechaCreacion
        );

        return CreatedAtAction(nameof(GetById), new { id = responseDto.Id }, responseDto);
    }
}
