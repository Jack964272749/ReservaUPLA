# ReservaUPLA — Sistema de Gestión de Reservas de Ambientes Universitarios

<p align="center">
  <img src="LogoUpla.png" alt="Logo ReservaUPLA" width="140" />
</p>

Aplicación web para registrar, validar, aprobar, consultar y supervisar solicitudes de reserva de ambientes académicos (laboratorios de cómputo, laboratorios especializados, auditorios y salas de reuniones) en la **Universidad Peruana Los Andes (UPLA)**.

---

## 1. Problema que resuelve

La coordinación manual de laboratorios y auditorios universitarios genera cruces de horarios, falta de trazabilidad sobre quién autorizó cada uso y desconocimiento de la disponibilidad real por pabellón. **ReservaUPLA** centraliza el flujo completo desde la solicitud docente o estudiantil hasta la resolución administrativa, garantizando mediante transacciones serializables y reglas de dominio que nunca existan dos reservas aprobadas superpuestas para el mismo ambiente.

---

## 2. Funcionalidades (RF-01 a RF-08)

| Código | Funcionalidad | Descripción |
| :--- | :--- | :--- |
| **RF-01** | Registro y autenticación de usuarios | Autoregistro de solicitantes con correo institucional `@upla.edu.pe` e inicio de sesión por roles (Administrador, Responsable, Solicitante). |
| **RF-02** | Gestión de ambientes académicos | Catálogo de ambientes con nombre, tipo, capacidad, ubicación, responsable asignado y estado operativo (Disponible, Mantenimiento, Inactivo). |
| **RF-03** | Registro de solicitud de reserva | Creación de solicitudes indicando ambiente, fecha, hora de inicio, hora de fin y motivo académico (estado inicial Pendiente). |
| **RF-04** | Validación y consulta de disponibilidad | Verificación automática de disponibilidad por ambiente y fecha para impedir solapamientos horarios. |
| **RF-05** | Consulta y filtrado de reservas | Listado paginado con búsqueda por solicitante o ambiente, filtro por rango de fechas y pestañas por estado. |
| **RF-06** | Detalle de reserva | Vista detallada de la solicitud con información del ambiente, solicitante, horario, estado actual y alerta de posibles conflictos. |
| **RF-07** | Aprobación, rechazo y cancelación | Flujo de decisión con confirmación para aprobar o rechazar solicitudes (Administrador) y cancelación de solicitudes propias (Solicitante). |
| **RF-08** | Panel de indicadores (Dashboard) | Resumen operativo con total de reservas, pendientes, aprobadas, rechazadas, tasa de aprobación, ambiente más utilizado y reservas por día. |
| **Landing** | Portal institucional público | Portada pública en `/` con presentación del sistema, accesos directos a inicio de sesión y registro de solicitantes, flujo en 3 pasos, catálogo de ambientes y normativa institucional. |
| **Usuarios** | Gestión de usuarios (Exclusivo Administrador) | Listado con búsqueda por nombre/correo, filtros por rol y estado, alta con clave inicial, edición de nombre/rol y activación/desactivación lógica. |

---

## 3. Reglas de Negocio (RN-01 a RN-06)

| Código | Regla de Negocio | Implementación en el Sistema |
| :--- | :--- | :--- |
| **RN-01** | Sin cruces de horarios | No puede existir más de una reserva en estado Aprobada para el mismo ambiente en un rango de fecha y hora que se superponga (`Hin < HfiExistente && Hfi > HinExistente`). |
| **RN-02** | Datos obligatorios | Toda solicitud exige fecha, hora de inicio, hora de fin, motivo (entre 10 y 500 caracteres), ambiente válido y solicitante autenticado. |
| **RN-03** | Horario válido | La hora de fin debe ser estrictamente posterior a la hora de inicio (`HoraFin > HoraInicio`), sin permitir fechas pasadas. |
| **RN-04** | Horario de atención institucional | Las reservas solo pueden registrarse dentro de la franja horaria de 07:00 a 22:00 horas. |
| **RN-05** | Aprobación exclusiva | Únicamente el rol Administrador posee los permisos `reservas.aprobar` y `reservas.rechazar` para resolver solicitudes pendientes. |
| **RN-06** | Inmutabilidad de reservas cerradas | Una reserva en estado Rechazada o Cancelada constituye un estado final irreversible y no puede volver a modificarse. |

