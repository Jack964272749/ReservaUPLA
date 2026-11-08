import React, { useEffect, useState } from 'react';
import {
  CalendarDays,
  Calendar,
  Building2,
  User,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  RefreshCw,
  Ban,
} from 'lucide-react';
import TableList from '../components/TableList';
import AccionesReserva from '../components/AccionesReserva';
import Button from '../components/Button';
import AlertMessage from '../components/AlertMessage';
import ModalConfirmacion from '../components/ModalConfirmacion';
import TextInput from '../components/TextInput';
import { useReservas } from '../hooks/useReservas';
import { useAuth } from '../hooks/useAuth';
import { useResumenAmbientes } from '../hooks/useResumenAmbientes';
import { useNumeroRegistro } from '../hooks/useNumeroRegistro';

// Trazabilidad: RF-05, RF-06, RF-07 · RN-05, RN-06 · Nielsen H1, H3, H5, H6, H7, H9 · Shneiderman S1..S5 · ISO 9241-11
export default function Reservas({ alIrANuevaReserva, estadoInicial }) {
  const { usuario } = useAuth();
  const rol = usuario?.rol || 'Solicitante';

  const {
    reservas,
    totalRegistros,
    paginaActual,
    totalPaginas,
    setPaginaActual,
    cargando,
    error,
    filtroFecha,
    setFiltroFecha,
    filtroAmbiente,
    setFiltroAmbiente,
    filtroEstado,
    setFiltroEstado,
    recargar,
    modalAccion,
    abrirModalAccion,
    cerrarModalAccion,
    confirmarAccion,
    procesandoAccion,
    motivoRechazo,
    setMotivoRechazo,
    ultimoBotonAccionRef,
  } = useReservas();

  // Modal para Detalle de Reserva (RF-06)
  const [reservaDetalle, setReservaDetalle] = useState(null);

  // Estado preseleccionado (p. ej. al llegar desde la alerta de pendientes del Administrador)
  useEffect(() => {
    if (estadoInicial) {
      setFiltroEstado(estadoInicial);
      setPaginaActual(1);
    }
  }, [estadoInicial]);

  // Orden correlativo: Administrador ve primero las solicitudes Pendientes
  const esAdmin = rol === 'Administrador';
  const reservasOrdenadas = useMemo(() => {
    return [...reservas].sort((a, b) => {
      if (a.estado === 'Pendiente' && b.estado !== 'Pendiente') return -1;
      if (a.estado !== 'Pendiente' && b.estado === 'Pendiente') return 1;
      return 0;
    });
  }, [reservas]);

  // Mejora para el Responsable: resumen de uso de los ambientes que tiene asignados
  const esResponsable = rol === 'Responsable';
  const { ambientes: misAmbientes, resumen, cargando: cargandoResumen } = useResumenAmbientes(
    esResponsable,
    usuario?.id
  );

  const badgeEstado = (estado) => {
    const config = {
      Pendiente: 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800',
      Aprobada: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
      Rechazada: 'bg-rose-100 text-rose-900 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-800',
      Cancelada: 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700',
    }[estado] || 'bg-slate-100 text-slate-800 border-slate-300';

    const IconoEstado = { Pendiente: Clock, Aprobada: CheckCircle2, Rechazada: XCircle, Cancelada: Ban }[estado];

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${config}`}>
        {IconoEstado && <IconoEstado className="w-3.5 h-3.5" aria-hidden="true" />}
        {estado}
      </span>
    );
  };

  const columnas = [
    ...(esAdmin
      ? [
          {
            header: 'N°',
            className: 'w-14 text-center',
            render: (r, index) => (
              <span
                className="font-bold text-slate-700 dark:text-slate-300"
                title="Número correlativo de registro"
              >
                {(paginaActual - 1) * 10 + index + 1}
              </span>
            ),
          },
        ]
      : []),
    {
      header: 'Ambiente',
      render: (r) => (
        <div>
          <p className="font-bold text-slate-900 dark:text-slate-100">{r.ambienteNombre}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">ID: {r.id.substring(0, 8)}…</p>
        </div>
      ),
    },
    {
      header: 'Fecha y Horario',
      render: (r) => (
        <div className="flex flex-col items-start gap-1.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-sky-50 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300 font-semibold text-xs border border-sky-200/90 dark:border-sky-800 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" aria-hidden="true" />
            <span>{r.fecha}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-800 dark:text-indigo-300 font-mono font-semibold text-xs border border-indigo-200/90 dark:border-indigo-800 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
            <span>{r.horaInicio} – {r.horaFin}</span>
          </span>
        </div>
      ),
    },
    {
      header: 'Solicitante',
      render: (r) => (
        <div>
          <p className="font-semibold text-slate-900 dark:text-slate-200">{r.solicitanteNombre}</p>
          <p className="text-xs text-slate-600 dark:text-slate-400">{r.solicitanteCorreo}</p>
        </div>
      ),
    },
    {
      header: 'Estado',
      render: (r) => badgeEstado(r.estado),
    },
    {
      header: 'Acciones',
      className: 'text-center',
      render: (r) => (
        <AccionesReserva
          reserva={r}
          rol={rol}
          onVer={setReservaDetalle}
          onAccion={abrirModalAccion}
        />
      ),
    },
  ];

  return (
    <>
    <div className="relative z-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-sky-800 dark:text-sky-400" aria-hidden="true" />
            <span>
              {rol === 'Solicitante'
                ? 'Mis Reservas Institucionales'
                : rol === 'Responsable'
                ? 'Reservas de Ambiente Asignado'
                : 'Gestión General de Reservas'}
            </span>
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mt-1">
            {totalRegistros} reserva(s) registrada(s) en total.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={recargar}
            icon={RefreshCw}
            ariaLabel="Refrescar listado"
          >
            Actualizar
          </Button>
          {alIrANuevaReserva && (
            <Button
              variant="primary"
              size="sm"
              onClick={alIrANuevaReserva}
            >
              Nueva Reserva
            </Button>
          )}
        </div>
      </div>

      {error && (
        <AlertMessage
          type="error"
          message={error}
        />
      )}

      {esResponsable && misAmbientes.length > 0 && (
        <section aria-label="Resumen de uso de mis ambientes" className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Resumen de uso de mis ambientes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {misAmbientes.map((amb, i) => (
              <div
                key={amb.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <span
                    className="flex-shrink-0 w-7 h-7 rounded-full bg-sky-600 text-white text-xs font-bold flex items-center justify-center"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 dark:text-slate-100 truncate">{amb.nombre}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {amb.ubicacion} · {amb.capacidad} personas
                    </p>
                  </div>
                </div>
                <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 py-2">
                <dt className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Total</dt>
                <dd className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {cargandoResumen ? '…' : (resumen[amb.id]?.total ?? 0)}
                </dd>
              </div>
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 py-2">
                <dt className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Aprobadas</dt>
                <dd className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
                  {cargandoResumen ? '…' : (resumen[amb.id]?.aprobadas ?? 0)}
                </dd>
              </div>
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 py-2">
                <dt className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Pendientes</dt>
                <dd className="text-xl font-bold text-amber-700 dark:text-amber-400">
                  {cargandoResumen ? '…' : (resumen[amb.id]?.pendientes ?? 0)}
                </dd>
              </div>
                </dl>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Barra de Filtros Accesible (RF-05 · Nielsen H7) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-sky-700 dark:text-sky-400" aria-hidden="true" />
          <span>Filtrar por:</span>
        </div>

        <div className="w-full sm:w-56">
          <label htmlFor="filtro-fecha" className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
            Fecha de reserva:
          </label>
          <input
            id="filtro-fecha"
            type="date"
            value={filtroFecha}
            onChange={(e) => {
              setFiltroFecha(e.target.value);
              setPaginaActual(1);
            }}
            className="w-full min-h-[44px] px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="w-full sm:w-56">
          <label htmlFor="filtro-estado" className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
            Estado de solicitud:
          </label>
          <select
            id="filtro-estado"
            value={filtroEstado}
            onChange={(e) => {
              setFiltroEstado(e.target.value);
              setPaginaActual(1);
            }}
            className="w-full min-h-[44px] px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Aprobada">Aprobada</option>
            <option value="Rechazada">Rechazada</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        </div>

        {esResponsable && misAmbientes.length > 1 && (
          <div className="w-full sm:w-56">
            <label htmlFor="filtro-ambiente" className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              Ambiente:
            </label>
            <select
              id="filtro-ambiente"
              value={filtroAmbiente}
              onChange={(e) => {
                setFiltroAmbiente(e.target.value);
                setPaginaActual(1);
              }}
              className="w-full min-h-[44px] px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="">Todos mis ambientes</option>
              {misAmbientes.map((a, i) => (
                <option key={a.id} value={a.id}>
                  {i + 1}. {a.nombre}
                </option>
              ))}
            </select>
          </div>
        )}

        {(filtroFecha || filtroEstado || filtroAmbiente) && (
          <button
            type="button"
            onClick={() => {
              setFiltroFecha('');
              setFiltroAmbiente('');
              setFiltroEstado('');
              setPaginaActual(1);
            }}
            className="text-xs font-semibold text-sky-800 dark:text-sky-400 hover:underline min-h-[44px] px-3 flex items-center"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Tabla de Reservas */}
      <TableList
        caption="Listado de reservas de ambientes institucionales"
        columns={columnas}
        data={reservasOrdenadas}
        loading={cargando}
        emptyMessage="No se encontraron reservas con los criterios seleccionados."
        renderMobileCard={(r, index) => (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                {esAdmin ? `N° ${(paginaActual - 1) * 10 + index + 1} · ` : ''}
                {r.ambienteNombre}
              </span>
              {badgeEstado(r.estado)}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 font-semibold text-xs border border-sky-200 dark:border-sky-800">
                <Calendar className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" aria-hidden="true" />
                <span>{r.fecha}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 font-mono font-semibold text-xs border border-indigo-200 dark:border-indigo-800">
                <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                <span>{r.horaInicio} – {r.horaFin}</span>
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              👤 Solicitado por: <strong>{r.solicitanteNombre}</strong>
            </p>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
              <AccionesReserva
                reserva={r}
                rol={rol}
                onVer={setReservaDetalle}
                onAccion={abrirModalAccion}
              />
            </div>
          </div>
        )}
      />

      {/* Paginación Accesible */}
      {totalPaginas > 1 && (
        <div className="flex items-center justify-between pt-4 text-xs font-medium text-slate-700 dark:text-slate-300">
          <p>
            Página {paginaActual} de {totalPaginas}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={paginaActual <= 1}
              onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={paginaActual >= totalPaginas}
              onClick={() => setPaginaActual((p) => Math.min(totalPaginas, p + 1))}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}

      {/* Modal de Detalle de Reserva (RF-06) */}
      {reservaDetalle && (
        <ModalConfirmacion
          isOpen={Boolean(reservaDetalle)}
          onClose={() => setReservaDetalle(null)}
          onConfirm={() => setReservaDetalle(null)}
          title="Detalle de Solicitud de Reserva"
          message={`Información registrada para la reserva del ambiente ${reservaDetalle.ambienteNombre}.`}
          confirmText="Cerrar detalle"
          cancelText="Volver"
          variant="primary"
        >
          <div className="space-y-3.5 text-xs bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-700 shadow-sm font-medium">
            {/* Header del detalle: Ambiente y Estado */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                  <Building2 className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Ambiente institucional</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{reservaDetalle.ambienteNombre}</p>
                </div>
              </div>
              <div>{badgeEstado(reservaDetalle.estado)}</div>
            </div>

            {/* Fecha y Horario destacados en colores diferenciados */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-sky-50 dark:bg-sky-950/50 border border-sky-200/90 dark:border-sky-800 shadow-2xs">
                <div className="p-2 rounded-lg bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300">
                  <Calendar className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400">Fecha programada</p>
                  <p className="text-xs font-bold text-sky-950 dark:text-sky-100">{reservaDetalle.fecha}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/90 dark:border-indigo-800 shadow-2xs">
                <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                  <Clock className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">Horario reservado</p>
                  <p className="text-xs font-bold font-mono text-indigo-950 dark:text-indigo-100">{reservaDetalle.horaInicio} – {reservaDetalle.horaFin}</p>
                </div>
              </div>
            </div>

            {/* Solicitante y Motivo */}
            <div className="space-y-2 pt-1 text-slate-700 dark:text-slate-300">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200/80 dark:border-slate-700">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Solicitado por</p>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 mt-0.5">
                  <User className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                  <span>{reservaDetalle.solicitanteNombre}</span>
                  <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">({reservaDetalle.solicitanteCorreo})</span>
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200/80 dark:border-slate-700">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Motivo de la solicitud</p>
                <p className="text-xs text-slate-800 dark:text-slate-200 mt-0.5">{reservaDetalle.motivo}</p>
              </div>

              {reservaDetalle.motivoRechazo && (
                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">Motivo de rechazo administrativo</p>
                  <p className="text-xs font-semibold mt-0.5">{reservaDetalle.motivoRechazo}</p>
                </div>
              )}
            </div>

            {/* Metadata técnica en pie */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 dark:text-slate-500 font-mono">
              <span>ID: {reservaDetalle.id.substring(0, 18)}…</span>
              <span>Registro: {new Date(reservaDetalle.fechaRegistro).toLocaleString()}</span>
            </div>
          </div>
        </ModalConfirmacion>
      )}

      {/* Modal de Acción (Aprobar / Rechazar / Cancelar) con focus return (E-33) */}
      <ModalConfirmacion
        isOpen={Boolean(modalAccion)}
        onClose={cerrarModalAccion}
        onConfirm={confirmarAccion}
        title={modalAccion?.titulo || 'Confirmar acción'}
        message={modalAccion?.mensaje || ''}
        confirmText={
          modalAccion?.nuevoEstado === 'Aprobada'
            ? 'Aprobar Reserva'
            : modalAccion?.nuevoEstado === 'Rechazada'
            ? 'Rechazar Reserva'
            : 'Cancelar Reserva'
        }
        cancelText="Descartar"
        variant={modalAccion?.variante || 'primary'}
        loading={procesandoAccion}
        triggerRef={ultimoBotonAccionRef}
      >
        {modalAccion?.nuevoEstado === 'Rechazada' && (
          <div className="mt-3">
            <TextInput
              id="motivo-rechazo-input"
              label="Motivo del rechazo"
              placeholder="Ej. Conflicto con evento institucional de rectoría"
              value={motivoRechazo}
              onChange={(e) => setMotivoRechazo(e.target.value)}
              obligatorio
              autoFocus
            />
          </div>
        )}
      </ModalConfirmacion>
    </div>
    </>
  );
}
