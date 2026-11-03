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

public class ReservaServiceTests
{
    private readonly Mock<IReservaRepository> _mockReservaRepo;
    private readonly Mock<IAmbienteRepository> _mockAmbienteRepo;
    private readonly Mock<IUsuarioRepository> _mockUsuarioRepo;
    private readonly Mock<IPasswordHasherService> _mockPasswordHasher;
    private readonly ReservaService _reservaService;
    private readonly AuthService _authService;

    private readonly Guid _usuarioId = Guid.NewGuid();
    private readonly Guid _ambienteId = Guid.NewGuid();

    public ReservaServiceTests()
    {
        _mockReservaRepo = new Mock<IReservaRepository>();
        _mockAmbienteRepo = new Mock<IAmbienteRepository>();
        _mockUsuarioRepo = new Mock<IUsuarioRepository>();
        _mockPasswordHasher = new Mock<IPasswordHasherService>();

        _reservaService = new ReservaService(
            _mockReservaRepo.Object,
            _mockAmbienteRepo.Object,
            _mockUsuarioRepo.Object);

        _authService = new AuthService(
            _mockUsuarioRepo.Object,
            _mockPasswordHasher.Object);

        // Configuración de ambiente disponible por defecto
        var ambiente = Ambiente.Crear("Laboratorio 101", TipAmbiente.LaboratorioComputo, 30, "Pabellón B");
        _mockAmbienteRepo.Setup(r => r.ObtenerPorIdAsync(_ambienteId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(ambiente);

        _mockReservaRepo.Setup(r => r.EjecutarEnTransaccionSerializableAsync(It.IsAny<Func<Task>>(), It.IsAny<CancellationToken>()))
            .Returns<Func<Task>, CancellationToken>((action, _) => action());
    }

    [Fact]
    public async Task E01_RegistroSolicitanteCorrecto()
    {
        _mockPasswordHasher.Setup(h => h.Hash("ClaveValida123*")).Returns("hash_seguro");

        var dto = new RegistroSolicitanteDto("Carlos Mendoza", "cmendoza@upla.edu.pe", "ClaveValida123*");
        var resultado = await _authService.RegistrarSolicitanteAsync(dto);

        Assert.NotNull(resultado);
        Assert.Equal("cmendoza@upla.edu.pe", resultado.Correo);
        Assert.Equal("Solicitante", resultado.Rol);
    }

    [Fact]
    public async Task E02_CamposVaciosEnRegistro_LanzaExcepcion()
    {
        var dto = new RegistroSolicitanteDto("", "cmendoza@upla.edu.pe", "ClaveValida123*");
        var ex = await Assert.ThrowsAsync<DomainException>(() => _authService.RegistrarSolicitanteAsync(dto));
        Assert.Equal(Mensajes.NombreRequerido, ex.Message);
    }

    [Fact]
    public async Task E03_CorreoFormatoIncorrecto_LanzaExcepcion()
    {
        var dto = new RegistroSolicitanteDto("Carlos Mendoza", "correo_invalido", "ClaveValida123*");
        var ex = await Assert.ThrowsAsync<DomainException>(() => _authService.RegistrarSolicitanteAsync(dto));
        Assert.Equal(Mensajes.CorreoInvalido, ex.Message);
    }

    [Fact]
    public async Task E06_EspaciosYMayusculasEnCorreo_SeNormalizan()
    {
        _mockPasswordHasher.Setup(h => h.Hash(It.IsAny<string>())).Returns("hash_seguro");

        var dto = new RegistroSolicitanteDto("Carlos Mendoza", "  CMENDOZA@UPLA.EDU.PE  ", "ClaveValida123*");
        var resultado = await _authService.RegistrarSolicitanteAsync(dto);

        Assert.Equal("cmendoza@upla.edu.pe", resultado.Correo);
    }

    [Fact]
    public async Task E08_LoginIncorrecto_MensajeUniformeYVerificacionDummyInvocada()
    {
        _mockUsuarioRepo.Setup(r => r.ObtenerPorCorreoAsync("inexistente@upla.edu.pe", It.IsAny<CancellationToken>()))
            .ReturnsAsync((Usuario?)null);

        var dto = new LoginDto("inexistente@upla.edu.pe", "ClaveErronea123*");
        var ex = await Assert.ThrowsAsync<DomainException>(() => _authService.LoginAsync(dto));

        Assert.Equal(Mensajes.CredencialesInvalidas, ex.Message);
        Assert.Equal(401, ex.CodigoEstadoHttp);
        _mockPasswordHasher.Verify(h => h.VerifyDummy(), Times.Once);
    }

    [Fact]
    public void E10_RegistroAmbienteCorrecto()
    {
        var amb = Ambiente.Crear("Laboratorio 202", TipAmbiente.LaboratorioComputo, 25, "Pabellón A");
        Assert.Equal("Laboratorio 202", amb.Nom_Ambiente);
        Assert.Equal(25, amb.Cap_Ambiente);
        Assert.Equal(EstAmbiente.Disponible, amb.Est_Ambiente);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-5)]
    [InlineData(1500)]
    public void E11_CapacidadInvalida_LanzaExcepcion(int capacidadInvalida)
    {
        var ex = Assert.Throws<DomainException>(() =>
            Ambiente.Crear("Lab", TipAmbiente.LaboratorioComputo, capacidadInvalida, "Pabellón A"));
        Assert.Equal(Mensajes.CapacidadInvalida, ex.Message);
    }

    [Fact]
    public async Task E14_FinMenorOIgualQueInicio_LanzaExcepcion()
    {
        var manana = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var dto = new CrearReservaDto(manana, new TimeSpan(10, 0, 0), new TimeSpan(9, 0, 0), "Motivo de prueba académica", _ambienteId);

        var ex = await Assert.ThrowsAsync<DomainException>(() => _reservaService.CrearAsync(dto, _usuarioId));
        Assert.Equal(Mensajes.HoraFinMenorIgual, ex.Message);
    }

    [Theory]
    [InlineData("06:30:00", "08:30:00")]
    [InlineData("21:00:00", "22:30:00")]
    public async Task E15_HorarioFueraDeRango_LanzaExcepcion(string inicioStr, string finStr)
    {
        var manana = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var dto = new CrearReservaDto(manana, TimeSpan.Parse(inicioStr), TimeSpan.Parse(finStr), "Motivo de prueba académica", _ambienteId);

        var ex = await Assert.ThrowsAsync<DomainException>(() => _reservaService.CrearAsync(dto, _usuarioId));
        Assert.Equal(Mensajes.HorarioFueraRango, ex.Message);
    }

    [Fact]
    public async Task E16_FechaPasada_LanzaExcepcion()
    {
        var ayer = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-1));
        var dto = new CrearReservaDto(ayer, new TimeSpan(8, 0, 0), new TimeSpan(10, 0, 0), "Motivo de prueba académica", _ambienteId);

