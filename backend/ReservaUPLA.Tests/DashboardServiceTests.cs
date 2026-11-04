using Moq;
using ReservaUpla.Application.Interfaces;
using ReservaUpla.Application.Services;
using ReservaUpla.Domain.Entities;
using ReservaUpla.Domain.Enums;
using Xunit;

namespace ReservaUpla.Tests;

// Trazabilidad: RF-08 · Pruebas de indicadores y analítica de campus
public class DashboardServiceTests
{
    private readonly Mock<IReservaRepository> _mockReservaRepo;
    private readonly Mock<IRelojService> _mockRelojService;
    private readonly DashboardService _dashboardService;

    public DashboardServiceTests()
    {
        _mockReservaRepo = new Mock<IReservaRepository>();
        _mockRelojService = new Mock<IRelojService>();

        _mockRelojService.Setup(r => r.HoyLima()).Returns(new DateOnly(2026, 11, 4));

        _dashboardService = new DashboardService(
            _mockReservaRepo.Object,
            _mockRelojService.Object);
    }

    [Fact]
    public async Task ObtenerIndicadoresAsync_CalculaTasaYAmbienteCorrectamente()
    {
        _mockReservaRepo.Setup(r => r.ContarPorEstadoAsync(null, It.IsAny<CancellationToken>()))
            .ReturnsAsync(10);
        _mockReservaRepo.Setup(r => r.ContarPorEstadoAsync(EstadoReserva.Pendiente, It.IsAny<CancellationToken>()))
            .ReturnsAsync(2);
        _mockReservaRepo.Setup(r => r.ContarPorEstadoAsync(EstadoReserva.Aprobada, It.IsAny<CancellationToken>()))
            .ReturnsAsync(7);
        _mockReservaRepo.Setup(r => r.ContarPorEstadoAsync(EstadoReserva.Rechazada, It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);
        _mockReservaRepo.Setup(r => r.ObtenerAmbienteMasUtilizadoAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(("Auditorio Central Magno", 5));
        _mockReservaRepo.Setup(r => r.ObtenerDistribucionPorTipoAmbienteAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(new Dictionary<string, int>
            {
                { "Auditorio", 5 },
                { "LaboratorioComputo", 5 }
            });
        _mockReservaRepo.Setup(r => r.ObtenerReservasDeFechaAsync(It.IsAny<DateOnly>(), It.IsAny<int>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<Reserva>());

        var resultado = await _dashboardService.ObtenerIndicadoresAsync();

        Assert.Equal(10, resultado.TotalReservas);
        Assert.Equal(2, resultado.ReservasPendientes);
        Assert.Equal(7, resultado.ReservasAprobadas);
        Assert.Equal(1, resultado.ReservasRechazadas);
        Assert.Equal("Auditorio Central Magno", resultado.AmbienteMasUtilizado);
        Assert.Equal(5, resultado.CantidadAmbienteMasUtilizado);
        Assert.Equal(70.0, resultado.TasaAprobacion);
        Assert.NotNull(resultado.ReservasPorTipo);
        Assert.Empty(resultado.ReservasHoy!);
    }
}
