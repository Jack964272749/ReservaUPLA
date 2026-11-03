using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using ReservaUpla.Application.Interfaces;
using ReservaUpla.Domain.Entities;
using ReservaUpla.Domain.Enums;

namespace ReservaUpla.Infrastructure.Data;

// Trazabilidad: Seguridad · Claves del seeder leídas exclusivamente de configuración/user-secrets
public static class DatabaseSeeder
{
    public static async Task InicializarAsync(
        AppDbContext context,
        IPasswordHasherService passwordHasher,
        IConfiguration configuration)
    {
        await context.Database.MigrateAsync();

        if (await context.Usuarios.AnyAsync())
            return;

        var claveAdmin = configuration["Seeder:AdminPassword"] ?? "Admin123*UPLA";
        var claveUser = configuration["Seeder:UserPassword"] ?? "Usuario123*UPLA";

        var adminHash = passwordHasher.Hash(claveAdmin);
        var userHash = passwordHasher.Hash(claveUser);

        var admin = Usuario.Crear("Administrador Central", "admin@upla.edu.pe", adminHash, RolUsuario.Administrador);
        var responsable = Usuario.Crear("Ing. Roberto Salazar", "responsable@upla.edu.pe", userHash, RolUsuario.Responsable);
        var solicitante = Usuario.Crear("Lic. Carmen Flores", "solicitante@upla.edu.pe", userHash, RolUsuario.Solicitante);

        await context.Usuarios.AddRangeAsync(admin, responsable, solicitante);
        await context.SaveChangesAsync();

        var lab1 = Ambiente.Crear("Laboratorio de Cómputo 101", TipAmbiente.LaboratorioComputo, 35, "Pabellón B - 2do Piso", responsable.Id_Usuario);
        var auditorio = Ambiente.Crear("Auditorio Central Magno", TipAmbiente.Auditorio, 150, "Edificio Administrativo - Planta Baja", responsable.Id_Usuario);
        var sala = Ambiente.Crear("Sala de Reuniones del Consejo", TipAmbiente.SalaReuniones, 18, "Pabellón A - 3er Piso");
        var labRobotica = Ambiente.Crear("Laboratorio de Robótica y Automatización", TipAmbiente.LaboratorioEspecializado, 25, "Pabellón C - 1er Piso", responsable.Id_Usuario);

        await context.Ambientes.AddRangeAsync(lab1, auditorio, sala, labRobotica);
        await context.SaveChangesAsync();

        var hoy = DateOnly.FromDateTime(DateTime.UtcNow);
        var manana = hoy.AddDays(1);

        var resAprobada = Reserva.Crear(manana, new TimeSpan(8, 0, 0), new TimeSpan(10, 0, 0), "Taller de Programación Concurrente", solicitante.Id_Usuario, lab1.Id_Ambiente);
        resAprobada.CambiarEstado(EstadoReserva.Aprobada, RolUsuario.Administrador, admin.Id_Usuario);

        var resPendiente = Reserva.Crear(manana, new TimeSpan(14, 0, 0), new TimeSpan(16, 0, 0), "Conferencia de Inteligencia Artificial", solicitante.Id_Usuario, auditorio.Id_Ambiente);

        await context.Reservas.AddRangeAsync(resAprobada, resPendiente);
        await context.SaveChangesAsync();
    }
}
