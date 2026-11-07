using ReservaUpla.API.Extensions;
using ReservaUpla.API.Middleware;
using ReservaUpla.Application.Interfaces;
using ReservaUpla.Infrastructure.Data;

var builder = WebApplication.CreateBuilder(args);

// Trazabilidad: POO - Composición con métodos de extensión
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "ReservaUPLA Web API", Version = "v1" });
});

builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);
builder.Services.AddFrontendCors(builder.Configuration);
builder.Services.AddAuthCookie(builder.Environment);
builder.Services.AddRateLimitingPolicy();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var hasher = scope.ServiceProvider.GetRequiredService<IPasswordHasherService>();
    try
    {
        await DatabaseSeeder.InicializarAsync(context, hasher, builder.Configuration, builder.Environment.IsDevelopment());
    }
    catch (Exception ex)
    {
        app.Logger.LogWarning("Inicialización BD: {Message}", ex.Message);
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseCors("FrontendPolicy");
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
