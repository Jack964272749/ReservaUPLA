using Moq;
using ReservaUpla.Application.DTOs;
using ReservaUpla.Application.Interfaces;
using ReservaUpla.Application.Services;
using ReservaUpla.Domain.Constants;
using ReservaUpla.Domain.Entities;
using ReservaUpla.Domain.Enums;
using ReservaUpla.Domain.Exceptions;
using Xunit;

namespace ReservaUpla.Tests;

// Trazabilidad: RF-01 · Pruebas unitarias para gestión de usuarios
public class UsuarioServiceTests
{
    private readonly Mock<IUsuarioRepository> _mockUsuarioRepo;
    private readonly UsuarioService _usuarioService;

    public UsuarioServiceTests()
    {
        _mockUsuarioRepo = new Mock<IUsuarioRepository>();
        _usuarioService = new UsuarioService(_mockUsuarioRepo.Object);
    }

    [Fact]
    public async Task ActualizarAsync_UsuarioInexistente_LanzaDomainException404()
    {
        var id = Guid.NewGuid();
        _mockUsuarioRepo.Setup(r => r.ObtenerPorIdAsync(id, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Usuario?)null);

        var dto = new ActualizarUsuarioDto("Juan Pérez", "Solicitante", true);

        var ex = await Assert.ThrowsAsync<DomainException>(() =>
            _usuarioService.ActualizarAsync(id, dto, Guid.NewGuid()));

        Assert.Equal(404, ex.CodigoEstadoHttp);
        Assert.Equal(Mensajes.UsuarioNoExiste, ex.Message);
    }

    [Fact]
    public async Task ActualizarAsync_IntentaModificarRol_LanzaDomainException400()
    {
        var id = Guid.NewGuid();
        var usuario = Usuario.Crear("Carlos Ramos", "carlos@upla.edu.pe", "hash123", RolUsuario.Solicitante);

        _mockUsuarioRepo.Setup(r => r.ObtenerPorIdAsync(id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(usuario);

        var dto = new ActualizarUsuarioDto("Carlos Ramos", "Responsable", true);

        var ex = await Assert.ThrowsAsync<DomainException>(() =>
            _usuarioService.ActualizarAsync(id, dto, Guid.NewGuid()));

        Assert.Equal(400, ex.CodigoEstadoHttp);
        Assert.Equal(Mensajes.RolNoModificable, ex.Message);
    }

    [Fact]
    public async Task ActualizarAsync_AdminIntentaDesactivarPropiaCuenta_LanzaDomainException400()
    {
        var adminId = Guid.NewGuid();
        var admin = Usuario.Crear("Administrador General", "admin@upla.edu.pe", "hash123", RolUsuario.Administrador);

        _mockUsuarioRepo.Setup(r => r.ObtenerPorIdAsync(adminId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(admin);

        var dto = new ActualizarUsuarioDto("Administrador Modificado", "Administrador", false);

        var ex = await Assert.ThrowsAsync<DomainException>(() =>
            _usuarioService.ActualizarAsync(adminId, dto, adminId));

        Assert.Equal(400, ex.CodigoEstadoHttp);
        Assert.Equal(Mensajes.NoSePuedeDesactivarPropiaCuenta, ex.Message);
    }

    [Fact]
    public async Task ActualizarAsync_DatosValidos_ModificaNombreYEstadoExitosamente()
    {
        var id = Guid.NewGuid();
        var usuario = Usuario.Crear("Carlos Ramos", "carlos@upla.edu.pe", "hash123", RolUsuario.Solicitante);

        _mockUsuarioRepo.Setup(r => r.ObtenerPorIdAsync(id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(usuario);

        var dto = new ActualizarUsuarioDto("Carlos Ramos Actualizado", "Solicitante", false);

        var resultado = await _usuarioService.ActualizarAsync(id, dto, Guid.NewGuid());

        Assert.Equal("Carlos Ramos Actualizado", resultado.NombreCompleto);
        Assert.Equal("Solicitante", resultado.Rol);
        Assert.False(resultado.Activo);
        _mockUsuarioRepo.Verify(r => r.ActualizarAsync(usuario, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task CambiarEstadoAsync_AdminIntentaDesactivarPropiaCuenta_LanzaDomainException400()
    {
        var adminId = Guid.NewGuid();
        var admin = Usuario.Crear("Administrador General", "admin@upla.edu.pe", "hash123", RolUsuario.Administrador);

        _mockUsuarioRepo.Setup(r => r.ObtenerPorIdAsync(adminId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(admin);

        var ex = await Assert.ThrowsAsync<DomainException>(() =>
            _usuarioService.CambiarEstadoAsync(adminId, false, adminId));

        Assert.Equal(400, ex.CodigoEstadoHttp);
        Assert.Equal(Mensajes.NoSePuedeDesactivarPropiaCuenta, ex.Message);
    }

    [Fact]
    public async Task CambiarEstadoAsync_UsuarioExistente_CambiaEstadoExitosamente()
    {
        var id = Guid.NewGuid();
        var usuario = Usuario.Crear("Carlos Ramos", "carlos@upla.edu.pe", "hash123", RolUsuario.Solicitante);

        _mockUsuarioRepo.Setup(r => r.ObtenerPorIdAsync(id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(usuario);

        var resultado = await _usuarioService.CambiarEstadoAsync(id, false, Guid.NewGuid());

        Assert.False(resultado.Activo);
        _mockUsuarioRepo.Verify(r => r.ActualizarAsync(usuario, It.IsAny<CancellationToken>()), Times.Once);
    }
}
