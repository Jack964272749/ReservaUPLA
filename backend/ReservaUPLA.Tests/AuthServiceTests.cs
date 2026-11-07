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

// Trazabilidad: Nielsen H5 · Shneiderman 5 · Pruebas unitarias de autenticación y seguridad
public class AuthServiceTests
{
    private readonly Mock<IUsuarioRepository> _mockUsuarioRepo;
    private readonly Mock<IPasswordHasherService> _mockPasswordHasher;
    private readonly AuthService _authService;

    public AuthServiceTests()
    {
        _mockUsuarioRepo = new Mock<IUsuarioRepository>();
        _mockPasswordHasher = new Mock<IPasswordHasherService>();
        _authService = new AuthService(_mockUsuarioRepo.Object, _mockPasswordHasher.Object);
    }

    [Fact]
    public async Task LoginAsync_ContrasenaCorrecta_DevuelveUsuario()
    {
        // Arrange
        const string correo = "usuario.valido@upla.edu.pe";
        const string clavePlana = "ClaveValida2026!";
        const string hashEsperado = "hash_almacenado_123";

        var usuario = Usuario.Crear("Usuario Válido", correo, hashEsperado, RolUsuario.Solicitante);
        _mockUsuarioRepo.Setup(r => r.ObtenerPorCorreoAsync(correo, It.IsAny<CancellationToken>()))
            .ReturnsAsync(usuario);

        _mockPasswordHasher.Setup(h => h.Verify(hashEsperado, clavePlana))
            .Returns(true);

        var dto = new LoginDto(correo, clavePlana);

        // Act
        var resultado = await _authService.LoginAsync(dto);

        // Assert
        Assert.NotNull(resultado);
        Assert.Equal(usuario.Id_Usuario, resultado.Id);
        Assert.Equal(correo, resultado.Correo);
        Assert.Equal(RolUsuario.Solicitante.ToString(), resultado.Rol);
    }

    [Fact]
    public async Task LoginAsync_ContrasenaIncorrecta_Solicitante_LanzaDomainException401()
    {
        // Arrange
        const string correo = "solicitante@upla.edu.pe";
        const string claveErronea = "ClaveErronea123";
        const string hash = "hash_real";

        var usuario = Usuario.Crear("Carmen Flores", correo, hash, RolUsuario.Solicitante);
        _mockUsuarioRepo.Setup(r => r.ObtenerPorCorreoAsync(correo, It.IsAny<CancellationToken>()))
            .ReturnsAsync(usuario);

        _mockPasswordHasher.Setup(h => h.Verify(hash, claveErronea))
            .Returns(false);

        var dto = new LoginDto(correo, claveErronea);

        // Act & Assert
        var ex = await Assert.ThrowsAsync<DomainException>(() => _authService.LoginAsync(dto));
        Assert.Equal(401, ex.CodigoEstadoHttp);
        Assert.Equal(Mensajes.CredencialesInvalidas, ex.Message);
    }

    [Theory]
    [InlineData("admin@upla.edu.pe", RolUsuario.Administrador, "Admin123*UPLA")]
    [InlineData("responsable@upla.edu.pe", RolUsuario.Responsable, "Usuario123*UPLA")]
    [InlineData("solicitante@upla.edu.pe", RolUsuario.Solicitante, "Usuario123*UPLA")]
    public async Task LoginAsync_ContrasenasAntiguasDemostracion_NoPermitenIngreso_Lanza401YSinActualizar(
        string correo,
        RolUsuario rol,
        string claveAntiguaPrueba)
    {
        // Arrange
        const string hashActual = "hash_seguro_actual";
        var usuario = Usuario.Crear("Usuario Demo", correo, hashActual, rol);

        _mockUsuarioRepo.Setup(r => r.ObtenerPorCorreoAsync(correo, It.IsAny<CancellationToken>()))
            .ReturnsAsync(usuario);

        _mockPasswordHasher.Setup(h => h.Verify(hashActual, claveAntiguaPrueba))
            .Returns(false);

        var dto = new LoginDto(correo, claveAntiguaPrueba);

        // Act & Assert
        var ex = await Assert.ThrowsAsync<DomainException>(() => _authService.LoginAsync(dto));
        Assert.Equal(401, ex.CodigoEstadoHttp);
        Assert.Equal(Mensajes.CredencialesInvalidas, ex.Message);

        _mockUsuarioRepo.Verify(r => r.ActualizarAsync(It.IsAny<Usuario>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task LoginAsync_UsuarioInexistente_Lanza401YLlamaVerifyDummy()
    {
        // Arrange
        const string correo = "noexiste@upla.edu.pe";
        _mockUsuarioRepo.Setup(r => r.ObtenerPorCorreoAsync(correo, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Usuario?)null);

        var dto = new LoginDto(correo, "CualquierClave123");

        // Act & Assert
        var ex = await Assert.ThrowsAsync<DomainException>(() => _authService.LoginAsync(dto));
        Assert.Equal(401, ex.CodigoEstadoHttp);
        Assert.Equal(Mensajes.CredencialesInvalidas, ex.Message);

        _mockPasswordHasher.Verify(h => h.VerifyDummy(), Times.Once);
    }

    [Fact]
    public async Task LoginAsync_UsuarioInactivo_Lanza401YLlamaVerifyDummy()
    {
        // Arrange
        const string correo = "inactivo@upla.edu.pe";
        var usuario = Usuario.Crear("Usuario Inactivo", correo, "hash_inactivo", RolUsuario.Solicitante);
        usuario.Actualizar(usuario.Nom_Usuario, usuario.Rol_Usuario, false);

        _mockUsuarioRepo.Setup(r => r.ObtenerPorCorreoAsync(correo, It.IsAny<CancellationToken>()))
            .ReturnsAsync(usuario);

        var dto = new LoginDto(correo, "CualquierClave123");

        // Act & Assert
        var ex = await Assert.ThrowsAsync<DomainException>(() => _authService.LoginAsync(dto));
        Assert.Equal(401, ex.CodigoEstadoHttp);
        Assert.Equal(Mensajes.CredencialesInvalidas, ex.Message);

        _mockPasswordHasher.Verify(h => h.VerifyDummy(), Times.Once);
    }
}
