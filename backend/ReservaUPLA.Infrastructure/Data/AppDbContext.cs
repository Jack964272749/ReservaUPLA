using Microsoft.EntityFrameworkCore;
using ReservaUPLA.Domain.Entities;

namespace ReservaUPLA.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Ambiente> Ambientes => Set<Ambiente>();
    public DbSet<Reserva> Reservas => Set<Reserva>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Usuario Configuration
        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.HasKey(u => u.Id);
            entity.Property(u => u.NombreCompleto).IsRequired().HasMaxLength(150);
            entity.Property(u => u.Correo).IsRequired().HasMaxLength(150);
            entity.HasIndex(u => u.Correo).IsUnique();
            entity.Property(u => u.Rol).IsRequired().HasMaxLength(50);
        });

        // Ambiente Configuration
        modelBuilder.Entity<Ambiente>(entity =>
        {
            entity.HasKey(a => a.Id);
            entity.Property(a => a.Nombre).IsRequired().HasMaxLength(100);
            entity.Property(a => a.Tipo).IsRequired().HasMaxLength(50);
            entity.Property(a => a.Ubicacion).HasMaxLength(100);
            entity.Property(a => a.Estado).IsRequired().HasMaxLength(30);
        });

        // Reserva Configuration
        modelBuilder.Entity<Reserva>(entity =>
        {
            entity.HasKey(r => r.Id);
            entity.Property(r => r.Motivo).IsRequired();
            entity.Property(r => r.Estado).IsRequired().HasMaxLength(30);
            entity.Property(r => r.ObservacionAdmin).HasMaxLength(300);

            entity.HasOne(r => r.Usuario)
                .WithMany(u => u.Reservas)
                .HasForeignKey(r => r.UsuarioId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(r => r.Ambiente)
                .WithMany(a => a.Reservas)
                .HasForeignKey(r => r.AmbienteId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Seed initial data
        SeedInitialData(modelBuilder);
    }

    private static void SeedInitialData(ModelBuilder modelBuilder)
    {
        var adminId = Guid.Parse("11111111-1111-1111-1111-111111111111");
        var solicitanteId = Guid.Parse("22222222-2222-2222-2222-222222222222");
        var responsableId = Guid.Parse("33333333-3333-3333-3333-333333333333");

        modelBuilder.Entity<Usuario>().HasData(
            new Usuario
            {
                Id = adminId,
                NombreCompleto = "Administrador General",
                Correo = "admin@upla.edu.pe",
                Rol = "Administrador",
                Activo = true,
                FechaCreacion = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Usuario
            {
                Id = solicitanteId,
                NombreCompleto = "Juan Pérez Docente",
                Correo = "jperez@upla.edu.pe",
                Rol = "Solicitante",
                Activo = true,
                FechaCreacion = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Usuario
            {
                Id = responsableId,
                NombreCompleto = "María Gómez Encargada",
                Correo = "mgomez@upla.edu.pe",
                Rol = "Responsable de ambiente",
                Activo = true,
                FechaCreacion = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc)
            }
        );

        var lab1Id = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
        var audId = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb");
        var salaId = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc");
        var labRobId = Guid.Parse("dddddddd-dddd-dddd-dddd-dddddddddddd");

        modelBuilder.Entity<Ambiente>().HasData(
            new Ambiente
            {
                Id = lab1Id,
                Nombre = "Laboratorio de Cómputo 101",
                Tipo = "Laboratorio de Cómputo",
                Capacidad = 35,
                Ubicacion = "Pabellón B - Segundo Piso",
                Estado = "Disponible",
                FechaCreacion = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Ambiente
            {
                Id = audId,
                Nombre = "Auditorio Central Magno",
                Tipo = "Auditorio",
                Capacidad = 150,
                Ubicacion = "Edificio Administrativo - Planta Baja",
                Estado = "Disponible",
                FechaCreacion = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Ambiente
            {
                Id = salaId,
                Nombre = "Sala de Reuniones del Consejo",
                Tipo = "Sala de Reuniones",
                Capacidad = 18,
                Ubicacion = "Pabellón A - Tercer Piso",
                Estado = "Disponible",
                FechaCreacion = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Ambiente
            {
                Id = labRobId,
                Nombre = "Laboratorio Especializado de Robótica",
                Tipo = "Laboratorio Especializado",
                Capacidad = 25,
                Ubicacion = "Pabellón C - Primer Piso",
                Estado = "Disponible",
                FechaCreacion = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc)
            }
        );

        var res1Id = Guid.Parse("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee");
        var res2Id = Guid.Parse("ffffffff-ffff-ffff-ffff-ffffffffffff");

        modelBuilder.Entity<Reserva>().HasData(
            new Reserva
            {
                Id = res1Id,
                Fecha = new DateOnly(2026, 11, 10),
                HoraInicio = new TimeSpan(8, 0, 0),
                HoraFin = new TimeSpan(10, 0, 0),
                Motivo = "Práctica calificada de Construcción de Software",
                Estado = "Aprobada",
                ObservacionAdmin = "Aprobado por jefatura de laboratorio",
                UsuarioId = solicitanteId,
                AmbienteId = lab1Id,
                FechaRegistro = new DateTime(2026, 11, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Reserva
            {
                Id = res2Id,
                Fecha = new DateOnly(2026, 11, 12),
                HoraInicio = new TimeSpan(14, 0, 0),
                HoraFin = new TimeSpan(17, 0, 0),
                Motivo = "Seminario de Inteligencia Artificial y Cloud",
                Estado = "Pendiente",
                ObservacionAdmin = null,
                UsuarioId = solicitanteId,
                AmbienteId = audId,
                FechaRegistro = new DateTime(2026, 11, 2, 0, 0, 0, DateTimeKind.Utc)
            }
        );
    }
}
