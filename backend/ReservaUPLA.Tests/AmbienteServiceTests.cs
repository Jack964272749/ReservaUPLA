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

// Trazabilidad: RF-02 · Validación de responsable de ambiente
public class AmbienteServiceTests
{
    private readonly Mock<IAmbienteRepository> _mockAmbienteRepo;
    private readonly Mock<IReservaRepository> _mockReservaRepo;
    private readonly Mock<IUsuarioRepository> _mockUsuarioRepo;
    private readonly AmbienteService _ambienteService;

    public AmbienteServiceTests()
    {
        _mockAmbienteRepo = new Mock<IAmbienteRepository>();
        _mockReservaRepo = new Mock<IReservaRepository>();
        _mockUsuarioRepo = new Mock<IUsuarioRepository>();

        _ambienteService = new AmbienteService(
            _mockAmbienteRepo.Object,
            _mockReservaRepo.Object,
            _mockUsuarioRepo.Object);
    }

    [Fact]
    public async Task CrearAsync_ResponsableInexistente_LanzaDomainException404()
    {
        var idInexistente = Guid.NewGuid();
        _mockUsuarioRepo.Setup(r => r.ObtenerPorIdAsync(idInexistente, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Usuario?)null);

        var dto = new CrearAmbienteDto(
            "Laboratorio 201",
            "LaboratorioComputo",
            30,
            "Pabellón A",
            idInexistente);

        var ex = await Assert.ThrowsAsync<DomainException>(() =>
            _ambienteService.CrearAsync(dto));

        Assert.Equal(Mensajes.ResponsableNoExiste, ex.Message);
        Assert.Equal(404, ex.CodigoEstadoHttp);
    }

    [Fact]
    public async Task CrearAsync_ResponsableRolSolicitante_LanzaDomainException400()
    {
        var idSolicitante = Guid.NewGuid();
        var solicitante = Usuario.Crear("Juan Perez", "jperez@upla.edu.pe", "hash123", RolUsuario.Solicitante);

        _mockUsuarioRepo.Setup(r => r.ObtenerPorIdAsync(idSolicitante, It.IsAny<CancellationToken>()))
            .ReturnsAsync(solicitante);

        var dto = new CrearAmbienteDto(
            "Laboratorio 202",
            "LaboratorioComputo",
            30,
            "Pabellón A",
            idSolicitante);

        var ex = await Assert.ThrowsAsync<DomainException>(() =>
            _ambienteService.CrearAsync(dto));

        Assert.Equal(Mensajes.UsuarioNoEsResponsable, ex.Message);
        Assert.Equal(400, ex.CodigoEstadoHttp);
    }

    [Fact]
    public async Task CrearAsync_ResponsableValido_CreaAmbienteCorrectamente()
    {
        var idResponsable = Guid.NewGuid();
        var responsable = Usuario.Crear("Maria Quispe", "mquispe@upla.edu.pe", "hash123", RolUsuario.Responsable);

        _mockUsuarioRepo.Setup(r => r.ObtenerPorIdAsync(idResponsable, It.IsAny<CancellationToken>()))
            .ReturnsAsync(responsable);

        var dto = new CrearAmbienteDto(
            "Laboratorio 203",
            "LaboratorioComputo",
            35,
            "Pabellón C",
            idResponsable);

        var resultado = await _ambienteService.CrearAsync(dto);

        Assert.NotNull(resultado);
        Assert.Equal("Laboratorio 203", resultado.Nombre);
        Assert.Equal(idResponsable, resultado.ResponsableId);
        _mockAmbienteRepo.Verify(r => r.AgregarAsync(It.IsAny<Ambiente>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task CrearAsync_UbicacionCon101Caracteres_LanzaDomainException()
    {
        var ubicacion101 = new string('A', 101);
        var dto = new CrearAmbienteDto(
            "Laboratorio 204",
            "LaboratorioComputo",
            25,
            ubicacion101,
            null);

        var ex = await Assert.ThrowsAsync<DomainException>(() =>
            _ambienteService.CrearAsync(dto));

        Assert.Equal(Mensajes.UbicacionLongitud, ex.Message);
    }

    [Fact]
    public async Task CrearAsync_NombreMenorA3Caracteres_LanzaDomainException()
    {
        var dto = new CrearAmbienteDto(
            "AB",
            "LaboratorioComputo",
            25,
            "Pabellón A",
            null);

        var ex = await Assert.ThrowsAsync<DomainException>(() =>
            _ambienteService.CrearAsync(dto));

        Assert.Equal(Mensajes.NombreAmbienteLongitud, ex.Message);
    }
}
