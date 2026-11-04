# PortalUpla — Sistema de Reserva de Ambientes Universitarios

Sistema institucional de reserva, auditoría y control de concurrencia de ambientes académicos para la **Universidad Peruana Los Andes (UPLA)**.

Desarrollado bajo **Clean Architecture** en **.NET 8 Web API** y **React + Vite + Tailwind CSS**, garantizando transacciones seguras con nivel de aislamiento `Serializable` en **PostgreSQL**, autenticación por cookies `HttpOnly`, y cumplimiento de estándares de accesibilidad e interfaces de usuario (ISO 9241-11, Heurísticas de Nielsen y Reglas de Shneiderman).

---

## 📋 Requisitos del Sistema

- **.NET SDK**: Versión 8.0 o superior (`dotnet --version`)
- **Node.js**: Versión 18.x o 20.x LTS y npm (`node -v`, `npm -v`)
- **PostgreSQL**: Versión 14, 15 o 16 en ejecución en el puerto local `5432`
- **Herramienta dotnet-ef** (opcional para migraciones): `dotnet tool install --global dotnet-ef`

---

## ⚙️ Configuración y Cadena de Conexión

### Opción A: Usando .NET User-Secrets (Recomendado para desarrollo)

Desde la carpeta del proyecto de API (`backend/ReservaUPLA.API`):

```bash
cd backend/ReservaUPLA.API

# Inicializar y configurar cadena de conexión
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;Port=5432;Database=ReservaUPLADB;Username=postgres;Password=TU_PASSWORD_LOCAL;"

# Opcional: configurar credenciales del Seeder (toma valores por defecto en Development)
dotnet user-secrets set "Seeder:AdminPassword" "Admin123*UPLA"
dotnet user-secrets set "Seeder:UserPassword" "Usuario123*UPLA"
```

### Opción B: Usando `appsettings.Development.json`

Copiar la plantilla de ejemplo y completar la contraseña local:

```bash
cp backend/ReservaUPLA.API/appsettings.Development.example.json backend/ReservaUPLA.API/appsettings.Development.json
```

Editar `backend/ReservaUPLA.API/appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=ReservaUPLADB;Username=postgres;Password=TU_PASSWORD_AQUI;"
  },
  "Seeder": {
    "AdminPassword": "Admin123*UPLA",
    "UserPassword": "Usuario123*UPLA"
  }
}
```

---

## 🗄️ Base de Datos y Migraciones

### Opción 1: Aplicar migraciones mediante EF Core

```bash
cd backend/ReservaUPLA.API
dotnet ef database update --project ../ReservaUPLA.Infrastructure
```

### Opción 2: Restaurar desde el volcado SQL completo (`database.sql`)

El repositorio incluye en su raíz el archivo `database.sql` con el esquema completo y datos sembrados:

```bash
# Crear base de datos en PostgreSQL
psql -U postgres -d postgres -c "CREATE DATABASE \"ReservaUPLADB\";"

# Restaurar esquema y datos UTF-8
psql -U postgres -d ReservaUPLADB -f database.sql
```

---

## 🚀 Ejecución del Sistema

### 1. Iniciar Backend (.NET 8 Web API)

```bash
cd backend/ReservaUPLA.API
dotnet run
```

- **API URL**: `http://localhost:5159`
- **Swagger UI**: `http://localhost:5159/swagger`

### 2. Iniciar Frontend (React + Vite)

En una nueva terminal:

```bash
cd frontend
npm install
npm run dev
```

- **Aplicación Web**: `http://localhost:5173`

---

## 🧪 Ejecución de Pruebas Automatizadas

### Pruebas Unitarias del Backend (xUnit)

```bash
dotnet test backend/ReservaUPLA.Tests/ReservaUPLA.Tests.csproj
```

### Pruebas Unitarias del Frontend (Vitest)

```bash
npm test --prefix frontend -- --run
```

---

## 👥 Cuentas de Prueba del Seeder

| Rol | Nombre | Correo Institucional | Contraseña | Ambientes Asignados |
| :--- | :--- | :--- | :--- | :--- |
| **Administrador** | Administrador Central | `admin@upla.edu.pe` | `Admin123*UPLA` | Control total del sistema |
| **Responsable** | Roberto Salazar Mendoza | `responsable@upla.edu.pe` | `Usuario123*UPLA` | Laboratorio 101, Auditorio Magno, Redes Cisco |
| **Responsable** | Maria Quispe Condori | `maria.quispe@upla.edu.pe` | `Usuario123*UPLA` | Sala de Grados, Robótica e IA, Realidad Virtual |
| **Solicitante** | Carmen Flores Quispe | `solicitante@upla.edu.pe` | `Usuario123*UPLA` | Usuario solicitante docente |
| **Solicitante** | Juan Perez Huaman | `juan.perez@upla.edu.pe` | `Usuario123*UPLA` | Usuario solicitante docente |
| **Solicitante** | Ana Torres Rojas | `ana.torres@upla.edu.pe` | `Usuario123*UPLA` | Usuario solicitante docente |
| **Solicitante** | David Castro Morales | `david.castro@upla.edu.pe` | `Usuario123*UPLA` | Usuario solicitante docente |

---

## 📁 Estructura del Repositorio

```
ReservaUPLA/
├── database.sql                     # Script relacional PostgreSQL (esquema + seeder UTF-8)
├── README.md                        # Documentación general y guía de puesta en marcha
├── backend/
│   ├── ReservaUPLA.Domain/          # Núcleo: Entidades, Value Objects, Enums, Reglas y Excepciones
│   ├── ReservaUPLA.Application/     # Casos de uso: DTOs, Mappers, Interfaces y Servicios
│   ├── ReservaUPLA.Infrastructure/  # Persistencia EF Core, PostgreSQL, Repositorios, Criptografía PBKDF2
│   ├── ReservaUPLA.API/             # Controllers REST, Middleware de errores, Cookies, Rate Limiting
│   └── ReservaUPLA.Tests/           # Suite de pruebas unitarias backend (xUnit, Moq, FluentAssertions)
└── frontend/
    ├── src/
    │   ├── components/              # Componentes visuales y accesibles (Botones, Modales, Tablas)
    │   ├── pages/                   # Vistas principales (Login, Dashboard, Ambientes, Reservas)
    │   ├── hooks/                   # Lógica reactiva encapsulada (useAuth, useAmbientes, etc.)
    │   ├── services/                # Clientes API REST asíncronos
    │   ├── utils/                   # Utilidades de normalización, fecha y formateo
    │   ├── validation/              # Validaciones client-side (ISO 9241-11)
    │   └── constants/               # Constantes y mensajes en lenguaje comprensible
    └── package.json                 # Dependencias y scripts de frontend
```

---

## 📦 Cómo empaquetar el proyecto

Para generar el entregable en archivo comprimido `.zip` excluyendo carpetas transitorias de compilación (`bin/`, `obj/`, `node_modules/`, `dist/`, `.vs/`) pero preservando el código fuente y `database.sql`:

### Opción 1: Mediante Git Archive (Recomendado)

```bash
git archive --format=zip -o ReservaUPLA.zip HEAD
```

### Opción 2: Mediante PowerShell

```powershell
$destino = "ReservaUPLA_Entrega.zip"
Get-ChildItem -Path . -Recurse | Where-Object {
    $_.FullName -notmatch '\\(bin|obj|node_modules|dist|\.vs|\.git|capturas_informe)\\' -and
    $_.FullName -notmatch '\\(bin|obj|node_modules|dist|\.vs|\.git|capturas_informe)$'
} | Compress-Archive -DestinationPath $destino -Force
```
