using ReservaUpla.Domain.Constants;
using ReservaUpla.Domain.Enums;
using ReservaUpla.Domain.Exceptions;

namespace ReservaUpla.Domain.Entities;

// Trazabilidad: POO - Encapsulamiento · Prefijos 3 letras (RF-02)
public class Ambiente
{
    public Guid Id_Ambiente { get; private set; }
    public string Nom_Ambiente { get; private set; } = string.Empty;
    public TipAmbiente Tip_Ambiente { get; private set; }
    public int Cap_Ambiente { get; private set; }
    public string Ubi_Ambiente { get; private set; } = string.Empty;
    public EstAmbiente Est_Ambiente { get; private set; }
    public Guid? Idr_Ambiente { get; private set; }

    public Usuario? Responsable { get; private set; }
    public ICollection<Reserva> Reservas { get; private set; } = new List<Reserva>();

    private Ambiente() { }

    public static Ambiente Crear(
        string nombre,
        TipAmbiente tipo,
        int capacidad,
        string ubicacion,
        Guid? idResponsable = null,
        EstAmbiente estado = EstAmbiente.Disponible)
    {
        var nom = nombre?.Trim() ?? string.Empty;
        var ubi = ubicacion?.Trim() ?? string.Empty;

        if (string.IsNullOrWhiteSpace(nom))
            throw new DomainException(Mensajes.NombreAmbienteRequerido);
        if (nom.Length < ReglasAmbiente.MinLongitudNombre || nom.Length > ReglasAmbiente.MaxLongitudNombre)
            throw new DomainException(Mensajes.NombreAmbienteLongitud);

        if (capacidad < ReglasAmbiente.MinCapacidad || capacidad > ReglasAmbiente.MaxCapacidad)
            throw new DomainException(Mensajes.CapacidadInvalida);

        if (string.IsNullOrWhiteSpace(ubi))
            throw new DomainException(Mensajes.UbicacionRequerida);
        if (ubi.Length > ReglasAmbiente.MaxLongitudUbicacion)
            throw new DomainException(Mensajes.UbicacionLongitud);

        return new Ambiente
        {
            Id_Ambiente = Guid.NewGuid(),
            Nom_Ambiente = nom,
            Tip_Ambiente = tipo,
            Cap_Ambiente = capacidad,
            Ubi_Ambiente = ubi,
            Est_Ambiente = estado,
            Idr_Ambiente = idResponsable
        };
    }

    public void AsignarResponsable(Guid? idResponsable)
    {
        Idr_Ambiente = idResponsable;
    }
}
