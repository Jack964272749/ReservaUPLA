# ReservaUPLA — Sistema de Reserva de Ambientes Universitarios

Sistema institucional de reserva, auditoría y control de concurrencia de ambientes académicos para la **Universidad Peruana Los Andes (UPLA)**.

Desarrollado bajo **Clean Architecture** en **.NET 8 Web API** y **React + Vite + Tailwind CSS**, garantizando transacciones seguras con nivel de aislamiento `Serializable` en **PostgreSQL**, autenticación por cookies `HttpOnly`, y cumplimiento de estándares de accesibilidad e interfaces de usuario (ISO 9241-11, Heurísticas de Nielsen y Reglas de Shneiderman).

---

## Demo en Línea (Frontend)

El frontend de la aplicación se encuentra publicado en GitHub Pages:  
🌐 **[https://jack964272749.github.io/ReservaUPLA/](https://jack964272749.github.io/ReservaUPLA/)**

---

## Requisitos del Sistema

- **.NET SDK**: Versión 8.0 o superior (`dotnet --version`)
- **Node.js**: Versión 18.x o 20.x LTS y npm (`node -v`, `npm -v`)
- **PostgreSQL**: Versión 14, 15 o 16 en ejecución en el puerto local `5432`
- **Herramienta dotnet-ef** (opcional para migraciones): `dotnet tool install --global dotnet-ef`

---

## Configuración y Cadena de Conexión

### Opción A: Usando .NET User-Secrets (Recomendado para desarrollo)

Desde la carpeta del proyecto de API (`backend/ReservaUPLA.API`):

```bash
cd backend/ReservaUPLA.API

# Inicializar y configurar cadena de conexión
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;Port=5432;Database=ReservaUPLADB;Username=postgres;Password=TU_PASSWORD_LOCAL;"

# Configurar credenciales seguras del Seeder
dotnet user-secrets set "Seeder:AdminPassword" "<TU_PASSWORD_ADMIN_SEGURO>"
dotnet user-secrets set "Seeder:RespPassword" "<TU_PASSWORD_RESPONSABLE_SEGURO>"
dotnet user-secrets set "Seeder:SolicPassword" "<TU_PASSWORD_SOLICITANTE_SEGURO>"
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
    "AdminPassword": "<TU_PASSWORD_ADMIN_SEGURO>",
    "RespPassword": "<TU_PASSWORD_RESPONSABLE_SEGURO>",
    "SolicPassword": "<TU_PASSWORD_SOLICITANTE_SEGURO>"
  }
}
```

---

## Base de Datos y Migraciones

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

## Ejecución del Sistema

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

## Ejecución de Pruebas Automatizadas

### Pruebas Unitarias del Backend (xUnit)

```bash
dotnet test backend/ReservaUPLA.Tests/ReservaUPLA.Tests.csproj
```

### Pruebas Unitarias del Frontend (Vitest)

```bash
npm test --prefix frontend -- --run
```

---

## Cuentas Sembradas del Sistema

Las cuentas institucionales se crean únicamente cuando la tabla de usuarios se encuentra vacía, utilizando las contraseñas definidas en la configuración (`Seeder:*`: user-secrets en local, variables de entorno en Render). En entorno **Development**, si no se configuran, el sembrador genera contraseñas aleatorias seguras (16+ caracteres) y las imprime por consola una sola vez.

| Rol | Nombre | Correo Institucional | Ambientes Asignados |
| :--- | :--- | :--- | :--- |
| **Administrador** | Administrador Central | `admin@upla.edu.pe` | Control total del sistema |
| **Responsable** | Roberto Salazar Mendoza | `responsable@upla.edu.pe` | Laboratorio 101, Auditorio Magno, Redes Cisco |
| **Responsable** | Maria Quispe Condori | `maria.quispe@upla.edu.pe` | Sala de Grados, Robótica e IA, Realidad Virtual |
| **Responsable** | Carlos Benites Vega | `carlos.benites@upla.edu.pe` | Aula Magna de Medicina, Sala de Reuniones |
| **Solicitante** | Carmen Flores Quispe | `solicitante@upla.edu.pe` | Usuario solicitante docente |
| **Solicitante** | Juan Perez Huaman | `juan.perez@upla.edu.pe` | Usuario solicitante docente |
| **Solicitante** | Ana Torres Rojas | `ana.torres@upla.edu.pe` | Usuario solicitante docente |
| **Solicitante** | David Castro Morales | `david.castro@upla.edu.pe` | Usuario solicitante docente |
| **Solicitante** | Elena Morales Ramos | `elena.morales@upla.edu.pe` | Usuario solicitante docente |

---

## Estructura del Repositorio

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

---

## Despliegue en Producción

### Arquitectura de Despliegue
El sistema se encuentra desplegado en la nube bajo una arquitectura distribuida:
- **Frontend**: Hospedado en **GitHub Pages** como Single Page Application (SPA) construida con Vite, automatizada mediante el flujo de CI/CD en `.github/workflows/deploy-pages.yml`.
- **Backend**: Hospedado en **Render Web Service** ejecutando un contenedor Docker multi-etapa con **.NET 8 Web API** expuesto en el puerto `8080`.
- **Base de Datos**: Instancia de **PostgreSQL gestionada en Render**, aprovisionada mediante Blueprint (`render.yaml`).

### Variables de Entorno Requeridas

#### 1. Configuración en Render (Web Service)
Configuradas a través del panel de Render o mediante `render.yaml` (`sync: false` para credenciales sensibles):
- `DATABASE_URL`: Cadena de conexión inyectada automáticamente desde la base de datos PostgreSQL gestionada de Render.
- `Cors__FrontendUrl`: URL de origen del frontend autorizada para peticiones con credenciales (`https://jack964272749.github.io`).
- `Seeder__AdminPassword`: Contraseña inicial para el usuario Administrador del sistema.
- `Seeder__RespPassword`: Contraseña inicial para los usuarios con rol Responsable.
- `Seeder__SolicPassword`: Contraseña inicial para los usuarios con rol Solicitante.

#### 2. Configuración en GitHub (Repositorio)
En **Settings → Secrets and variables → Actions → Variables** (como variable de entorno en texto plano):
- `VITE_API_URL`: URL base de la API backend en Render con terminación `/api` (ejemplo: `https://reservaupla-api.onrender.com/api`).

#### 3. Configuración de GitHub Pages
En **Settings → Pages**:
- **Build and deployment → Source**: Debe seleccionarse **GitHub Actions** (NO "Deploy from a branch"), permitiendo que el workflow compile y publique automáticamente el artefacto con Vite.

### Advertencias Técnicas Importantes

1. **Latencia de inicio en frío (Cold Start) en Render**:  
   En el plan gratuito de Render, el contenedor web entra en modo de suspensión tras 15 minutos continuos de inactividad. La primera petición HTTP entrante puede tardar entre **50 y 90 segundos** mientras se descarga la imagen e inicializa el runtime de .NET. Las peticiones subsecuentes responderán de forma inmediata.

2. **Expiración de la base de datos de Render**:  
   Las bases de datos PostgreSQL en el nivel gratuito de Render cuentan con un ciclo de vida limitado (caducidad típica a los 30 o 90 días según políticas del proveedor). Para evaluaciones académicas o demostraciones es fundamental comprobar que la instancia permanezca activa desde el panel de Render antes de iniciar la sustentación.

3. **Cookies cross-domain y políticas de privacidad en navegadores**:  
   La autenticación emplea cookies seguras con atributos `HttpOnly`, `SameSite=None` y `Secure` debido a que el frontend (`*.github.io`) y el backend (`*.onrender.com`) residen en dominios distintos. Navegadores o modos con bloqueo estricto de rastreo de terceros (Safari ITP, Brave Shields o ciertas ventanas en incógnito) pueden rechazar el almacenamiento de cookies cross-site, impidiendo la persistencia de la sesión. Se recomienda realizar las pruebas de demostración en un navegador estándar (Chrome/Edge/Firefox) o verificar los permisos de cookies en el navegador donde se realice la sustentación.

## Cómo empaquetar el proyecto

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
