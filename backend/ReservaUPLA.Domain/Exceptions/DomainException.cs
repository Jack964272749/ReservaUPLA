namespace ReservaUpla.Domain.Exceptions;

// Trazabilidad: Manejo desacoplado de errores de dominio (Clean Architecture)
public class DomainException : Exception
{
    public int CodigoEstadoHttp { get; }

    public DomainException(string mensaje, int codigoEstadoHttp = 400) : base(mensaje)
    {
        CodigoEstadoHttp = codigoEstadoHttp;
    }
}
