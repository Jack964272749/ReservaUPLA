using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using ReservaUpla.Application.Interfaces;
using ReservaUpla.Domain.Entities;
using ReservaUpla.Domain.Enums;

namespace ReservaUpla.Infrastructure.Data;

// Trazabilidad: Seguridad · Claves del seeder leídas exclusivamente de configuración/user-secrets · Poblamiento completo institucional
public static class DatabaseSeeder
{
    public static async Task InicializarAsync(
        AppDbContext context,
        IPasswordHasherService passwordHasher,
        IConfiguration configuration)
    {
        await context.Database.MigrateAsync();

        var claveAdmin = configuration["Seeder:AdminPassword"] ?? "Admin123*UPLA";
        var claveUser = configuration["Seeder:UserPassword"] ?? "Usuario123*UPLA";

        var adminHash = passwordHasher.Hash(claveAdmin);
        var userHash = passwordHasher.Hash(claveUser);

        // 1. Usuarios institucionales
        var admin = await context.Usuarios.FirstOrDefaultAsync(u => u.Cor_Usuario == "admin@upla.edu.pe");
        if (admin == null)
        {
            admin = Usuario.Crear("Administrador Central", "admin@upla.edu.pe", adminHash, RolUsuario.Administrador);
            await context.Usuarios.AddAsync(admin);
        }

        var resp1 = await context.Usuarios.FirstOrDefaultAsync(u => u.Cor_Usuario == "responsable@upla.edu.pe");
        if (resp1 == null)
        {
            resp1 = Usuario.Crear("Roberto Salazar Mendoza", "responsable@upla.edu.pe", userHash, RolUsuario.Responsable);
            await context.Usuarios.AddAsync(resp1);
        }

        var resp2 = await context.Usuarios.FirstOrDefaultAsync(u => u.Cor_Usuario == "maria.quispe@upla.edu.pe");
        if (resp2 == null)
        {
            resp2 = Usuario.Crear("Maria Quispe Condori", "maria.quispe@upla.edu.pe", userHash, RolUsuario.Responsable);
            await context.Usuarios.AddAsync(resp2);
        }

        var sol1 = await context.Usuarios.FirstOrDefaultAsync(u => u.Cor_Usuario == "solicitante@upla.edu.pe");
        if (sol1 == null)
        {
            sol1 = Usuario.Crear("Carmen Flores Quispe", "solicitante@upla.edu.pe", userHash, RolUsuario.Solicitante);
            await context.Usuarios.AddAsync(sol1);
        }

        var sol2 = await context.Usuarios.FirstOrDefaultAsync(u => u.Cor_Usuario == "juan.perez@upla.edu.pe");
        if (sol2 == null)
        {
            sol2 = Usuario.Crear("Juan Perez Huaman", "juan.perez@upla.edu.pe", userHash, RolUsuario.Solicitante);
            await context.Usuarios.AddAsync(sol2);
        }

        var sol3 = await context.Usuarios.FirstOrDefaultAsync(u => u.Cor_Usuario == "ana.torres@upla.edu.pe");
        if (sol3 == null)
        {
            sol3 = Usuario.Crear("Ana Torres Rojas", "ana.torres@upla.edu.pe", userHash, RolUsuario.Solicitante);
            await context.Usuarios.AddAsync(sol3);
        }

        var sol4 = await context.Usuarios.FirstOrDefaultAsync(u => u.Cor_Usuario == "david.castro@upla.edu.pe");
        if (sol4 == null)
        {
            sol4 = Usuario.Crear("David Castro Morales", "david.castro@upla.edu.pe", userHash, RolUsuario.Solicitante);
            await context.Usuarios.AddAsync(sol4);
        }

        await context.SaveChangesAsync();

        // 2. Catálogo de Ambientes
        var ambientesDef = new (string Nombre, TipAmbiente Tipo, int Capacidad, string Ubicacion, Guid? IdResponsable)[]
        {
            ("Laboratorio de Computo 101", TipAmbiente.LaboratorioComputo, 35, "Pabellon B - 2do Piso", resp1.Id_Usuario),
            ("Auditorio Central Magno", TipAmbiente.Auditorio, 250, "Edificio Administrativo - Planta Baja", resp1.Id_Usuario),
            ("Sala de Grados y Titulos", TipAmbiente.SalaReuniones, 45, "Pabellon A - 3er Piso", resp2.Id_Usuario),
            ("Laboratorio de Robotica e IA", TipAmbiente.LaboratorioEspecializado, 25, "Pabellon C - 1er Piso", resp2.Id_Usuario),
            ("Aula Magna de Medicina", TipAmbiente.Auditorio, 120, "Pabellon de Ciencias de la Salud", null),
            ("Laboratorio de Redes Cisco", TipAmbiente.LaboratorioComputo, 30, "Pabellon B - 3er Piso", resp1.Id_Usuario),
            ("Sala de Reuniones de Facultad", TipAmbiente.SalaReuniones, 18, "Pabellon A - 2do Piso", null),
            ("Taller de Prototipado y Realidad Virtual", TipAmbiente.LaboratorioEspecializado, 22, "Pabellon C - 2do Piso", resp2.Id_Usuario)
        };

        foreach (var def in ambientesDef)
        {
            var existe = await context.Ambientes.AnyAsync(a => a.Nom_Ambiente == def.Nombre);
            if (!existe)
            {
                var amb = Ambiente.Crear(def.Nombre, def.Tipo, def.Capacidad, def.Ubicacion, def.IdResponsable);
                await context.Ambientes.AddAsync(amb);
            }
        }
        await context.SaveChangesAsync();

        // 3. Reservas Institucionales (si hay menos de 10)
        var totalReservas = await context.Reservas.CountAsync();
        if (totalReservas < 10)
        {
            var todosAmbientes = await context.Ambientes.ToListAsync();
            var getAmb = (string nombre) => todosAmbientes.First(a => a.Nom_Ambiente == nombre);

            var hoy = DateOnly.FromDateTime(DateTime.UtcNow);
            var manana = hoy.AddDays(1);
            var pasado = hoy.AddDays(2);
            var dia3 = hoy.AddDays(3);
            var ayer = hoy.AddDays(-1);

            var nuevasReservas = new List<Reserva>();

            // Reserva Aprobada 1: Lab 101, Hoy 08:00 a 10:00 (sol1)
            var r1 = Reserva.Crear(hoy, new TimeSpan(8, 0, 0), new TimeSpan(10, 0, 0), "Taller de Programacion Concurrente en Java", sol1.Id_Usuario, getAmb("Laboratorio de Computo 101").Id_Ambiente);
            r1.CambiarEstado(EstadoReserva.Aprobada, RolUsuario.Administrador, admin.Id_Usuario);
            nuevasReservas.Add(r1);

            // Reserva Aprobada 2: Auditorio Central, Hoy 10:00 a 13:00 (sol2)
            var r2 = Reserva.Crear(hoy, new TimeSpan(10, 0, 0), new TimeSpan(13, 0, 0), "Ceremonia de Apertura del Semestre Academico", sol2.Id_Usuario, getAmb("Auditorio Central Magno").Id_Ambiente);
            r2.CambiarEstado(EstadoReserva.Aprobada, RolUsuario.Administrador, admin.Id_Usuario);
            nuevasReservas.Add(r2);

            // Reserva Aprobada 3: Sala de Grados, Manana 09:00 a 11:00 (sol3)
            var r3 = Reserva.Crear(manana, new TimeSpan(9, 0, 0), new TimeSpan(11, 0, 0), "Sustentacion de Tesis de Titulacion Profesional", sol3.Id_Usuario, getAmb("Sala de Grados y Titulos").Id_Ambiente);
            r3.CambiarEstado(EstadoReserva.Aprobada, RolUsuario.Administrador, admin.Id_Usuario);
            nuevasReservas.Add(r3);

            // Reserva Aprobada 4: Auditorio Central, Pasado 15:00 a 18:00 (sol4)
            var r4 = Reserva.Crear(pasado, new TimeSpan(15, 0, 0), new TimeSpan(18, 0, 0), "Conferencia Magistral de Inteligencia Artificial Generativa", sol4.Id_Usuario, getAmb("Auditorio Central Magno").Id_Ambiente);
            r4.CambiarEstado(EstadoReserva.Aprobada, RolUsuario.Administrador, admin.Id_Usuario);
            nuevasReservas.Add(r4);

            // Reserva Aprobada 5: Lab Robotica, Dia 3 14:00 a 17:00 (sol1)
            var r5 = Reserva.Crear(dia3, new TimeSpan(14, 0, 0), new TimeSpan(17, 0, 0), "Practica Libre de Programacion de Brazos Roboticos", sol1.Id_Usuario, getAmb("Laboratorio de Robotica e IA").Id_Ambiente);
            r5.CambiarEstado(EstadoReserva.Aprobada, RolUsuario.Administrador, admin.Id_Usuario);
            nuevasReservas.Add(r5);

            // Reserva Aprobada 6: Auditorio Central, Ayer 14:00 a 16:00 (sol2)
            var r6 = Reserva.Crear(ayer, new TimeSpan(14, 0, 0), new TimeSpan(16, 0, 0), "Charla de Induccion para Nuevos Ingresantes", sol2.Id_Usuario, getAmb("Auditorio Central Magno").Id_Ambiente);
            r6.CambiarEstado(EstadoReserva.Aprobada, RolUsuario.Administrador, admin.Id_Usuario);
            nuevasReservas.Add(r6);

            // Reserva Pendiente 1: Lab Redes Cisco, Manana 11:00 a 13:00 (sol2)
            var r7 = Reserva.Crear(manana, new TimeSpan(11, 0, 0), new TimeSpan(13, 0, 0), "Evaluacion Parcial de Conmutacion y Enrutamiento Cisco", sol2.Id_Usuario, getAmb("Laboratorio de Redes Cisco").Id_Ambiente);
            nuevasReservas.Add(r7);

            // Reserva Pendiente 2: Aula Magna Medicina, Pasado 09:00 a 12:00 (sol3)
            var r8 = Reserva.Crear(pasado, new TimeSpan(9, 0, 0), new TimeSpan(12, 0, 0), "Seminario de Actualizacion en Telemedicina Clinica", sol3.Id_Usuario, getAmb("Aula Magna de Medicina").Id_Ambiente);
            nuevasReservas.Add(r8);

            // Reserva Pendiente 3: Sala de Reuniones, Dia 3 10:00 a 12:00 (sol4)
            var r9 = Reserva.Crear(dia3, new TimeSpan(10, 0, 0), new TimeSpan(12, 0, 0), "Sesion Extraordinaria de Comision Curricular", sol4.Id_Usuario, getAmb("Sala de Reuniones de Facultad").Id_Ambiente);
            nuevasReservas.Add(r9);

            // Reserva Pendiente 4: Lab Computo 101, Pasado 14:00 a 16:00 (sol1)
            var r10 = Reserva.Crear(pasado, new TimeSpan(14, 0, 0), new TimeSpan(16, 0, 0), "Taller de Bases de Datos Distribuidas PostgreSQL", sol1.Id_Usuario, getAmb("Laboratorio de Computo 101").Id_Ambiente);
            nuevasReservas.Add(r10);

            // Reserva Rechazada 1: Lab 101, Manana 08:00 a 11:00 (sol4)
            var r11 = Reserva.Crear(manana, new TimeSpan(8, 0, 0), new TimeSpan(11, 0, 0), "Reforzamiento de Algoritmia para Alumnos Observados", sol4.Id_Usuario, getAmb("Laboratorio de Computo 101").Id_Ambiente);
            r11.CambiarEstado(EstadoReserva.Rechazada, RolUsuario.Administrador, admin.Id_Usuario);
            nuevasReservas.Add(r11);

            // Reserva Rechazada 2: Auditorio Central, Pasado 08:00 a 11:00 (sol3)
            var r12 = Reserva.Crear(pasado, new TimeSpan(8, 0, 0), new TimeSpan(11, 0, 0), "Ensayo General de Elenco de Danzas", sol3.Id_Usuario, getAmb("Auditorio Central Magno").Id_Ambiente);
            r12.CambiarEstado(EstadoReserva.Rechazada, RolUsuario.Administrador, admin.Id_Usuario);
            nuevasReservas.Add(r12);

            // Reserva Cancelada 1: Sala de Grados, Dia 3 16:00 a 18:00 (sol1)
            var r13 = Reserva.Crear(dia3, new TimeSpan(16, 0, 0), new TimeSpan(18, 0, 0), "Reunion de Coordinacion de Practicas Pre Profesionales", sol1.Id_Usuario, getAmb("Sala de Grados y Titulos").Id_Ambiente);
            r13.CambiarEstado(EstadoReserva.Cancelada, RolUsuario.Solicitante, sol1.Id_Usuario);
            nuevasReservas.Add(r13);

            await context.Reservas.AddRangeAsync(nuevasReservas);
            await context.SaveChangesAsync();
        }
    }
}
