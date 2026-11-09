using ReservaUpla.Application.DTOs;
using ReservaUpla.Domain.Entities;

namespace ReservaUpla.Application.Mappers;

// Trazabilidad: POO - Responsabilidad Única · Mapeo DTO ↔ Entidad
public static class UsuarioMapper
{
    public static UsuarioDto ToDto(Usuario u) => new(
        u.Id_Usuario,
        u.Nom_Usuario,
        u.Cor_Usuario,
        u.Rol_Usuario.ToString(),
        u.Act_Usuario,
        u.Cod_Usuario
    );
}
