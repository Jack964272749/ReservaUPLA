# INFORME TÉCNICO DE CONSTRUCCIÓN DE SOFTWARE
## Sistema Web ReservaUPLA — Semanas 01 a 09

**Asignatura:** Construcción de Software  
**Institución:** Universidad Peruana Los Andes (UPLA)  
**Semestre:** 2026-II  
**Proyecto:** ReservaUPLA — Prototipo Funcional de Gestión de Reservas de Ambientes Universitarios  

---

## 1. Análisis del Problema, Actores y Alcance (Semana 01 - 02)

### 1.1. Problemática Identificada
En la actualidad, las solicitudes y reservas de ambientes especializados (laboratorios de cómputo, auditorios, salas de reuniones y laboratorios de investigación) en la sede universitaria se gestionan mediante canales informales y manuales: mensajes de mensajería instantánea, llamadas telefónicas o documentos impresos. Esta dinámica produce:
- **Colisión y duplicidad de horarios:** Múltiples docentes o ponentes se presentan al mismo ambiente simultáneamente.
- **Pérdida de trazabilidad:** No existe constancia auditable de quién solicitó el ambiente ni quién lo autorizó.
- **Opacidad en la disponibilidad:** Los docentes no pueden conocer con antelación si un laboratorio está libre.

### 1.2. Actores del Sistema
1. **Solicitante (Docente / Alumno):** Consulta la disponibilidad de ambientes y registra solicitudes de reserva indicando fecha, horario y justificación académica.
2. **Administrador:** Revisa las solicitudes pendientes, valida la viabilidad y aprueba o rechaza reservas aplicando las reglas institucionales.
3. **Responsable de Ambiente:** Consulta el cronograma consolidado y supervisa el uso físico y técnico del espacio asignado.

### 1.3. Alcance del Sistema
El prototipo cubre el ciclo completo desde la parametrización de usuarios y ambientes, la verificación algorítmica de solapamiento en tiempo real, el flujo de aprobación administrativa y la consolidación de indicadores en un panel de control ejecutivo (Dashboard).

---

## 2. Justificación Técnica del Modelo de Ciclo de Vida (Semana 02)

Se seleccionó el **Modelo Iterativo e Incremental estructurado mediante Sprints cortos (Agile / Scrum híbrido)** por las siguientes razones:
1. **Mitigación temprana de riesgos:** Permite construir y validar primero el núcleo de entidades y las reglas de concurrencia de horarios (semanas 3 a 6) antes de exponer interfaces finales de salida (semanas 8 y 9).
2. **Evolución por capas funcionales:** Cada iteración semanal entregó un producto potencialmente desplegable (desde la persistencia relacional hasta el frontend interactivo).
3. **Retroalimentación continua:** Facilita la adaptación de componentes reutilizables sin alterar el núcleo de dominio de la aplicación.

---

## 3. Estándares de Construcción de Software Adoptados (Semana 03 - 04)

### 3.1. Convenciones de Código y Nomenclatura
- **Backend C# / .NET 8:** 
  - PascalCase para clases, métodos, propiedades y nombres de archivos (`ReservaService`, `ObtenerIndicadoresAsync`).
  - camelCase con prefijo guion bajo para dependencias inyectadas privadas (`_reservaRepository`).
  - DTOs inmutables mediante `record` para transporte seguro de datos.
- **Frontend React 19 / JavaScript:**
  - PascalCase para componentes (`TextInput.jsx`, `ModalConfirmacion.jsx`).
  - camelCase para hooks, funciones y variables (`fetchReservas`, `handleChange`).
  - Estructuración modular: `components/`, `pages/`, `services/`, `layouts/`.

