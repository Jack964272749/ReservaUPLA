using ReservaUpla.Application.DTOs;
using ReservaUpla.Domain.Entities;

namespace ReservaUpla.Application.Mappers;

public static class ReservaMapper
{
    public static ReservaDto ToDto(Reserva r) => new(
        r.Id_Reserva,
        r.Fec_Reserva,
        r.Hin_Reserva,
        r.Hfi_Reserva,
        r.Mot_Reserva,
        r.Est_Reserva.ToString(),
        r.Idu_Reserva,
        r.Usuario?.Nom_Usuario ?? string.Empty,
        r.Usuario?.Cor_Usuario ?? string.Empty,
        r.Ida_Reserva,
        r.Ambiente?.Nom_Ambiente ?? string.Empty,
        r.Ambiente?.Tip_Ambiente.ToString() ?? string.Empty,
        r.Ambiente?.Ubi_Ambiente ?? string.Empty,
        r.Fre_Reserva
    );
}
