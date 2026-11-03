using ReservaUpla.Application.DTOs;
using ReservaUpla.Domain.Entities;

namespace ReservaUpla.Application.Mappers;

public static class AmbienteMapper
{
    public static AmbienteDto ToDto(Ambiente a) => new(
        a.Id_Ambiente,
        a.Nom_Ambiente,
        a.Tip_Ambiente.ToString(),
        a.Cap_Ambiente,
        a.Ubi_Ambiente,
        a.Est_Ambiente.ToString(),
        a.Idr_Ambiente,
        a.Responsable?.Nom_Usuario
    );
}