---

## 4. Stack Tecnológico

| Capa | Tecnología | Versión Exacta |
| :--- | :--- | :--- |
| **Backend (API & Dominio)** | .NET / ASP.NET Core Web API | 8.0 (`net8.0`) |
| **ORM y Proveedor BD** | Entity Framework Core / Npgsql | 8.0.11 |
| **Documentación OpenAPI** | Swashbuckle.AspNetCore (Swagger) | 6.6.2 |
| **Base de Datos** | PostgreSQL | 16 (puerto 5432, BD `ReservaUPLADB`) |
| **Frontend** | React + Vite | React 18.3.1 / 19 · Vite |
| **Enrutamiento y Estilos** | React / Tailwind CSS / Lucide React | Tailwind 3.4.3 · Lucide 0.460.0 |
| **Pruebas Automatizadas** | xUnit + Moq (Backend) / Vitest + Testing Library (Frontend) | xUnit 2.5.3 · Vitest · RTL |
| **Calidad y Accesibilidad** | ESLint + WCAG 2.1 AA | WCAG 2.1 AA |

---

## 5. Arquitectura del Proyecto

El backend implementa Clean Architecture dividida en 4 proyectos independientes, y el frontend sigue una arquitectura modular por responsabilidades:

```text
ReservaUPLA/
├── backend/
│   ├── ReservaUPLA.Domain/          # Entidades ricas, Enums, Excepciones, Constantes y Políticas RBAC
│   ├── ReservaUPLA.Application/     # Casos de uso (Services), DTOs, Mappers e Interfaces de repositorios
│   ├── ReservaUPLA.Infrastructure/  # AppDbContext (EF Core), Migraciones, Repositorios, Hasher y Seeder
│   └── ReservaUPLA.API/             # Controladores REST, Middlewares, Rate Limiting y Cookies HttpOnly
├── frontend/
│   ├── public/                      # Recursos públicos, imágenes de ambientes y fondos
│   └── src/
│       ├── components/              # Componentes UI accesibles, landing institucional, formularios, navegación
│       ├── constants/               # Reglas, estados, mensajes, permisos, rutas y normativa institucional
│       ├── context/                 # Contexto de autenticación y estado global
│       ├── hooks/                   # Hooks de sesión (useAuth), tema, animaciones y formularios
│       ├── pages/                   # Vistas: LandingPage, Login, Registro, Dashboard, Reservas, Ambientes, Usuarios
│       ├── services/                # Cliente HTTP y servicios REST por módulo
│       ├── utils/                   # Formateadores de fechas, horas, mapeo de imágenes y utilidades
│       └── setupTests.js            # Configuración de pruebas Vitest
├── database.sql                     # Script de volcado completo de la base de datos PostgreSQL
├── LogoUpla.png                     # Isotipo e imagen institucional UPLA
└── README.md                        # Documentación principal del proyecto
```

---

## 6. Cómo ejecutar con Docker (Recomendado)

1. Copie la plantilla de variables de entorno y asigne contraseñas locales en el archivo `.env`:
   ```bash
   cp .env.example .env
   ```
2. Edite `.env` reemplazando `<CONTRASENA_AQUI>` en `POSTGRES_PASSWORD` y `DB_APP_PASSWORD`.
3. Levante los 3 contenedores:
   ```bash
   docker compose up --build -d
   ```
4. Acceda a la aplicación en su navegador:
   - **Frontend Web:** `http://localhost:5173`
   - **API / Swagger UI:** `http://localhost:5159/swagger`

---

## 7. Cómo ejecutar sin Docker (Entorno Local)

### Requisitos previos
- **.NET 8 SDK** (8.0.x)
- **Node.js** (>= 20.x)
- **PostgreSQL** (>= 15) con una base de datos llamada `ReservaUPLADB`

### Paso 1: Configurar base de datos y secretos del Backend
1. Aplique las migraciones o restaure el esquema:
   ```bash
   dotnet ef database update --project backend/ReservaUPLA.Infrastructure --startup-project backend/ReservaUPLA.API
   ```
