using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReservaUpla.Application.DTOs;
using ReservaUpla.Application.Interfaces;

namespace ReservaUpla.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsuariosController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IUsuarioService _usuarioService;

    public UsuariosController(IAuthService authService, IUsuarioService usuarioService)
    {
        _authService = authService;
        _usuarioService = usuarioService;
    }

    // Trazabilidad: RF-01 · Anónimo · Registro de Solicitante
    [HttpPost]
    [AllowAnonymous]
    public async Task<ActionResult<UsuarioDto>> Registrar([FromBody] RegistroSolicitanteDto dto, CancellationToken cancellationToken)
    {
        var creado = await _authService.RegistrarSolicitanteAsync(dto, cancellationToken);
        return CreatedAtAction(nameof(Registrar), new { id = creado.Id }, creado);
    }

    // Trazabilidad: RF-01 · Listado exclusivo de Administrador
    [HttpGet]
    [Authorize(Roles = "Administrador")]
    public async Task<ActionResult<IEnumerable<UsuarioDto>>> ObtenerTodos(CancellationToken cancellationToken)
    {
        var usuarios = await _usuarioService.ObtenerTodosAsync(cancellationToken);
        return Ok(usuarios);
    }

    // Trazabilidad: RF-01 · Modificar datos de usuario (nombre, rol, estado)
    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Administrador")]
    public async Task<ActionResult<UsuarioDto>> Actualizar(Guid id, [FromBody] ActualizarUsuarioDto dto, CancellationToken cancellationToken)
    {
        var idActorStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var idActor = Guid.TryParse(idActorStr, out var parsed) ? parsed : Guid.Empty;

        var actualizado = await _usuarioService.ActualizarAsync(id, dto, idActor, cancellationToken);
        return Ok(actualizado);
    }

    // Trazabilidad: RF-01 · Activar o desactivar cuenta de usuario
    [HttpPatch("{id:guid}/estado")]
    [Authorize(Roles = "Administrador")]
    public async Task<ActionResult<UsuarioDto>> CambiarEstado(Guid id, [FromBody] CambiarEstadoUsuarioDto dto, CancellationToken cancellationToken)
    {
        var idActorStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var idActor = Guid.TryParse(idActorStr, out var parsed) ? parsed : Guid.Empty;

        var actualizado = await _usuarioService.CambiarEstadoAsync(id, dto.Activo, idActor, cancellationToken);
        return Ok(actualizado);
    }
}
