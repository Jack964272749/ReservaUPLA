namespace ReservaUpla.Application.Interfaces;

// Trazabilidad: Seguridad · Hash de contraseñas con mitigación de timing attack (E-08)
public interface IPasswordHasherService
{
    string Hash(string password);
    bool Verify(string hash, string password);
    void VerifyDummy();
}
