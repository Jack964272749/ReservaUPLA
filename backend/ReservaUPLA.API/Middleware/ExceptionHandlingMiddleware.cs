using System.Text.Json;
using ReservaUpla.Domain.Exceptions;

namespace ReservaUpla.API.Middleware;

// Trazabilidad: Shneiderman 5 · Errores no técnicos hacia el cliente (E-24)
public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (DomainException ex)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = ex.CodigoEstadoHttp;
            var json = JsonSerializer.Serialize(new { mensaje = ex.Message });
            await context.Response.WriteAsync(json);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error interno no controlado");
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            var json = JsonSerializer.Serialize(new
            {
                mensaje = "Ha ocurrido un error interno en el servidor. Por favor intente más tarde (E-24)."
            });
            await context.Response.WriteAsync(json);
        }
    }
}
