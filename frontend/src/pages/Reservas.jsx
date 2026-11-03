import React, { useState } from 'react';
import {
  CalendarDays,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  RefreshCw,
} from 'lucide-react';
import TableList from '../components/TableList';
import Button from '../components/Button';
import AlertMessage from '../components/AlertMessage';
import ModalConfirmacion from '../components/ModalConfirmacion';
import TextInput from '../components/TextInput';
import { useReservas } from '../hooks/useReservas';
import { useAuth } from '../hooks/useAuth';

// Trazabilidad: RF-05, RF-06, RF-07 · RN-05, RN-06 · Nielsen H1, H3, H5, H6, H7, H9 · Shneiderman S1..S5 · ISO 9241-11
export default function Reservas({ alIrANuevaReserva }) {
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

  const badgeEstado = (estado) => {
    const config = {
      Pendiente: 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800',
      Aprobada: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
      Rechazada: 'bg-rose-100 text-rose-900 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-800',
      Cancelada: 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700',
    }[estado] || 'bg-slate-100 text-slate-800 border-slate-300';

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${config}`}>
        {estado}
      </span>
    );
  };

  const columnas = [
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
        <div className="flex flex-col items-start gap-1">
          <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
            {r.fecha}
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-sky-100/70 dark:bg-sky-950/50 text-sky-900 dark:text-sky-300 font-mono text-xs font-semibold border border-sky-200 dark:border-sky-800">
            <Clock className="w-3.5 h-3.5 text-sky-700 dark:text-sky-400" aria-hidden="true" />
            {r.horaInicio} – {r.horaFin}
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
      className: 'text-right',
      render: (r) => (
        <div className="flex items-center justify-end gap-1.5">
          {/* Botón Ver Detalle (RF-06) */}
          <button
            type="button"
            onClick={() => setReservaDetalle(r)}
            aria-label={`Ver detalles de la reserva de ${r.solicitanteNombre}`}
            title="Ver detalles"
            className="p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Acciones de Administrador (RN-05): Aprobar / Rechazar */}
          {rol === 'Administrador' && r.estado === 'Pendiente' && (
            <>
              <button
                type="button"
                onClick={(e) => abrirModalAccion(r, 'Aprobada', e.currentTarget)}
                aria-label={`Aprobar reserva de ${r.solicitanteNombre}`}
                title="Aprobar reserva"
                className="p-2 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-950/40 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={(e) => abrirModalAccion(r, 'Rechazada', e.currentTarget)}
                aria-label={`Rechazar reserva de ${r.solicitanteNombre}`}
                title="Rechazar reserva"
                className="p-2 text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/40 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Cancelación (Solicitante o Admin sobre reservas no rechazadas) */}
          {(rol === 'Administrador' || rol === 'Solicitante') &&
            r.estado !== 'Rechazada' &&
            r.estado !== 'Cancelada' && (
              <button
                type="button"
                onClick={(e) => abrirModalAccion(r, 'Cancelada', e.currentTarget)}
                aria-label="Cancelar esta reserva"
                title="Cancelar reserva"
                className="text-xs font-semibold text-rose-700 hover:text-rose-900 dark:text-rose-400 dark:hover:text-rose-300 px-2.5 py-1.5 rounded-lg hover:bg-rose-100/70 dark:hover:bg-rose-950/40 min-h-[44px] flex items-center"
              >
                Cancelar
              </button>
            )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
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
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
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

        {(filtroFecha || filtroEstado) && (
          <button
            type="button"
            onClick={() => {
              setFiltroFecha('');
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
        data={reservas}
        loading={cargando}
        emptyMessage="No se encontraron reservas con los criterios seleccionados."
        renderMobileCard={(r) => (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{r.ambienteNombre}</span>
              {badgeEstado(r.estado)}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">📅 {r.fecha}</span>
              <span className="text-xs text-sky-800 dark:text-sky-300 font-mono font-medium">⏰ {r.horaInicio} – {r.horaFin}</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              👤 Solicitado por: <strong>{r.solicitanteNombre}</strong>
            </p>
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-700">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setReservaDetalle(r)}
              >
                Ver detalle
              </Button>
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
          <div className="space-y-2.5 text-xs text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-200 dark:border-slate-600 font-medium">
            <p><strong>ID:</strong> <span className="font-mono">{reservaDetalle.id}</span></p>
            <p><strong>Ambiente:</strong> {reservaDetalle.ambienteNombre}</p>
            <p><strong>Fecha programada:</strong> {reservaDetalle.fecha}</p>
            <p><strong>Horario:</strong> <span className="font-mono font-semibold">{reservaDetalle.horaInicio} – {reservaDetalle.horaFin}</span></p>
            <p><strong>Estado:</strong> {badgeEstado(reservaDetalle.estado)}</p>
            <p><strong>Solicitante:</strong> {reservaDetalle.solicitanteNombre} ({reservaDetalle.solicitanteCorreo})</p>
            <p><strong>Motivo:</strong> {reservaDetalle.motivo}</p>
            {reservaDetalle.motivoRechazo && (
              <p className="text-rose-700 dark:text-rose-400 font-semibold">
                <strong>Motivo de rechazo:</strong> {reservaDetalle.motivoRechazo}
              </p>
            )}
            <p className="text-slate-500 dark:text-slate-400"><strong>Fecha de registro:</strong> {new Date(reservaDetalle.fechaRegistro).toLocaleString()}</p>
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
  );
}
