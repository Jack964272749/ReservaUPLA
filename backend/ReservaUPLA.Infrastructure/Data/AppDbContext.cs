using Microsoft.EntityFrameworkCore;
using ReservaUpla.Domain.Entities;
using ReservaUpla.Domain.Enums;

namespace ReservaUpla.Infrastructure.Data;

// Trazabilidad: POO · Mapeo estricto snake_case en PostgreSQL con HasColumnName/ToTable
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

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.ToTable("usuarios");
            entity.HasKey(u => u.Id_Usuario);
            entity.Property(u => u.Id_Usuario).HasColumnName("id_usuario");
            entity.Property(u => u.Nom_Usuario).HasColumnName("nom_usuario").IsRequired().HasMaxLength(150);
            entity.Property(u => u.Cod_Usuario).HasColumnName("cod_usuario").HasMaxLength(50).IsRequired(false);
            entity.Property(u => u.Cor_Usuario).HasColumnName("cor_usuario").IsRequired().HasMaxLength(150);
            entity.HasIndex(u => u.Cor_Usuario).IsUnique();
            entity.Property(u => u.Has_Usuario).HasColumnName("has_usuario").IsRequired();
            entity.Property(u => u.Rol_Usuario).HasColumnName("rol_usuario").HasConversion<string>().HasMaxLength(50);
            entity.Property(u => u.Act_Usuario).HasColumnName("act_usuario").IsRequired();
        });

        modelBuilder.Entity<Ambiente>(entity =>
        {
            entity.ToTable("ambientes");
            entity.HasKey(a => a.Id_Ambiente);
            entity.Property(a => a.Id_Ambiente).HasColumnName("id_ambiente");
            entity.Property(a => a.Nom_Ambiente).HasColumnName("nom_ambiente").IsRequired().HasMaxLength(100);
            entity.Property(a => a.Tip_Ambiente).HasColumnName("tip_ambiente").HasConversion<string>().HasMaxLength(50);
            entity.Property(a => a.Cap_Ambiente).HasColumnName("cap_ambiente").IsRequired();
            entity.Property(a => a.Ubi_Ambiente).HasColumnName("ubi_ambiente").IsRequired().HasMaxLength(100);
            entity.Property(a => a.Est_Ambiente).HasColumnName("est_ambiente").HasConversion<string>().HasMaxLength(30);
            entity.Property(a => a.Idr_Ambiente).HasColumnName("idr_ambiente");

            entity.HasOne(a => a.Responsable)
                .WithMany(u => u.AmbientesACargo)
                .HasForeignKey(a => a.Idr_Ambiente)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Reserva>(entity =>
        {
            entity.ToTable("reservas");
            entity.HasKey(r => r.Id_Reserva);
            entity.Property(r => r.Id_Reserva).HasColumnName("id_reserva");
            entity.Property(r => r.Fec_Reserva).HasColumnName("fec_reserva").HasColumnType("date").IsRequired();
            entity.Property(r => r.Hin_Reserva).HasColumnName("hin_reserva").HasColumnType("interval").IsRequired();
            entity.Property(r => r.Hfi_Reserva).HasColumnName("hfi_reserva").HasColumnType("interval").IsRequired();
            entity.Property(r => r.Mot_Reserva).HasColumnName("mot_reserva").HasColumnType("text").IsRequired();
            entity.Property(r => r.Est_Reserva).HasColumnName("est_reserva").HasConversion<string>().HasMaxLength(30);
            entity.Property(r => r.Idu_Reserva).HasColumnName("idu_reserva").IsRequired();
            entity.Property(r => r.Ida_Reserva).HasColumnName("ida_reserva").IsRequired();
            entity.Property(r => r.Fre_Reserva).HasColumnName("fre_reserva").HasColumnType("timestamp with time zone").IsRequired();

            entity.HasOne(r => r.Usuario)
                .WithMany(u => u.Reservas)
                .HasForeignKey(r => r.Idu_Reserva)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(r => r.Ambiente)
                .WithMany(a => a.Reservas)
                .HasForeignKey(r => r.Ida_Reserva)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(r => new { r.Ida_Reserva, r.Fec_Reserva, r.Est_Reserva });
        });
    }
}
