using ReservaUpla.Domain.Constants;
using ReservaUpla.Domain.Enums;
using ReservaUpla.Domain.Exceptions;

namespace ReservaUpla.Domain.Entities;

// Trazabilidad: POO - Encapsulamiento · Reglas RN-01 a RN-06 (RF-03, RF-07)
public class Reserva
{
    public Guid Id_Reserva { get; private set; }
    public DateOnly Fec_Reserva { get; private set; }
    public TimeSpan Hin_Reserva { get; private set; }
    public TimeSpan Hfi_Reserva { get; private set; }
    public string Mot_Reserva { get; private set; } = string.Empty;
    public EstadoReserva Est_Reserva { get; private set; }
    public Guid Idu_Reserva { get; private set; }
    public Guid Ida_Reserva { get; private set; }
    public DateTime Fre_Reserva { get; private set; }

    public Usuario? Usuario { get; private set; }
    public Ambiente? Ambiente { get; private set; }

    private Reserva() { }

    public static Reserva Crear(
        DateOnly fecha,
        TimeSpan horaInicio,
        TimeSpan horaFin,
        string motivo,
        Guid idUsuario,
        Guid idAmbiente)
    {
        // RN-02: Campos obligatorios
        if (idUsuario == Guid.Empty || idAmbiente == Guid.Empty)
            throw new DomainException("El solicitante y el ambiente son obligatorios (RN-02).");

        var mot = motivo?.Trim() ?? string.Empty;
        if (string.IsNullOrWhiteSpace(mot) || mot.Length < ReglasReserva.MinLongitudMotivo || mot.Length > ReglasReserva.MaxLongitudMotivo)
            throw new DomainException(Mensajes.MotivoLongitud);

        // RN-03: Fin > Inicio
        if (horaFin <= horaInicio)
            throw new DomainException(Mensajes.HoraFinMenorIgual);

        // RN-04: Horario permitido 07:00 a 22:00
        if (horaInicio < ReglasReserva.HoraApertura || horaFin > ReglasReserva.HoraCierre)
            throw new DomainException(Mensajes.HorarioFueraRango);

        return new Reserva
        {
            Id_Reserva = Guid.NewGuid(),
            Fec_Reserva = fecha,
            Hin_Reserva = horaInicio,
            Hfi_Reserva = horaFin,
            Mot_Reserva = mot,
            Est_Reserva = EstadoReserva.Pendiente,
            Idu_Reserva = idUsuario,
            Ida_Reserva = idAmbiente,
            Fre_Reserva = DateTime.UtcNow
        };
    }

    // Trazabilidad: RN-05, RN-06 · Shneiderman 6 (Reversibilidad)
    public void CambiarEstado(EstadoReserva nuevoEstado, RolUsuario rolActor, Guid idActor)
    {
        // RN-06: Una reserva rechazada no se modifica
        if (Est_Reserva == EstadoReserva.Rechazada)
            throw new DomainException(Mensajes.ReservaRechazadaInmodificable, 409);

        // Cancelada es estado final
        if (Est_Reserva == EstadoReserva.Cancelada)
            throw new DomainException("Una reserva ya cancelada no puede reactivarse.", 409);

        if (nuevoEstado == Est_Reserva)
            return;

        if (nuevoEstado == EstadoReserva.Aprobada || nuevoEstado == EstadoReserva.Rechazada)
        {
            // RN-05: Solo Administrador aprueba o rechaza
            if (rolActor != RolUsuario.Administrador)
                throw new DomainException(Mensajes.SoloAdminApruebaRechaza, 403);

            if (Est_Reserva != EstadoReserva.Pendiente)
                throw new DomainException(Mensajes.TransicionEstadoInvalida, 409);
        }
        else if (nuevoEstado == EstadoReserva.Cancelada)
        {
            // RV-17: Solicitante solo cancela su propia reserva
            if (rolActor == RolUsuario.Solicitante && idActor != Idu_Reserva)
                throw new DomainException(Mensajes.SolicitanteSoloCancelaPropia, 403);

            if (Est_Reserva != EstadoReserva.Pendiente && Est_Reserva != EstadoReserva.Aprobada)
                throw new DomainException(Mensajes.TransicionEstadoInvalida, 409);
        }
        else
        {
            throw new DomainException(Mensajes.TransicionEstadoInvalida, 409);
        }

        Est_Reserva = nuevoEstado;
    }
}
