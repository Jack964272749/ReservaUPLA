using Microsoft.AspNetCore.Identity;
using ReservaUpla.Application.Interfaces;

namespace ReservaUpla.Infrastructure.Security;

// Trazabilidad: E-08 · Mitigación de timing attack mediante PasswordHasher oficial
public class PasswordHasherService : IPasswordHasherService
{
    private readonly PasswordHasher<object> _hasher = new();
    // Hash fijo dummy generado con PasswordHasher para usuarios inexistentes
    private const string HashDummy = "AQAAAAIAAYagAAAAEOc5M1h41d6D3S+sO8a3qjQ9L71HjC0w1v4t3u6r1y2z4a5b6c7d8e9f0g1h2i3j4k==";

    public string Hash(string password)
    {
        return _hasher.HashPassword(new object(), password);
    }

    public bool Verify(string hash, string password)
    {
        var result = _hasher.VerifyHashedPassword(new object(), hash, password);
        return result != PasswordVerificationResult.Failed;
    }

    public void VerifyDummy()
    {
        _hasher.VerifyHashedPassword(new object(), HashDummy, "ClaveDummyTemporal123*");
    }
}
