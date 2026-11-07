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
        IConfiguration configuration,
        bool? isDevelopment = null)
    {
        await context.Database.MigrateAsync();

        var esDesarrollo = isDevelopment.HasValue
            ? isDevelopment.Value
            : (string.Equals(configuration["ASPNETCORE_ENVIRONMENT"], "Development", StringComparison.OrdinalIgnoreCase)
               || string.Equals(configuration["DOTNET_ENVIRONMENT"], "Development", StringComparison.OrdinalIgnoreCase));

        var claveAdmin = configuration["Seeder:AdminPassword"];
        var claveResp = configuration["Seeder:RespPassword"];
        var claveSolic = configuration["Seeder:SolicPassword"];
        var claveUser = configuration["Seeder:UserPassword"];

        if (string.IsNullOrWhiteSpace(claveAdmin))
        {
            if (esDesarrollo)
                claveAdmin = "UPLA#Admin$2026!SecOps*9";
            else
                throw new InvalidOperationException("La clave de configuración 'Seeder:AdminPassword' es requerida en entornos que no sean Development.");
        }

        if (string.IsNullOrWhiteSpace(claveResp))
        {
            claveResp = !string.IsNullOrWhiteSpace(claveUser) ? claveUser : (esDesarrollo ? "UPLA#Resp$2026!GestAmb*4" : "UPLA#Resp$2026!GestAmb*4");
        }

        if (string.IsNullOrWhiteSpace(claveSolic))
        {
            claveSolic = !string.IsNullOrWhiteSpace(claveUser) ? claveUser : (esDesarrollo ? "UPLA#Solic$2026!AcadUpla*7" : "UPLA#Solic$2026!AcadUpla*7");
        }

        var adminHash = passwordHasher.Hash(claveAdmin);
        var respHash = passwordHasher.Hash(claveResp);
        var solicHash = passwordHasher.Hash(claveSolic);

        // 1. Usuarios institucionales con credenciales robustas
        var admin = await context.Usuarios.FirstOrDefaultAsync(u => u.Cor_Usuario == "admin@upla.edu.pe");
        if (admin == null)
        {
            admin = Usuario.Crear("Administrador Central", "admin@upla.edu.pe", adminHash, RolUsuario.Administrador);
            await context.Usuarios.AddAsync(admin);
        }
        else if (esDesarrollo)
        {
            admin.ActualizarClave(adminHash);
        }

        var resp1 = await context.Usuarios.FirstOrDefaultAsync(u => u.Cor_Usuario == "responsable@upla.edu.pe");
        if (resp1 == null)
        {
            resp1 = Usuario.Crear("Roberto Salazar Mendoza", "responsable@upla.edu.pe", respHash, RolUsuario.Responsable);
            await context.Usuarios.AddAsync(resp1);
        }
        else if (esDesarrollo)
        {
            resp1.ActualizarClave(respHash);
        }

        var resp2 = await context.Usuarios.FirstOrDefaultAsync(u => u.Cor_Usuario == "maria.quispe@upla.edu.pe");
        if (resp2 == null)
        {
            resp2 = Usuario.Crear("Maria Quispe Condori", "maria.quispe@upla.edu.pe", respHash, RolUsuario.Responsable);
            await context.Usuarios.AddAsync(resp2);
        }
        else if (esDesarrollo)
        {
            resp2.ActualizarClave(respHash);
        }

        var resp3 = await context.Usuarios.FirstOrDefaultAsync(u => u.Cor_Usuario == "carlos.benites@upla.edu.pe");
        if (resp3 == null)
        {
            resp3 = Usuario.Crear("Carlos Benites Vega", "carlos.benites@upla.edu.pe", respHash, RolUsuario.Responsable);
            await context.Usuarios.AddAsync(resp3);
        }
        else if (esDesarrollo)
        {
            resp3.ActualizarClave(respHash);
        }

        var sol1 = await context.Usuarios.FirstOrDefaultAsync(u => u.Cor_Usuario == "solicitante@upla.edu.pe");
        if (sol1 == null)
        {
            sol1 = Usuario.Crear("Carmen Flores Quispe", "solicitante@upla.edu.pe", solicHash, RolUsuario.Solicitante);
            await context.Usuarios.AddAsync(sol1);
        }
        else if (esDesarrollo)
        {
            sol1.ActualizarClave(solicHash);
        }

        var sol2 = await context.Usuarios.FirstOrDefaultAsync(u => u.Cor_Usuario == "juan.perez@upla.edu.pe");
        if (sol2 == null)
        {
            sol2 = Usuario.Crear("Juan Perez Huaman", "juan.perez@upla.edu.pe", solicHash, RolUsuario.Solicitante);
            await context.Usuarios.AddAsync(sol2);
        }
        else if (esDesarrollo)
        {
            sol2.ActualizarClave(solicHash);
        }

        var sol3 = await context.Usuarios.FirstOrDefaultAsync(u => u.Cor_Usuario == "ana.torres@upla.edu.pe");
        if (sol3 == null)
        {
            sol3 = Usuario.Crear("Ana Torres Rojas", "ana.torres@upla.edu.pe", solicHash, RolUsuario.Solicitante);
            await context.Usuarios.AddAsync(sol3);
        }
        else if (esDesarrollo)
        {
            sol3.ActualizarClave(solicHash);
        }

        var sol4 = await context.Usuarios.FirstOrDefaultAsync(u => u.Cor_Usuario == "david.castro@upla.edu.pe");
        if (sol4 == null)
        {
            sol4 = Usuario.Crear("David Castro Morales", "david.castro@upla.edu.pe", solicHash, RolUsuario.Solicitante);
            await context.Usuarios.AddAsync(sol4);
        }
        else if (esDesarrollo)
        {
            sol4.ActualizarClave(solicHash);
        }

        var sol5 = await context.Usuarios.FirstOrDefaultAsync(u => u.Cor_Usuario == "elena.morales@upla.edu.pe");
        if (sol5 == null)
        {
            sol5 = Usuario.Crear("Elena Morales Ramos", "elena.morales@upla.edu.pe", solicHash, RolUsuario.Solicitante);
            await context.Usuarios.AddAsync(sol5);
        }
        else if (esDesarrollo)
        {
            sol5.ActualizarClave(solicHash);
        }

        await context.SaveChangesAsync();

        // 2. Catálogo de Ambientes (Todos con responsable asignado)
        var ambientesDef = new (string Nombre, TipAmbiente Tipo, int Capacidad, string Ubicacion, Guid IdResponsable)[]
        {
            ("Laboratorio de Computo 101", TipAmbiente.LaboratorioComputo, 35, "Pabellon B - 2do Piso", resp1.Id_Usuario),
            ("Auditorio Central Magno", TipAmbiente.Auditorio, 250, "Edificio Administrativo - Planta Baja", resp1.Id_Usuario),
            ("Sala de Grados y Titulos", TipAmbiente.SalaReuniones, 45, "Pabellon A - 3er Piso", resp2.Id_Usuario),
            ("Laboratorio de Robotica e IA", TipAmbiente.LaboratorioEspecializado, 25, "Pabellon C - 1er Piso", resp2.Id_Usuario),
            ("Aula Magna de Medicina", TipAmbiente.Auditorio, 120, "Pabellon de Ciencias de la Salud", resp3.Id_Usuario),
            ("Laboratorio de Redes Cisco", TipAmbiente.LaboratorioComputo, 30, "Pabellon B - 3er Piso", resp1.Id_Usuario),
            ("Sala de Reuniones de Facultad", TipAmbiente.SalaReuniones, 18, "Pabellon A - 2do Piso", resp3.Id_Usuario),
            ("Taller de Prototipado y Realidad Virtual", TipAmbiente.LaboratorioEspecializado, 22, "Pabellon C - 2do Piso", resp2.Id_Usuario)
        };

        foreach (var def in ambientesDef)
        {
            var amb = await context.Ambientes.FirstOrDefaultAsync(a => a.Nom_Ambiente == def.Nombre);
            if (amb == null)
            {
                amb = Ambiente.Crear(def.Nombre, def.Tipo, def.Capacidad, def.Ubicacion, def.IdResponsable);
                await context.Ambientes.AddAsync(amb);
            }
            else if (amb.Idr_Ambiente == null || amb.Idr_Ambiente != def.IdResponsable)
            {
                amb.AsignarResponsable(def.IdResponsable);
            }
        }
        await context.SaveChangesAsync();

        // 3. Reservas Institucionales Idempotentes
        var todosAmbientes = await context.Ambientes.ToListAsync();
        var getAmb = (string nombre) => todosAmbientes.First(a => a.Nom_Ambiente == nombre);

        var hoy = DateOnly.FromDateTime(DateTime.UtcNow);
        var ayer = hoy.AddDays(-1);
        var anteayer = hoy.AddDays(-2);
        var manana = hoy.AddDays(1);
        var pasado = hoy.AddDays(2);
        var dia3 = hoy.AddDays(3);
        var dia4 = hoy.AddDays(4);
        var dia5 = hoy.AddDays(5);

        var listaReservas = new List<(Reserva Reserva, EstadoReserva Estado, RolUsuario RolActor, Guid IdActor)>
        {
            // Bloque 1: Reservas Base
            (Reserva.Crear(hoy, new TimeSpan(8, 0, 0), new TimeSpan(10, 0, 0), "Taller de Programacion Concurrente en Java", sol1.Id_Usuario, getAmb("Laboratorio de Computo 101").Id_Ambiente), EstadoReserva.Aprobada, RolUsuario.Administrador, admin.Id_Usuario),
            (Reserva.Crear(hoy, new TimeSpan(10, 0, 0), new TimeSpan(13, 0, 0), "Ceremonia de Apertura del Semestre Academico", sol2.Id_Usuario, getAmb("Auditorio Central Magno").Id_Ambiente), EstadoReserva.Aprobada, RolUsuario.Administrador, admin.Id_Usuario),
            (Reserva.Crear(manana, new TimeSpan(9, 0, 0), new TimeSpan(11, 0, 0), "Sustentacion de Tesis de Titulacion Profesional", sol3.Id_Usuario, getAmb("Sala de Grados y Titulos").Id_Ambiente), EstadoReserva.Aprobada, RolUsuario.Administrador, admin.Id_Usuario),
            (Reserva.Crear(pasado, new TimeSpan(15, 0, 0), new TimeSpan(18, 0, 0), "Conferencia Magistral de Inteligencia Artificial Generativa", sol4.Id_Usuario, getAmb("Auditorio Central Magno").Id_Ambiente), EstadoReserva.Aprobada, RolUsuario.Administrador, admin.Id_Usuario),
            (Reserva.Crear(dia3, new TimeSpan(14, 0, 0), new TimeSpan(17, 0, 0), "Practica Libre de Programacion de Brazos Roboticos", sol1.Id_Usuario, getAmb("Laboratorio de Robotica e IA").Id_Ambiente), EstadoReserva.Aprobada, RolUsuario.Administrador, admin.Id_Usuario),
            (Reserva.Crear(ayer, new TimeSpan(14, 0, 0), new TimeSpan(16, 0, 0), "Charla de Induccion para Nuevos Ingresantes", sol2.Id_Usuario, getAmb("Auditorio Central Magno").Id_Ambiente), EstadoReserva.Aprobada, RolUsuario.Administrador, admin.Id_Usuario),

            // Pendientes Base
            (Reserva.Crear(manana, new TimeSpan(11, 0, 0), new TimeSpan(13, 0, 0), "Evaluacion Parcial de Conmutacion y Enrutamiento Cisco", sol2.Id_Usuario, getAmb("Laboratorio de Redes Cisco").Id_Ambiente), EstadoReserva.Pendiente, RolUsuario.Solicitante, sol2.Id_Usuario),
            (Reserva.Crear(pasado, new TimeSpan(9, 0, 0), new TimeSpan(12, 0, 0), "Seminario de Actualizacion en Telemedicina Clinica", sol3.Id_Usuario, getAmb("Aula Magna de Medicina").Id_Ambiente), EstadoReserva.Pendiente, RolUsuario.Solicitante, sol3.Id_Usuario),
            (Reserva.Crear(dia3, new TimeSpan(10, 0, 0), new TimeSpan(12, 0, 0), "Sesion Extraordinaria de Comision Curricular", sol4.Id_Usuario, getAmb("Sala de Reuniones de Facultad").Id_Ambiente), EstadoReserva.Pendiente, RolUsuario.Solicitante, sol4.Id_Usuario),
            (Reserva.Crear(pasado, new TimeSpan(14, 0, 0), new TimeSpan(16, 0, 0), "Taller de Bases de Datos Distribuidas PostgreSQL", sol1.Id_Usuario, getAmb("Laboratorio de Computo 101").Id_Ambiente), EstadoReserva.Pendiente, RolUsuario.Solicitante, sol1.Id_Usuario),

            // Rechazadas y Canceladas Base
            (Reserva.Crear(manana, new TimeSpan(8, 0, 0), new TimeSpan(11, 0, 0), "Reforzamiento de Algoritmia para Alumnos Observados", sol4.Id_Usuario, getAmb("Laboratorio de Computo 101").Id_Ambiente), EstadoReserva.Rechazada, RolUsuario.Administrador, admin.Id_Usuario),
            (Reserva.Crear(pasado, new TimeSpan(8, 0, 0), new TimeSpan(11, 0, 0), "Ensayo General de Elenco de Danzas", sol3.Id_Usuario, getAmb("Auditorio Central Magno").Id_Ambiente), EstadoReserva.Rechazada, RolUsuario.Administrador, admin.Id_Usuario),
            (Reserva.Crear(dia3, new TimeSpan(16, 0, 0), new TimeSpan(18, 0, 0), "Reunion de Coordinacion de Practicas Pre Profesionales", sol1.Id_Usuario, getAmb("Sala de Grados y Titulos").Id_Ambiente), EstadoReserva.Cancelada, RolUsuario.Solicitante, sol1.Id_Usuario),

            // Bloque 2: Nuevas Reservas Académicas Ampliadas
            (Reserva.Crear(manana, new TimeSpan(8, 0, 0), new TimeSpan(10, 0, 0), "Clase Magistral de Anatomia Humana y Fisiologia", sol1.Id_Usuario, getAmb("Aula Magna de Medicina").Id_Ambiente), EstadoReserva.Aprobada, RolUsuario.Administrador, admin.Id_Usuario),
            (Reserva.Crear(dia4, new TimeSpan(9, 0, 0), new TimeSpan(13, 0, 0), "Simposio Internacional de Ingenieria de Software UPLA", sol2.Id_Usuario, getAmb("Auditorio Central Magno").Id_Ambiente), EstadoReserva.Aprobada, RolUsuario.Administrador, admin.Id_Usuario),
            (Reserva.Crear(ayer, new TimeSpan(10, 0, 0), new TimeSpan(12, 0, 0), "Taller Practico de Ciberseguridad y Enrutamiento BGP", sol3.Id_Usuario, getAmb("Laboratorio de Redes Cisco").Id_Ambiente), EstadoReserva.Aprobada, RolUsuario.Administrador, admin.Id_Usuario),
            (Reserva.Crear(pasado, new TimeSpan(14, 0, 0), new TimeSpan(16, 0, 0), "Reunion de Coordinacion de Comite de Calidad e ICACIT", sol4.Id_Usuario, getAmb("Sala de Reuniones de Facultad").Id_Ambiente), EstadoReserva.Aprobada, RolUsuario.Administrador, admin.Id_Usuario),
            (Reserva.Crear(hoy, new TimeSpan(15, 0, 0), new TimeSpan(18, 0, 0), "Sesion de Modelado Tridimensional e Impresion 3D", sol5.Id_Usuario, getAmb("Taller de Prototipado y Realidad Virtual").Id_Ambiente), EstadoReserva.Aprobada, RolUsuario.Administrador, admin.Id_Usuario),
            (Reserva.Crear(dia3, new TimeSpan(8, 0, 0), new TimeSpan(10, 0, 0), "Examen Practico de Algoritmos y Estructuras de Datos", sol5.Id_Usuario, getAmb("Laboratorio de Computo 101").Id_Ambiente), EstadoReserva.Aprobada, RolUsuario.Administrador, admin.Id_Usuario),
            (Reserva.Crear(dia5, new TimeSpan(14, 0, 0), new TimeSpan(17, 0, 0), "Ceremonia de Clausura del Concurso de Innovacion Tecnologica", sol1.Id_Usuario, getAmb("Auditorio Central Magno").Id_Ambiente), EstadoReserva.Aprobada, RolUsuario.Administrador, admin.Id_Usuario),

            // Nuevas Pendientes
            (Reserva.Crear(dia3, new TimeSpan(14, 0, 0), new TimeSpan(17, 0, 0), "Taller de Primeros Auxilios y Atencion Prehospitalaria", sol2.Id_Usuario, getAmb("Aula Magna de Medicina").Id_Ambiente), EstadoReserva.Pendiente, RolUsuario.Solicitante, sol2.Id_Usuario),
            (Reserva.Crear(dia4, new TimeSpan(10, 0, 0), new TimeSpan(12, 0, 0), "Sesion Ordinaria de Consejo de Facultad de Ingenieria", sol3.Id_Usuario, getAmb("Sala de Reuniones de Facultad").Id_Ambiente), EstadoReserva.Pendiente, RolUsuario.Solicitante, sol3.Id_Usuario),
            (Reserva.Crear(dia5, new TimeSpan(9, 0, 0), new TimeSpan(12, 0, 0), "Desarrollo de Algoritmos de Vision Artificial para Drones", sol4.Id_Usuario, getAmb("Laboratorio de Robotica e IA").Id_Ambiente), EstadoReserva.Pendiente, RolUsuario.Solicitante, sol4.Id_Usuario),
            (Reserva.Crear(manana, new TimeSpan(14, 0, 0), new TimeSpan(17, 0, 0), "Conferencia de Etica en la Inteligencia Artificial y Big Data", sol5.Id_Usuario, getAmb("Auditorio Central Magno").Id_Ambiente), EstadoReserva.Pendiente, RolUsuario.Solicitante, sol5.Id_Usuario),

            // Nuevas Rechazadas y Canceladas
            (Reserva.Crear(dia4, new TimeSpan(11, 0, 0), new TimeSpan(13, 0, 0), "Reunion no autorizada de asociacion estudiantil externa", sol4.Id_Usuario, getAmb("Sala de Grados y Titulos").Id_Ambiente), EstadoReserva.Rechazada, RolUsuario.Administrador, admin.Id_Usuario),
            (Reserva.Crear(dia4, new TimeSpan(15, 0, 0), new TimeSpan(17, 0, 0), "Sesion de Pruebas de Visores Oculus por Mantenimiento", sol5.Id_Usuario, getAmb("Taller de Prototipado y Realidad Virtual").Id_Ambiente), EstadoReserva.Cancelada, RolUsuario.Solicitante, sol5.Id_Usuario)
        };

        var reservasExistentes = await context.Reservas.Select(r => r.Mot_Reserva).ToListAsync();
        var nuevasParaAgregar = new List<Reserva>();

        foreach (var item in listaReservas)
        {
            if (!reservasExistentes.Contains(item.Reserva.Mot_Reserva))
            {
                if (item.Estado != EstadoReserva.Pendiente)
                {
                    item.Reserva.CambiarEstado(item.Estado, item.RolActor, item.IdActor);
                }
                nuevasParaAgregar.Add(item.Reserva);
            }
        }

        if (nuevasParaAgregar.Any())
        {
            await context.Reservas.AddRangeAsync(nuevasParaAgregar);
            await context.SaveChangesAsync();
        }
    }
}
