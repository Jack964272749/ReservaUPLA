import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  Filter,
  Check,
  X,
  Ban,
  Eye,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import TableList from '../components/TableList';
import Button from '../components/Button';
import AlertMessage from '../components/AlertMessage';
import ModalConfirmacion from '../components/ModalConfirmacion';
import SelectInput from '../components/SelectInput';
import DateInput from '../components/DateInput';
import TextInput from '../components/TextInput';
import { api } from '../services/api';

export default function Reservas({ setActiveTab }) {
  const [reservas, setReservas] = useState([]);
  const [ambientes, setAmbientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  // Filters
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroAmbiente, setFiltroAmbiente] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');

  // Modal State for Action (Aprobar, Rechazar, Cancelar)
  const [selectedReserva, setSelectedReserva] = useState(null);
  const [modalAction, setModalAction] = useState(null); // 'Aprobada' | 'Rechazada' | 'Cancelada'
  const [observacion, setObservacion] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Modal Detail State
  const [detailReserva, setDetailReserva] = useState(null);

  const fetchAmbientes = async () => {
    try {
      const data = await api.getAmbientes();
      setAmbientes(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchReservas = async () => {
    setLoading(true);
    try {
      const data = await api.getReservas({
        fecha: filtroFecha || undefined,
        ambienteId: filtroAmbiente || undefined,
        estado: filtroEstado || undefined,
      });
      setReservas(data);
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Error al cargar las reservas.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmbientes();
  }, []);

  useEffect(() => {
    fetchReservas();
  }, [filtroFecha, filtroAmbiente, filtroEstado]);

  const handleOpenActionModal = (reserva, action) => {
    setSelectedReserva(reserva);
    setModalAction(action);
    setObservacion('');
  };

  const handleConfirmAction = async () => {
    if (!selectedReserva || !modalAction) return;

    if (modalAction === 'Rechazada' && !observacion.trim()) {
      setAlert({ type: 'warning', message: 'Debe ingresar el motivo de rechazo en la observación.' });
      return;
    }

    setActionLoading(true);
    try {
      await api.cambiarEstadoReserva(selectedReserva.id, {
        nuevoEstado: modalAction,
        observacionAdmin: observacion,
      });
      setAlert({
        type: 'success',
        message: `La reserva ha sido marcada como ${modalAction} exitosamente.`,
      });
      setSelectedReserva(null);
      setModalAction(null);
      fetchReservas();
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (estado) => {
    const badges = {
      Aprobada: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      Pendiente: 'bg-amber-100 text-amber-800 border-amber-300',
      Rechazada: 'bg-rose-100 text-rose-800 border-rose-300',
      Cancelada: 'bg-slate-100 text-slate-700 border-slate-300',
    };
    return (
      <span
        className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${
          badges[estado] || badges.Pendiente
        }`}
      >
        {estado}
      </span>
    );
  };

  const columns = [
    {
      header: 'Ambiente',
      render: (r) => (
        <div>
          <p className="font-semibold text-slate-800">{r.ambienteNombre}</p>
          <span className="text-xs text-slate-400">{r.ambienteTipo}</span>
        </div>
      ),
    },
    {
      header: 'Solicitante',
      render: (r) => (
        <div>
          <p className="font-medium text-slate-800">{r.usuarioNombre}</p>
          <span className="text-xs text-slate-400">{r.usuarioCorreo}</span>
        </div>
      ),
    },
    {
      header: 'Fecha & Horario',
      render: (r) => (
        <div>
          <p className="font-mono text-xs font-semibold text-slate-700">{r.fecha}</p>
          <p className="font-mono text-xs text-slate-500">
            {r.horaInicio.slice(0, 5)} - {r.horaFin.slice(0, 5)}
          </p>
        </div>
      ),
    },
    {
      header: 'Motivo',
      render: (r) => (
        <p className="truncate max-w-[200px] text-xs text-slate-600" title={r.motivo}>
          {r.motivo}
        </p>
      ),
    },
    {
      header: 'Estado',
      align: 'center',
      render: (r) => getStatusBadge(r.estado),
    },
    {
      header: 'Acciones',
      align: 'right',
      render: (r) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDetailReserva(r)}
            className="p-1.5"
            title="Ver detalle"
          >
            <Eye className="w-3.5 h-3.5" />
          </Button>

          {/* RN-06: Una reserva rechazada no podrá modificarse */}
          {r.estado !== 'Rechazada' && (
            <>
              {r.estado === 'Pendiente' && (
                <>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleOpenActionModal(r, 'Aprobada')}
                    className="p-1.5"
                    title="Aprobar reserva"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleOpenActionModal(r, 'Rechazada')}
                    className="p-1.5"
                    title="Rechazar reserva"
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </>
              )}

              {r.estado === 'Aprobada' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenActionModal(r, 'Cancelada')}
                  className="p-1.5 text-slate-500 hover:text-rose-600"
                  title="Cancelar reserva"
                >
                  <Ban className="w-3.5 h-3.5" />
                </Button>
              )}
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Gestión de Reservas</h1>
          <p className="text-sm text-slate-500">
            Listado completo, validaciones y aprobación administrativa de reservas.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={RefreshCw} onClick={fetchReservas} loading={loading}>
            Refrescar
          </Button>
          <Button variant="primary" size="sm" onClick={() => setActiveTab('nueva-reserva')}>
            Nueva Reserva
          </Button>
        </div>
      </div>

      {alert && (
        <AlertMessage
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
        <DateInput
          label="Filtrar por Fecha"
          value={filtroFecha}
          onChange={(e) => setFiltroFecha(e.target.value)}
        />

        <SelectInput
          label="Filtrar por Ambiente"
          value={filtroAmbiente}
          onChange={(e) => setFiltroAmbiente(e.target.value)}
          placeholder="Todos los ambientes"
          options={ambientes.map((a) => ({ value: a.id, label: a.nombre }))}
        />

        <SelectInput
          label="Filtrar por Estado"
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          placeholder="Todos los estados"
          options={[
            { value: 'Pendiente', label: 'Pendiente' },
            { value: 'Aprobada', label: 'Aprobada' },
            { value: 'Rechazada', label: 'Rechazada' },
            { value: 'Cancelada', label: 'Cancelada' },
          ]}
        />

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="md"
            className="w-full"
            onClick={() => {
              setFiltroFecha('');
              setFiltroAmbiente('');
              setFiltroEstado('');
            }}
          >
            Limpiar Filtros
          </Button>
        </div>
      </div>

      {/* Table */}
      <TableList
        columns={columns}
        data={reservas}
        loading={loading}
        emptyMessage="No se encontraron reservas con los filtros seleccionados."
      />

      {/* Modal Confirmación de Cambio de Estado (RF-07, RN-05, RN-06) */}
      <ModalConfirmacion
        isOpen={!!selectedReserva}
        onClose={() => setSelectedReserva(null)}
        onConfirm={handleConfirmAction}
        loading={actionLoading}
        title={
          modalAction === 'Aprobada'
            ? 'Aprobar Solicitud de Reserva'
            : modalAction === 'Rechazada'
            ? 'Rechazar Solicitud de Reserva'
            : 'Cancelar Reserva'
        }
        message={
          modalAction === 'Aprobada'
            ? `¿Desea aprobar la reserva para el ambiente "${selectedReserva?.ambienteNombre}" en la fecha ${selectedReserva?.fecha}?`
            : modalAction === 'Rechazada'
            ? `¿Desea rechazar esta solicitud? Tenga en cuenta que según la regla RN-06, una reserva rechazada no podrá modificarse posteriormente.`
            : `¿Desea cancelar esta reserva ya aprobada?`
        }
        variant={modalAction === 'Aprobada' ? 'success' : 'danger'}
        confirmText={
          modalAction === 'Aprobada'
            ? 'Sí, Aprobar'
            : modalAction === 'Rechazada'
            ? 'Sí, Rechazar'
            : 'Sí, Cancelar'
        }
      >
        <div className="mt-3">
          <TextInput
            label="Observación / Motivo administrativo"
            placeholder={
              modalAction === 'Rechazada'
                ? 'Ej. Conflicto con evento institucional'
                : 'Opcional (Ej. Verificado por decanatura)'
            }
            value={observacion}
            onChange={(e) => setObservacion(e.target.value)}
            required={modalAction === 'Rechazada'}
          />
        </div>
      </ModalConfirmacion>

      {/* Modal Detalle de Reserva (RF-06) */}
      {detailReserva && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-800 text-base">Detalle de la Reserva</h3>
              <button
                onClick={() => setDetailReserva(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Ambiente</p>
                  <p className="font-bold text-slate-800">{detailReserva.ambienteNombre}</p>
                  <p className="text-xs text-slate-500">{detailReserva.ambienteTipo} - {detailReserva.ambienteUbicacion}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Estado</p>
                  <div className="mt-1">{getStatusBadge(detailReserva.estado)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t pt-3">
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Fecha</p>
                  <p className="font-mono font-medium text-slate-800">{detailReserva.fecha}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Horario</p>
                  <p className="font-mono font-medium text-slate-800">
                    {detailReserva.horaInicio.slice(0, 5)} - {detailReserva.horaFin.slice(0, 5)}
                  </p>
                </div>
              </div>

              <div className="border-t pt-3">
                <p className="text-xs text-slate-400 font-semibold uppercase">Solicitante</p>
                <p className="font-semibold text-slate-800">{detailReserva.usuarioNombre}</p>
                <p className="text-xs text-slate-500">{detailReserva.usuarioCorreo}</p>
              </div>

              <div className="border-t pt-3">
                <p className="text-xs text-slate-400 font-semibold uppercase">Motivo de Reserva</p>
                <p className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200 mt-1">
                  {detailReserva.motivo}
                </p>
              </div>

              {detailReserva.observacionAdmin && (
                <div className="border-t pt-3">
                  <p className="text-xs text-slate-400 font-semibold uppercase">Observación Administrativa</p>
                  <p className="text-rose-800 bg-rose-50 p-2.5 rounded-lg border border-rose-200 mt-1">
                    {detailReserva.observacionAdmin}
                  </p>
                </div>
              )}
            </div>

            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setDetailReserva(null)}>
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