2. Inicie el servidor backend en el puerto 5159:
   ```bash
   dotnet run --project backend/ReservaUPLA.API --urls "http://localhost:5159"
   ```

### Paso 2: Iniciar el Frontend
En otra terminal, instale las dependencias y levante el servidor de desarrollo de Vite en el puerto 5173:
```bash
cd frontend
npm install
npm run dev
```
Abra `http://localhost:5173` en su navegador.

---

## 8. Cómo correr las pruebas automatizadas

Las suites de pruebas se ejecutan de manera automatizada:

- **Backend (xUnit):**
  ```bash
  dotnet test
  ```
- **Frontend (Vitest + Testing Library):**
  ```bash
  cd frontend
  npm test -- --run
  ```

---

## 9. Usuarios de Demostración

Al iniciar en entorno `Development` con la base de datos vacía, `DatabaseSeeder` registra automáticamente las cuentas de demostración:

| Rol en el Sistema | Correo Institucional | Alcance de Permisos |
| :--- | :--- | :--- |
| **Administrador** | `admin@upla.edu.pe` | Gestión completa de ambientes, aprobación/rechazo/cancelación de reservas, gestión de usuarios y panel global. |
| **Responsable** | `responsable@upla.edu.pe` | Supervisión de indicadores y reservas de los ambientes bajo su responsabilidad. |
| **Solicitante** | `solicitante@upla.edu.pe` | Creación de solicitudes de reserva, consulta de disponibilidad y cancelación de reservas propias. |

> **Nota de seguridad:** Por política de seguridad del repositorio, las contraseñas de prueba no se publican en este documento. Utilice los accesos directos de 1 clic para demostración disponibles en el formulario de inicio de sesión (`/login`).

### Endpoints de Gestión de Usuarios (Exclusivo Administrador)

| Método | Ruta | Descripción | Rol Requerido |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/usuarios` | Listado paginado con búsqueda por nombre/correo y filtros de rol y estado | Administrador |
| `POST` | `/api/usuarios/crear` | Alta administrativa de usuario (Responsable o Solicitante) con clave inicial | Administrador |
| `PUT` | `/api/usuarios/{id}` | Edición de nombre completo y rol (con validación de ambientes asignados) | Administrador |
| `PATCH` | `/api/usuarios/{id}/estado` | Activación o desactivación lógica de usuario | Administrador |

---

## 10. Seguridad

El proyecto aplica controles de seguridad en todas sus capas:
- **Cero secretos en el repositorio:** Cadenas de conexión inyectadas mediante variables de entorno o configuración local no versionada.
- **Principio de menor privilegio en BD:** Operaciones restringidas y consultas parametrizadas mediante Entity Framework Core y Npgsql.
- **Autenticación y sesión segura:** Hash de contraseñas con PBKDF2 HMAC-SHA256 (sal de 128 bits, 100,000 iteraciones), mitigación contra ataques de temporización, cookies HttpOnly + SameSite=Lax y Rate Limiting por IP en `/api/auth/login`.
- **Manejo centralizado de errores:** Respuestas uniformes RFC 7807 (ProblemDetails) sin exponer stack traces al cliente.

---

## 11. Estructura de Ramas y Convención de Commits

- **Ramas:**
  - `main`: Rama estable de entregas y versiones etiquetadas.
  - `develop`: Rama de integración de fases evolutivas.
  - `feature/*`, `fix/*`, `docs/*`: Ramas temáticas por requerimiento o corrección.
- **Commits:** Se aplica la especificación **Conventional Commits** (`feat:`, `fix:`, `refactor:`, `style:`, `test:`, `security:`, `docs:`, `chore:`, `ci:`).

---

## 12. Capturas del Sistema

- **Landing Page Institucional:** Portada sin scroll con horario, estados y roles integrados.
- **Panel de Indicadores (Dashboard):** Métricas de reservas, ambientes más utilizados y gráficos de distribución.
- **Gestión y Filtrado de Reservas:** Trazabilidad completa con filtros por estado y buscador.
- **Catálogo de Ambientes Universitarios:** Visualización de pabellones, aforos, estados y galería fotográfica.
- **Formulario de Nueva Reserva:** Validación de disponibilidad en tiempo real y vista previa fotográfica del ambiente.
