using Moq;
using ReservaUPLA.Application.DTOs;
using ReservaUPLA.Application.Interfaces;
using ReservaUPLA.Application.Services;
using ReservaUPLA.Domain.Entities;
using Xunit;

namespace ReservaUPLA.Tests;

public class ReservaServiceTests
{
    private readonly Mock<IReservaRepository> _mockReservaRepo;
    private readonly Mock<IAmbienteRepository> _mockAmbienteRepo;
    private readonly Mock<IUsuarioRepository> _mockUsuarioRepo;
    private readonly ReservaService _service;

    private readonly Guid _usuarioId = Guid.NewGuid();
    private readonly Guid _ambienteId = Guid.NewGuid();

    public ReservaServiceTests()
    {
        _mockReservaRepo = new Mock<IReservaRepository>();
        _mockAmbienteRepo = new Mock<IAmbienteRepository>();
        _mockUsuarioRepo = new Mock<IUsuarioRepository>();

        _service = new ReservaService(
            _mockReservaRepo.Object,
            _mockAmbienteRepo.Object,
            _mockUsuarioRepo.Object);

        // Default setup for existing active user and available environment
        _mockUsuarioRepo.Setup(r => r.GetByIdAsync(_usuarioId))
            .ReturnsAsync(new Usuario
            {
                Id = _usuarioId,
                NombreCompleto = "Docente Prueba",
                Correo = "docente@upla.edu.pe",
                Activo = true
            });

        _mockAmbienteRepo.Setup(r => r.GetByIdAsync(_ambienteId))
            .ReturnsAsync(new Ambiente
            {
                Id = _ambienteId,
                Nombre = "Laboratorio 101",
                Tipo = "Laboratorio de Cómputo",
                Estado = "Disponible"
            });
    }

    [Fact]
    public async Task RN03_HoraFinMenorOIgualQueInicio_DebeLanzarExcepcion()
    {
        // Arrange: HoraFin (08:00) <= HoraInicio (09:00)
        var dto = new CreateReservaDto(
            Fecha: new DateOnly(2026, 11, 20),
            HoraInicio: new TimeSpan(9, 0, 0),
            HoraFin: new TimeSpan(8, 0, 0),
            Motivo: "Clase de Programación",
            UsuarioId: _usuarioId,
            AmbienteId: _ambienteId
        );

        // Act & Assert
        var ex = await Assert.ThrowsAsync<ArgumentException>(() => _service.CrearReservaAsync(dto));
        Assert.Contains("RN-03", ex.Message);
    }

    [Theory]
    [InlineData("06:30:00", "08:30:00")] // Inicio antes de 07:00
    [InlineData("21:00:00", "22:30:00")] // Fin después de 22:00
    public async Task RN04_HorarioFueraDeRangoPermitido_DebeLanzarExcepcion(string inicioStr, string finStr)
    {
        // Arrange: 07:00 - 22:00
        var dto = new CreateReservaDto(
            Fecha: new DateOnly(2026, 11, 20),
            HoraInicio: TimeSpan.Parse(inicioStr),
            HoraFin: TimeSpan.Parse(finStr),
            Motivo: "Tutoría de Tesis",
            UsuarioId: _usuarioId,
            AmbienteId: _ambienteId
        );

        // Act & Assert
        var ex = await Assert.ThrowsAsync<ArgumentException>(() => _service.CrearReservaAsync(dto));
        Assert.Contains("RN-04", ex.Message);
    }

    [Fact]
    public async Task RN01_ConflictoConReservaAprobada_DebeLanzarExcepcion()
    {
        // Arrange
        var fecha = new DateOnly(2026, 11, 20);
        var inicio = new TimeSpan(10, 0, 0);
        var fin = new TimeSpan(12, 0, 0);

        _mockReservaRepo.Setup(r => r.ExisteConflictoAprobadoAsync(_ambienteId, fecha, inicio, fin, null))
            .ReturnsAsync(true); // Hay colisión

        var dto = new CreateReservaDto(fecha, inicio, fin, "Taller de Robótica", _usuarioId, _ambienteId);

        // Act & Assert
        var ex = await Assert.ThrowsAsync<InvalidOperationException>(() => _service.CrearReservaAsync(dto));
        Assert.Contains("RN-01", ex.Message);
    }

    [Fact]
    public async Task RN06_ModificarReservaRechazada_DebeLanzarExcepcion()
    {
        // Arrange
        var reservaId = Guid.NewGuid();
        var reservaRechazada = new Reserva
        {
            Id = reservaId,
            Estado = "Rechazada",
            Motivo = "Prueba",
            AmbienteId = _ambienteId,
            UsuarioId = _usuarioId
        };

        _mockReservaRepo.Setup(r => r.GetByIdAsync(reservaId))
            .ReturnsAsync(reservaRechazada);

        var dto = new CambiarEstadoReservaDto("Aprobada", "Intentando reactivar");

        // Act & Assert
        var ex = await Assert.ThrowsAsync<InvalidOperationException>(() =>
            _service.CambiarEstadoAsync(reservaId, dto));

        Assert.Contains("RN-06", ex.Message);
    }

    [Fact]
    public async Task CrearReserva_DatosValidos_DebeCrearConEstadoPendiente()
    {
        // Arrange
        var fecha = new DateOnly(2026, 11, 20);
        var inicio = new TimeSpan(14, 0, 0);
        var fin = new TimeSpan(16, 0, 0);

        _mockReservaRepo.Setup(r => r.ExisteConflictoAprobadoAsync(_ambienteId, fecha, inicio, fin, null))
            .ReturnsAsync(false);

        _mockReservaRepo.Setup(r => r.AddAsync(It.IsAny<Reserva>()))
            .ReturnsAsync((Reserva r) => r);

        var dto = new CreateReservaDto(fecha, inicio, fin, "Sustentación de Proyecto", _usuarioId, _ambienteId);

        // Act
        var result = await _service.CrearReservaAsync(dto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Pendiente", result.Estado);
        Assert.Equal(dto.Motivo, result.Motivo);
    }
}