        var ex = await Assert.ThrowsAsync<DomainException>(() => _reservaService.CrearAsync(dto, _usuarioId));
        Assert.Equal(Mensajes.FechaPasada, ex.Message);
    }

    [Fact]
    public async Task E17_ConflictoConReservaAprobada_LanzaExcepcion409()
    {
        var manana = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var inicio = new TimeSpan(8, 0, 0);
        var fin = new TimeSpan(10, 0, 0);

        _mockReservaRepo.Setup(r => r.HayConflictoAprobadoAsync(_ambienteId, manana, inicio, fin, null, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        var dto = new CrearReservaDto(manana, inicio, fin, "Motivo de prueba académica", _ambienteId);
        var ex = await Assert.ThrowsAsync<DomainException>(() => _reservaService.CrearAsync(dto, _usuarioId));

        Assert.Equal(Mensajes.ConflictoDisponibilidad, ex.Message);
        Assert.Equal(409, ex.CodigoEstadoHttp);
    }

    [Fact]
    public async Task E18_AprobarSiendoSolicitante_Lanza403()
    {
        var reservaId = Guid.NewGuid();
        var manana = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var reserva = Reserva.Crear(manana, new TimeSpan(8, 0, 0), new TimeSpan(10, 0, 0), "Motivo de prueba académica", _usuarioId, _ambienteId);

        _mockReservaRepo.Setup(r => r.ObtenerPorIdAsync(reservaId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(reserva);

        var ex = await Assert.ThrowsAsync<DomainException>(() =>
            _reservaService.CambiarEstadoAsync(reservaId, "Aprobada", _usuarioId, RolUsuario.Solicitante));

        Assert.Equal(Mensajes.SoloAdminApruebaRechaza, ex.Message);
        Assert.Equal(403, ex.CodigoEstadoHttp);
    }

    [Fact]
    public async Task E20_ModificarReservaRechazada_Lanza409()
    {
        var reservaId = Guid.NewGuid();
        var manana = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var reserva = Reserva.Crear(manana, new TimeSpan(8, 0, 0), new TimeSpan(10, 0, 0), "Motivo de prueba académica", _usuarioId, _ambienteId);

        // Rechazada por Admin
        reserva.CambiarEstado(EstadoReserva.Rechazada, RolUsuario.Administrador, Guid.NewGuid());

        _mockReservaRepo.Setup(r => r.ObtenerPorIdAsync(reservaId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(reserva);

        var ex = await Assert.ThrowsAsync<DomainException>(() =>
            _reservaService.CambiarEstadoAsync(reservaId, "Aprobada", Guid.NewGuid(), RolUsuario.Administrador));

        Assert.Equal(Mensajes.ReservaRechazadaInmodificable, ex.Message);
        Assert.Equal(409, ex.CodigoEstadoHttp);
    }
}
