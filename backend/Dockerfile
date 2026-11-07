# Etapa 1: Compilacion y restauracion de dependencias
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar el codigo fuente completo del backend
COPY . .

# Restaurar y compilar la API institucional en modo Release
WORKDIR "/src/ReservaUPLA.API"
RUN dotnet restore "ReservaUPLA.API.csproj"
RUN dotnet publish "ReservaUPLA.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Etapa 2: Imagen final optimizada de produccion
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Render asigna y expone el puerto 8080
ENV PORT=8080
ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "ReservaUPLA.API.dll"]
