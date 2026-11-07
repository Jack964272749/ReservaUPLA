# Etapa 1: Compilacion y restauracion de dependencias
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar archivos de proyecto por separado para aprovechar la cache de Docker
COPY ["ReservaUPLA.API/ReservaUPLA.API.csproj", "ReservaUPLA.API/"]
COPY ["ReservaUPLA.Application/ReservaUPLA.Application.csproj", "ReservaUPLA.Application/"]
COPY ["ReservaUPLA.Domain/ReservaUPLA.Domain.csproj", "ReservaUPLA.Domain/"]
COPY ["ReservaUPLA.Infrastructure/ReservaUPLA.Infrastructure.csproj", "ReservaUPLA.Infrastructure/"]

RUN dotnet restore "ReservaUPLA.API/ReservaUPLA.API.csproj"

# Copiar el codigo fuente completo
COPY . .

# Compilar en modo Release
WORKDIR "/src/ReservaUPLA.API"
RUN dotnet publish "ReservaUPLA.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Etapa 2: Imagen final optimizada de produccion
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Render asigna y expone el puerto automaticamente
ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "ReservaUPLA.API.dll"]
