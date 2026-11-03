# ReservaUPLA: Sistema de Gestión de Reservas de Ambientes Universitarios

Prototipo funcional desarrollado para la asignatura **Construcción de Software** (Semanas 01 a 09), Universidad Peruana Los Andes (UPLA).

---

## 🏛️ Arquitectura del Sistema

El proyecto está diseñado bajo principios de **Clean Architecture**, alta cohesión, bajo acoplamiento y separación estricta de responsabilidades:

```
ReservaUPLA/
├── backend/
│   ├── ReservaUPLA.API/             # Controladores REST, Swagger, Configuración CORS, DI
│   ├── ReservaUPLA.Application/     # Casos de uso, Servicios, DTOs, Interfaces
│   ├── ReservaUPLA.Domain/          # Entidades de Dominio (Usuario, Ambiente, Reserva)
│   ├── ReservaUPLA.Infrastructure/  # Entity Framework Core, PostgreSQL, Repositorios
│   ├── ReservaUPLA.Tests/           # Pruebas unitarias xUnit con Moq
│   └── ReservaUPLA.sln
├── frontend/
│   ├── src/
│   │   ├── components/              # Componentes reutilizables (TextInput, SelectInput, Button, etc.)
│   │   ├── pages/                   # Dashboard, Reservas, CrearReserva, Ambientes, Usuarios
│   │   ├── services/                # Cliente API Fetch
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── INFORME_TECNICO_RESERVAUPLA.md   # Informe técnico y respuesta a pregunta de reflexión
└── README.md
```

---

## 🚀 Requisitos Previos

- [.NET 8.0 SDK](https://dotnet.microsoft.com/download)
- [Node.js v18+](https://nodejs.org/) y npm
- [PostgreSQL](https://www.postgresql.org/) (Servicio local en puerto 5432)

---

## ⚙️ Puesta en Marcha

### 1. Base de Datos y Backend (.NET 8)

1. Verifique que PostgreSQL esté ejecutándose y que la cadena de conexión en `backend/ReservaUPLA.API/appsettings.json` sea la correcta:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Host=localhost;Port=5432;Database=ReservaUPLADB;Username=postgres;Password=123"
   }
   ```
2. Ejecutar las migraciones o permitir la auto-inicialización:
   ```bash
   cd backend
   dotnet ef database update --project ReservaUPLA.Infrastructure/ReservaUPLA.Infrastructure.csproj --startup-project ReservaUPLA.API/ReservaUPLA.API.csproj
   ```
3. Iniciar el API:
   ```bash
   cd ReservaUPLA.API
   dotnet run --urls "http://localhost:5000"
   ```
4. Documentación interactiva Swagger disponible en:
   👉 **http://localhost:5000/swagger**

### 2. Frontend (React 19 + Vite + Tailwind CSS)

1. En una nueva terminal, instale las dependencias e inicie el servidor de desarrollo:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. Abra en su navegador:
   👉 **http://localhost:5173**

### 3. Ejecutar Pruebas Automatizadas

```bash
cd backend
dotnet test
```

---

## 📋 Mapeo de Requerimientos Funcionales y Reglas de Negocio

| Código | Requerimiento / Regla | Estado | Ubicación en el Código |
|---|---|:---:|---|
| **RF-01** | Registrar usuarios solicitantes | ✅ | `UsuariosController.cs`, `Usuarios.jsx` |
| **RF-02** | Registrar ambientes universitarios | ✅ | `AmbientesController.cs`, `Ambientes.jsx` |
| **RF-03** | Registrar solicitudes de reserva | ✅ | `ReservasController.cs`, `CrearReserva.jsx` |
| **RF-04** | Validar disponibilidad antes de registrar | ✅ | `ReservaService.ValidarDisponibilidadAsync`, Botón en UI |
| **RF-05** | Listar reservas registradas con filtros | ✅ | `ReservasController.GetAll`, `Reservas.jsx` |
| **RF-06** | Consultar detalle de una reserva | ✅ | `ReservasController.GetById`, Modal en `Reservas.jsx` |
| **RF-07** | Cambiar estado (Pendiente, Aprobada, Rechazada, Cancelada) | ✅ | `ReservasController.CambiarEstado`, Modal en `Reservas.jsx` |
| **RF-08** | Indicadores básicos en Dashboard | ✅ | `DashboardController.cs`, `Dashboard.jsx` |
| **RN-01** | No duplicidad de reservas aprobadas en mismo ambiente y horario | ✅ | `ReservaRepository.ExisteConflictoAprobadoAsync` |
| **RN-02** | Obligatoriedad de fecha, horas, ambiente, solicitante y motivo | ✅ | DTOs y validaciones en `ReservaService` |
| **RN-03** | Hora de fin estrictamente mayor que hora de inicio | ✅ | `ReservaService` y frontend form validation |
| **RN-04** | Rango institucional permitido de 07:00 a 22:00 horas | ✅ | `ReservaService` y frontend form validation |
| **RN-05** | Solo administrador puede aprobar o rechazar reservas | ✅ | `ReservasController.CambiarEstado` |
| **RN-06** | Una reserva rechazada no puede modificarse | ✅ | `ReservaService.CambiarEstadoAsync` |

---

## 🧩 Componentes Reutilizables Implementados

- `TextInput`: Entrada de texto con etiquetas y estados de validación.
- `SelectInput`: Listas desplegables estilizadas y reutilizables.
- `DateInput`: Selección de fecha con restricciones mínimas.
- `TimeInput`: Selección de horarios con saltos por intervalos.
- `Button`: Variantes semánticas (primary, success, danger, outline) y estados de carga.
- `AlertMessage`: Notificaciones flotantes contextuales (éxito, error, advertencia).
- `ModalConfirmacion`: Cuadro de diálogo modal accesible para acciones críticas.
- `TableList`: Renderizado de grillas con ordenamiento, formato y estados vacíos.
- `CardIndicador`: Tarjetas analíticas para métricas del dashboard.
