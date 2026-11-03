namespace ReservaUPLA.Domain.Entities;

public class Ambiente
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Nombre { get; set; } = string.Empty;
    public string Tipo { get; set; } = string.Empty; // Laboratorio de Cómputo, Auditorio, Sala de Reuniones, Laboratorio Especializado
    public int Capacidad { get; set; }
    public string Ubicacion { get; set; } = string.Empty;
    public string Estado { get; set; } = "Disponible"; // Disponible, Mantenimiento, Inactivo
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;

    public ICollection<Reserva> Reservas { get; set; } = new List<Reserva>();
}
