namespace ReservaUPLA.Domain.Entities;

public class Reserva
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateOnly Fecha { get; set; }
    public TimeSpan HoraInicio { get; set; }
    public TimeSpan HoraFin { get; set; }
    public string Motivo { get; set; } = string.Empty;
    public string Estado { get; set; } = "Pendiente"; // Pendiente, Aprobada, Rechazada, Cancelada
    public string? ObservacionAdmin { get; set; }
    public DateTime FechaRegistro { get; set; } = DateTime.UtcNow;

    public Guid UsuarioId { get; set; }
    public Usuario? Usuario { get; set; }

    public Guid AmbienteId { get; set; }
    public Ambiente? Ambiente { get; set; }
}
