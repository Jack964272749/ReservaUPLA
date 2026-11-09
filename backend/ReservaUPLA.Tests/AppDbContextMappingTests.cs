using Microsoft.EntityFrameworkCore;
using ReservaUpla.Domain.Entities;
using ReservaUpla.Domain.Enums;
using ReservaUpla.Infrastructure.Data;
using Xunit;

namespace ReservaUpla.Tests;

// Trazabilidad: Persistencia · Contrato EF Core <-> PostgreSQL snake_case
public class AppDbContextMappingTests
{
    private static AppDbContext CrearContexto()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseNpgsql("Host=localhost;Database=reservaupla_test;Username=test;Password=test")
            .Options;

        return new AppDbContext(options);
    }

    [Theory]
    [InlineData(typeof(Usuario), nameof(Usuario.Id_Usuario), "id_usuario")]
    [InlineData(typeof(Usuario), nameof(Usuario.Nom_Usuario), "nom_usuario")]
    [InlineData(typeof(Usuario), nameof(Usuario.Cod_Usuario), "cod_usuario")]
    [InlineData(typeof(Usuario), nameof(Usuario.Cor_Usuario), "cor_usuario")]
    [InlineData(typeof(Usuario), nameof(Usuario.Has_Usuario), "has_usuario")]
    [InlineData(typeof(Usuario), nameof(Usuario.Rol_Usuario), "rol_usuario")]
    [InlineData(typeof(Usuario), nameof(Usuario.Act_Usuario), "act_usuario")]
    [InlineData(typeof(Ambiente), nameof(Ambiente.Id_Ambiente), "id_ambiente")]
    [InlineData(typeof(Ambiente), nameof(Ambiente.Nom_Ambiente), "nom_ambiente")]
    [InlineData(typeof(Ambiente), nameof(Ambiente.Tip_Ambiente), "tip_ambiente")]
    [InlineData(typeof(Ambiente), nameof(Ambiente.Cap_Ambiente), "cap_ambiente")]
    [InlineData(typeof(Ambiente), nameof(Ambiente.Ubi_Ambiente), "ubi_ambiente")]
    [InlineData(typeof(Ambiente), nameof(Ambiente.Est_Ambiente), "est_ambiente")]
    [InlineData(typeof(Ambiente), nameof(Ambiente.Idr_Ambiente), "idr_ambiente")]
    [InlineData(typeof(Reserva), nameof(Reserva.Id_Reserva), "id_reserva")]
    [InlineData(typeof(Reserva), nameof(Reserva.Fec_Reserva), "fec_reserva")]
    [InlineData(typeof(Reserva), nameof(Reserva.Hin_Reserva), "hin_reserva")]
    [InlineData(typeof(Reserva), nameof(Reserva.Hfi_Reserva), "hfi_reserva")]
    [InlineData(typeof(Reserva), nameof(Reserva.Mot_Reserva), "mot_reserva")]
    [InlineData(typeof(Reserva), nameof(Reserva.Est_Reserva), "est_reserva")]
    [InlineData(typeof(Reserva), nameof(Reserva.Idu_Reserva), "idu_reserva")]
    [InlineData(typeof(Reserva), nameof(Reserva.Ida_Reserva), "ida_reserva")]
    [InlineData(typeof(Reserva), nameof(Reserva.Fre_Reserva), "fre_reserva")]
    public void Propiedades_MapeanAColumnasSnakeCase(Type entidad, string propiedad, string columnaEsperada)
    {
        using var context = CrearContexto();

        var propiedadMapeada = context.Model.FindEntityType(entidad)!.FindProperty(propiedad);

        Assert.NotNull(propiedadMapeada);
        Assert.Equal(columnaEsperada, propiedadMapeada!.GetColumnName());
    }

    [Fact]
    public void ConsultaPaginadaDeReservas_GeneraSqlConColumnasReales()
    {
        using var context = CrearContexto();

        var sql = context.Reservas
            .Include(r => r.Usuario)
            .Include(r => r.Ambiente)
            .Where(r => r.Est_Reserva == EstadoReserva.Pendiente)
            .OrderByDescending(r => r.Fre_Reserva)
            .Take(50)
            .ToQueryString();

        Assert.Contains("mot_reserva", sql);
        Assert.DoesNotContain("\"Mot_Reserva\"", sql);
    }

    [Fact]
    public void DistribucionPorTipoAmbiente_SeTraduceASql()
    {
        using var context = CrearContexto();

        var sql = context.Reservas
            .Where(r => r.Ambiente != null)
            .GroupBy(r => r.Ambiente!.Tip_Ambiente)
            .Select(g => new { Tipo = g.Key, Cantidad = g.Count() })
            .ToQueryString();

        Assert.Contains("tip_ambiente", sql);
    }
}
