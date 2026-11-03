import React from 'react';
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  Building2,
  RefreshCw,
} from 'lucide-react';
import CardIndicador from '../components/CardIndicador';
import Button from '../components/Button';
import AlertMessage from '../components/AlertMessage';
import { useDashboard } from '../hooks/useDashboard';

// Trazabilidad: RF-08 · Nielsen H1 (Visibilidad del estado del sistema), H8 · Shneiderman S1, S3
export default function Dashboard({ alIrAReservas, alIrANuevaReserva }) {
  const { indicadores, cargando, error, recargar } = useDashboard();

  if (cargando) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="p-16 text-center text-slate-500 dark:text-slate-400"
      >
        <span
          className="inline-block animate-spin rounded-full h-8 w-8 border-3 border-sky-600 border-t-transparent mb-3"
          aria-hidden="true"
        />
        <p className="text-sm font-medium">Cargando indicadores del dashboard…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            Panel de Control Institucional
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Resumen estadístico y estado general del uso de ambientes universitarios.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={recargar}
            icon={RefreshCw}
            ariaLabel="Actualizar indicadores"
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

      {/* Grid de Tarjetas KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <CardIndicador
          titulo="Total de Reservas"
          valor={indicadores?.totalReservas ?? 0}
          descripcion="Histórico registrado en el sistema"
          icon={CalendarDays}
          color="sky"
        />
        <CardIndicador
          titulo="Reservas Pendientes"
          valor={indicadores?.reservasPendientes ?? 0}
          descripcion="En espera de aprobación administrativa"
          icon={Clock}
          color="amber"
        />
        <CardIndicador
          titulo="Reservas Aprobadas"
          valor={indicadores?.reservasAprobadas ?? 0}
          descripcion="Confirmadas sin cruces horarios"
          icon={CheckCircle2}
          color="emerald"
        />
        <CardIndicador
          titulo="Reservas Rechazadas"
          valor={indicadores?.reservasRechazadas ?? 0}
          descripcion="Rechazadas por la administración"
          icon={XCircle}
          color="rose"
        />
      </div>

      {/* Tarjeta de Ambiente Más Utilizado */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-900 via-sky-800 to-indigo-900 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-sky-200 flex-shrink-0">
            <Building2 className="w-8 h-8" aria-hidden="true" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-300">
              Ambiente de Mayor Demanda Académica
            </span>
            <h2 className="text-2xl font-bold mt-1 text-white">
              {indicadores?.ambienteMasUtilizado || 'Sin registros suficientes'}
            </h2>
            <p className="text-xs sm:text-sm text-sky-200/80 mt-1">
              {indicadores?.cantidadAmbienteMasUtilizado
                ? `${indicadores.cantidadAmbienteMasUtilizado} reservas aprobadas acumuladas.`
                : 'Aún no se registran reservas aprobadas para determinar el ambiente líder.'}
            </p>
          </div>
        </div>

        {alIrAReservas && (
          <Button
            variant="outline"
            size="md"
            onClick={alIrAReservas}
            className="border-white/30 text-white hover:bg-white/10 bg-transparent flex-shrink-0"
          >
            Ver todas las reservas
          </Button>
        )}
      </div>
    </div>
  );
}
