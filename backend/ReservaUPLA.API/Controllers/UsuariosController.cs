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
    private readonly IUsuarioRepository _usuarioRepository;

    public UsuariosController(IAuthService authService, IUsuarioRepository usuarioRepository)
    {
        _authService = authService;
        _usuarioRepository = usuarioRepository;
    }

    // Trazabilidad: RF-01 · Anónimo · Registro de Solicitante
    [HttpPost]
    [AllowAnonymous]
    public async Task<ActionResult<UsuarioDto>> Registrar([FromBody] RegistroSolicitanteDto dto, CancellationToken cancellationToken)
    {
        var creado = await _authService.RegistrarSolicitanteAsync(dto, cancellationToken);
        return CreatedAtAction(nameof(Registrar), new { id = creado.Id }, creado);
    }

    [HttpGet]
    [Authorize(Roles = "Administrador")]
    public async Task<ActionResult<IEnumerable<UsuarioDto>>> ObtenerTodos(CancellationToken cancellationToken)
    {
        var usuarios = await _usuarioRepository.ObtenerTodosAsync(cancellationToken);
        return Ok(usuarios.Select(u => new UsuarioDto(
            u.Id_Usuario,
            u.Nom_Usuario,
            u.Cor_Usuario,
            u.Rol_Usuario.ToString(),
            u.Act_Usuario
        )));
    }
}