### 3.2. Estrategia de Versionamiento y Commits
- Convención **Conventional Commits** (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`).
- Aislamiento en ramas de trabajo y preservación de trazabilidad sin contaminación de metadatos no estándar.

---

## 4. Arquitectura de Software y Patrones de Diseño (Semana 04, 07 y 08)

El backend implementa **Clean Architecture (Onion / Hexagonal)** dividida en cuatro capas desacopladas:

```
[ ReservaUPLA.API ] (Controladores REST, Middleware, Swagger, CORS)
        │
        ▼
[ ReservaUPLA.Application ] (Casos de Uso, DTOs, Interfaces de Repositorios, Servicios)
        │
        ▼
[ ReservaUPLA.Domain ] (Entidades puras del negocio: Usuario, Ambiente, Reserva)
        ▲
        │
[ ReservaUPLA.Infrastructure ] (Entity Framework Core, Npgsql PostgreSQL, Implementación de Repositorios)
```

### Patrones Aplicados:
1. **Repository Pattern:** Desacopla la lógica de negocio del proveedor de base de datos (`IReservaRepository`, `IAmbienteRepository`).
2. **Dependency Injection:** Inversión de control nativa en ASP.NET Core mediante interfaces registradas con ciclo de vida `Scoped`.
3. **Container / Presentational Pattern:** En React, las páginas gestionan el estado y orquestan los componentes reutilizables de UI.

---

## 5. Implementación de Módulos de Entrada y Validaciones (Semanas 05 y 06)

Se implementaron validaciones en profundidad (doble barrera: Frontend reactivo y Backend defensivo):

### Matriz de Reglas de Negocio Implementadas:
- **RN-01 (Aislamiento de Colisiones):** La consulta de solapamiento en `ReservaRepository` aplica la fórmula:
  $$\text{ExisteConflicto} \iff (\text{Inicio}_{\text{existente}} < \text{Fin}_{\text{nueva}}) \land (\text{Fin}_{\text{existente}} > \text{Inicio}_{\text{nueva}}) \land (\text{Estado} = \text{'Aprobada'})$$
- **RN-02 (Obligatoriedad de Datos):** Validación de nulidad y cadenas en blanco para fecha, horarios, solicitante, ambiente y motivo.
- **RN-03 (Consistencia Temporal):** Condición estricta $\text{HoraFin} > \text{HoraInicio}$.
- **RN-04 (Ventana Operativa Institucional):** $\text{HoraInicio} \ge 07:00$ y $\text{HoraFin} \le 22:00$.
- **RN-05 (Rol Administrativo):** Las transiciones de estado a *Aprobada* o *Rechazada* están encapsuladas en endpoints específicos del controlador.
- **RN-06 (Inmutabilidad de Rechazo):** Si una reserva posee `Estado == "Rechazada"`, el sistema bloquea cualquier intento de actualización o reactivación.

---

## 6. Componentes Reutilizables y Refinamiento (Semanas 07 y 08)

Se desarrollaron 9 componentes reutilizables certificados en el frontend:
1. `TextInput`: Control de texto genérico con binding, labels y mensajes de error contextuales.
2. `SelectInput`: Listas desplegables con options dinámicos.
3. `DateInput`: Selector de calendario con formato ISO normalizado.
4. `TimeInput`: Control horario con saltos de intervalo.
5. `Button`: Botón modular con variantes visuales y estados `loading` asíncronos.
6. `AlertMessage`: Notificaciones flotantes semánticas (éxito, error, advertencia).
7. `ModalConfirmacion`: Modal de diálogo accesible para operaciones sensibles.
8. `TableList`: Renderizador de grillas responsivas con estados vacíos y skeleton de carga.
9. `CardIndicador`: Tarjetas analíticas visuales con métricas e iconos vectoriales.

---

## 7. Módulo de Salida y Dashboard de Indicadores (Semana 09)

El módulo de salida consolida métricas clave en tiempo real:
- **Total de Reservas:** Volumen histórico total registrado.
- **Reservas Pendientes:** Solicitudes en bandeja de evaluación administrativa.
- **Reservas Aprobadas:** Compromisos horarios vigentes.
- **Reservas Rechazadas:** Solicitudes denegadas.
- **Ambiente Más Utilizado:** Agrupamiento estadístico dinámico (`GroupBy` por ambiente con conteo).

---

## 8. Verificación y Pruebas Automatizadas

Se implementó el proyecto `ReservaUPLA.Tests` con xUnit y Moq, validando formalmente:
- Colisión de horarios con reservas aprobadas existentes (**RN-01**).
- Validación de hora fin menor o igual a inicio (**RN-03**).
- Restricción de horario fuera de la franja 07:00 a 22:00 (**RN-04**).
- Bloqueo de modificación sobre reservas rechazadas (**RN-06**).
- Creación exitosa de reservas con estado inicial *Pendiente*.

**Resultado de ejecución:**
```
Serie de pruebas para ReservaUPLA.Tests.dll (.NETCoreApp,Version=v8.0)
Total de pruebas: 6 | Superadas: 6 | Con error: 0 | Omitidas: 0
Estado: 100% Satisfactorio
```

---

## 9. Respuesta a la Pregunta de Reflexión Final (Sección 13)

> **Pregunta:** *Explique cómo la aplicación de estándares, validación de datos, reutilización de componentes y refinamiento de código contribuye a mejorar la calidad, mantenibilidad y evolución del sistema ReservaUPLA.*

### Respuesta Fundamentada:

1. **Aplicación de Estándares (Clean Architecture y Nomenclatura):**  
   Al desacoplar el Dominio de las capas de Infraestructura y Presentación, el sistema se vuelve inmune a cambios externos. Si la universidad decidiera cambiar de proveedor de base de datos (por ejemplo, migrar de PostgreSQL a SQL Server o una base en la nube) o sustituir el framework de UI (de React a Angular o Blazor), la lógica de negocio central permanece intacta, reduciendo el costo de cambio a una simple sustitución de adaptadores.

2. **Validación de Datos en Dos Niveles (Defensa en Profundidad):**  
   Validar en el frontend proporciona una experiencia de usuario fluida e inmediata, evitando solicitudes HTTP innecesarias; sin embargo, validar rigurosamente en la capa de Aplicación del backend es lo que garantiza la **integridad referencial y de negocio**. Evita la corrupción de la base de datos ante peticiones malintencionadas o accesos concurrentes, impidiendo estados inválidos como solapamientos de aulas.

3. **Reutilización de Componentes:**  
   La creación de una biblioteca de componentes de interfaz atómicos (`TextInput`, `SelectInput`, `Button`, `TableList`) reduce drásticamente la duplicación de código (Principio DRY). Cualquier mejora estética, corrección de accesibilidad o ajuste de diseño se realiza en un único archivo y se propaga automáticamente por toda la plataforma, acelerando el desarrollo de futuros módulos (como el módulo de incidencias o inventario).

4. **Refinamiento de Código (Refactoring continuo):**  
   El refinamiento constante transforma código que simplemente "funciona" en código limpio, modular y testeable. Permite aislar responsabilidades en servicios cohesivos, facilitando la incorporación de pruebas unitarias automatizadas. Esta práctica elimina la deuda técnica y asegura que el sistema ReservaUPLA pueda evolucionar hacia arquitecturas distribuidas (microservicios o serverless) con total estabilidad a largo plazo.
