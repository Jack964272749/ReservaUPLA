using ReservaUpla.Domain.Constants;
using ReservaUpla.Domain.Enums;
using ReservaUpla.Domain.Exceptions;

namespace ReservaUpla.Domain.Entities;

// Trazabilidad: POO - Encapsulamiento · Prefijos 3 letras · Convención de nomenclatura
public class Usuario
{
    public Guid Id_Usuario { get; private set; }
    public string Nom_Usuario { get; private set; } = string.Empty;
    public string? Cod_Usuario { get; private set; }
    public string Cor_Usuario { get; private set; } = string.Empty;
    public string Has_Usuario { get; private set; } = string.Empty;
    public RolUsuario Rol_Usuario { get; private set; }
    public bool Act_Usuario { get; private set; }

    public ICollection<Reserva> Reservas { get; private set; } = new List<Reserva>();
    public ICollection<Ambiente> AmbientesACargo { get; private set; } = new List<Ambiente>();

    private Usuario() { }

    // Trazabilidad: Nielsen H5 - Prevención de errores · Factory estática con validaciones
    public static Usuario Crear(
        string nombre,
        string correo,
        string hash,
        RolUsuario rol = RolUsuario.Solicitante,
        string? codigo = null,
        bool activo = true)
    {
        var nomNorm = ReglasUsuario.NormalizarNombre(nombre);
        var corNorm = ReglasUsuario.NormalizarCorreo(correo);

        if (string.IsNullOrWhiteSpace(nomNorm))
            throw new DomainException(Mensajes.NombreRequerido);
        if (nomNorm.Length < ReglasUsuario.MinLongitudNombre || nomNorm.Length > ReglasUsuario.MaxLongitudNombre)
            throw new DomainException(Mensajes.NombreLongitud);
        if (!ReglasUsuario.RegexNombreValido.IsMatch(nomNorm))
            throw new DomainException(Mensajes.NombreInvalido);

        if (string.IsNullOrWhiteSpace(corNorm))
            throw new DomainException(Mensajes.CorreoRequerido);
        if (!ReglasUsuario.RegexCorreoValido.IsMatch(corNorm))
            throw new DomainException(Mensajes.CorreoInvalido);

        if (string.IsNullOrWhiteSpace(hash))
            throw new DomainException(Mensajes.ClaveRequerida);

        var codNorm = string.IsNullOrWhiteSpace(codigo) ? null : codigo.Trim().ToUpperInvariant();

        return new Usuario
        {
            Id_Usuario = Guid.NewGuid(),
            Nom_Usuario = nomNorm,
            Cod_Usuario = codNorm,
            Cor_Usuario = corNorm,
            Has_Usuario = hash,
            Rol_Usuario = rol,
            Act_Usuario = activo
        };
    }

    // Trazabilidad: RF-01 · Actualización de perfil administrativo
    public void Actualizar(string nombre, RolUsuario rol, bool activo, string? codigo = null)
    {
        var nomNorm = ReglasUsuario.NormalizarNombre(nombre);

        if (string.IsNullOrWhiteSpace(nomNorm))
            throw new DomainException(Mensajes.NombreRequerido);
        if (nomNorm.Length < ReglasUsuario.MinLongitudNombre || nomNorm.Length > ReglasUsuario.MaxLongitudNombre)
            throw new DomainException(Mensajes.NombreLongitud);
        if (!ReglasUsuario.RegexNombreValido.IsMatch(nomNorm))
            throw new DomainException(Mensajes.NombreInvalido);

        Nom_Usuario = nomNorm;
        Rol_Usuario = rol;
        Act_Usuario = activo;
        if (!string.IsNullOrWhiteSpace(codigo))
        {
            Cod_Usuario = codigo.Trim().ToUpperInvariant();
        }
    }

    // Trazabilidad: Seguridad · Actualización segura de credencial hasheada
    public void ActualizarClave(string nuevoHash)
    {
        if (string.IsNullOrWhiteSpace(nuevoHash))
            throw new DomainException(Mensajes.ClaveRequerida);
        Has_Usuario = nuevoHash;
    }

    // Trazabilidad: RF-01 · Activación y desactivación de cuenta
    public void CambiarEstado(bool activo)
    {
        Act_Usuario = activo;
    }
}
