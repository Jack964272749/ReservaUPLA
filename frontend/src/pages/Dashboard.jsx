import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  Building,
  PlusCircle,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import CardIndicador from '../components/CardIndicador';
import Button from '../components/Button';
import AlertMessage from '../components/AlertMessage';
import TableList from '../components/TableList';
import { api } from '../services/api';

export default function Dashboard({ setActiveTab }) {
  const [indicadores, setIndicadores] = useState(null);
  const [recientes, setRecientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [indData, resData] = await Promise.all([
        api.getIndicadoresDashboard(),
        api.getReservas(),
      ]);
      setIndicadores(indData);
      setRecientes(resData.slice(0, 5));
    } catch (err) {
      setError('No se pudo conectar con el servidor backend. Verifique que la API esté iniciada.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getStatusBadge = (estado) => {
    const badges = {
      Aprobada: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      Pendiente: 'bg-amber-100 text-amber-800 border-amber-200',
      Rechazada: 'bg-rose-100 text-rose-800 border-rose-200',
      Cancelada: 'bg-slate-100 text-slate-700 border-slate-200',
    };
    return (
      <span
        className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
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
          <span className="font-semibold text-slate-800">{r.ambienteNombre}</span>
          <p className="text-xs text-slate-400">{r.ambienteUbicacion}</p>
        </div>
      ),
    },
    {
      header: 'Solicitante',
      render: (r) => (
        <div>
          <span className="text-slate-800">{r.usuarioNombre}</span>
          <p className="text-xs text-slate-400">{r.usuarioCorreo}</p>
        </div>
      ),
    },
    {
      header: 'Fecha',
      render: (r) => <span className="font-mono text-xs">{r.fecha}</span>,
    },
    {
      header: 'Horario',
      render: (r) => (
        <span className="font-mono text-xs text-slate-600">
          {r.horaInicio.slice(0, 5)} - {r.horaFin.slice(0, 5)}
        </span>
      ),
    },
    {
      header: 'Estado',
      align: 'center',
      render: (r) => getStatusBadge(r.estado),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header and Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard de Reservas</h1>
          <p className="text-sm text-slate-500">
            Indicadores en tiempo real y disponibilidad de ambientes de la Universidad.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={RefreshCw}
            onClick={fetchDashboardData}
            loading={loading}
          >
            Actualizar
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={PlusCircle}
            onClick={() => setActiveTab('nueva-reserva')}
          >
            Nueva Reserva
          </Button>
        </div>
      </div>

      {error && <AlertMessage type="error" message={error} onClose={() => setError(null)} />}

      {/* Indicadores Cards (RF-08) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <CardIndicador
          title="Total Reservas"
          value={loading ? '...' : indicadores?.totalReservas ?? 0}
          subtitle="Registradas en el sistema"
          icon={CalendarDays}
          variant="blue"
        />
        <CardIndicador
          title="Pendientes"
          value={loading ? '...' : indicadores?.reservasPendientes ?? 0}
          subtitle="En espera de aprobación"
          icon={Clock}
          variant="amber"
        />
        <CardIndicador
          title="Aprobadas"
          value={loading ? '...' : indicadores?.reservasAprobadas ?? 0}
          subtitle="Disponibilidad confirmada"
          icon={CheckCircle2}
          variant="green"
        />
        <CardIndicador
          title="Rechazadas"
          value={loading ? '...' : indicadores?.reservasRechazadas ?? 0}
          subtitle="Conflicto o no apto"
          icon={XCircle}
          variant="red"
        />
        <CardIndicador
          title="Ambiente Más Usado"
          value={loading ? '...' : indicadores?.ambienteMasUtilizado || 'N/A'}
          subtitle={`${indicadores?.totalAmbienteMasUtilizado ?? 0} reservas`}
          icon={Building}
          variant="purple"
        />
      </div>

      {/* Quick Overview & Recent Reservations */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Últimas Solicitudes Registradas</h2>
              <p className="text-xs text-slate-500">Visualice el estado de las reservas recientes</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab('reservas')}
            >
              Ver Todas las Reservas
            </Button>
          </div>

          <TableList
            columns={columns}
            data={recientes}
            loading={loading}
            emptyMessage="No hay reservas registradas en este momento."
          />
        </div>
      </div>
    </div>
  );
}
