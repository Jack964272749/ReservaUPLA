namespace ReservaUpla.Application.Interfaces;

// Trazabilidad: Zona Horaria · Manejo de tiempo institucional Lima (UTC-5)
public interface IRelojService
{
    DateOnly HoyLima();
}
