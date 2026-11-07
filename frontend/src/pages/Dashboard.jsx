import React from 'react';
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  Building2,
  RefreshCw,
  ArrowRight,
  Monitor,
  TrendingUp,
  PieChart,
  CalendarCheck,
  User,
} from 'lucide-react';
import CardIndicador from '../components/CardIndicador';
import Button from '../components/Button';
import AlertMessage from '../components/AlertMessage';
import FondoModulo from '../components/FondoModulo';
import { useDashboard } from '../hooks/useDashboard';

// Trazabilidad: RF-08 · Nielsen H1 (Visibilidad del estado del sistema), H8 · Shneiderman S1, S3
export default function Dashboard({ alIrAReservas, alIrANuevaReserva, alIrAAmbientes }) {
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

  const tiposNombres = {
    LaboratorioComputo: 'Laboratorio de Cómputo',
    Auditorio: 'Auditorio',
    SalaReuniones: 'Sala de Reuniones',
    LaboratorioEspecializado: 'Laboratorio Especializado',
  };

  const reservasPorTipo = indicadores?.reservasPorTipo || {};
  const totalTipo = Object.values(reservasPorTipo).reduce((acc, val) => acc + val, 0);

  const reservasHoy = indicadores?.reservasHoy || [];
  const tasaAprobacion = indicadores?.tasaAprobacion ?? 0;

  const fechaHoyFormateada = new Intl.DateTimeFormat('es-PE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'America/Lima',
  }).format(new Date());

  const badgeEstado = (estado) => {
    const config = {
      Aprobada: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300',
      Pendiente: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300',
      Rechazada: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300',
      Cancelada: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300',
    }[estado] || 'bg-slate-100 text-slate-800';

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${config}`}>
        {estado}
      </span>
    );
  };

  return (
    <FondoModulo
      imagen="/backgrounds/bg_dashboard.jpg"
      className="rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl p-6 sm:p-8 lg:p-10 transition-all"
    >
      <div className="relative z-10 space-y-6">
        {/* Cabecera del Dashboard */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-300/70 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100/90 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 border border-sky-300/60 dark:border-sky-800 backdrop-blur-sm shadow-xs">
                <Monitor className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Facultad de Ingeniería · Laboratorios y Ambientes</span>
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Panel de Control Institucional
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium">
              Resumen estadístico y estado general del uso de ambientes universitarios en tiempo real.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={recargar}
              icon={RefreshCw}
              ariaLabel="Actualizar indicadores"
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-xs hover:bg-white dark:hover:bg-slate-800"
            >
              Actualizar
            </Button>
            {alIrANuevaReserva && (
              <Button
                variant="primary"
                size="sm"
                onClick={alIrANuevaReserva}
                className="shadow-md"
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

        {/* 10. Indicadores mínimos del dashboard (Caso Práctico UPLA) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
          <CardIndicador
            titulo="Total de reservas"
            valor={indicadores?.totalReservas ?? 0}
            descripcion="Cantidad total de reservas registradas."
            icon={CalendarDays}
            color="sky"
            className="lg:col-span-2"
          />
          <CardIndicador
            titulo="Reservas pendientes"
            valor={indicadores?.reservasPendientes ?? 0}
            descripcion="Cantidad de reservas en espera de aprobación."
            icon={Clock}
            color="amber"
            className="lg:col-span-2"
          />
          <CardIndicador
            titulo="Reservas aprobadas"
            valor={indicadores?.reservasAprobadas ?? 0}
            descripcion="Cantidad de reservas aprobadas."
            icon={CheckCircle2}
            color="emerald"
            className="sm:col-span-2 lg:col-span-2"
          />
          <CardIndicador
            titulo="Reservas rechazadas"
            valor={indicadores?.reservasRechazadas ?? 0}
            descripcion="Cantidad de reservas rechazadas."
            icon={XCircle}
            color="rose"
            className="lg:col-span-3"
          />
          <CardIndicador
            titulo="Ambiente más utilizado"
            valor={indicadores?.ambienteMasUtilizado || 'Sin registros'}
            descripcion="Ambiente con mayor número de reservas."
            icon={Building2}
            color="indigo"
            className="sm:col-span-2 lg:col-span-3"
            onClick={
              alIrAAmbientes && indicadores?.ambienteMasUtilizado
                ? () => alIrAAmbientes(indicadores.ambienteMasUtilizado)
                : undefined
            }
            pista="Ver en Ambientes"
          />
        </div>

        {/* Sección de Analítica Avanzada y Operaciones del Campus */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Columna Izquierda: Efectividad Académica y Distribución de Demanda */}
          <div className="lg:col-span-7 space-y-6">
            {/* Banner Destacado: Ambiente con Mayor Demanda Académica */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-950/95 via-sky-900/90 to-indigo-950/95 backdrop-blur-md text-white shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 border border-sky-700/50">
              <div className="flex items-start gap-4">
                <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-sky-300 flex-shrink-0 shadow-inner">
                  <Building2 className="w-7 h-7" aria-hidden="true" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                    Ambiente con mayor número de reservas
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold mt-0.5 text-white drop-shadow-sm">
                    {indicadores?.ambienteMasUtilizado || 'Sin registros suficientes'}
                  </h2>
                  <p className="text-xs sm:text-sm text-sky-200/90 mt-1 font-medium">
                    {indicadores?.cantidadAmbienteMasUtilizado
                      ? `${indicadores.cantidadAmbienteMasUtilizado} reservas registradas en total.`
                      : 'Aún no se registran reservas para determinar el ambiente más utilizado.'}
                  </p>
                </div>
              </div>

              {alIrAReservas && (
                <button
                  type="button"
                  onClick={alIrAReservas}
                  className="inline-flex items-center justify-center gap-2 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl bg-white hover:bg-sky-50 text-sky-950 shadow-md transition-all flex-shrink-0 min-h-[44px] cursor-pointer"
                >
                  <span>Ver todas</span>
                  <ArrowRight className="w-4 h-4 text-sky-900" aria-hidden="true" />
                </button>
              )}
            </div>

            {/* Tarjeta de Tasa de Aprobación y Demanda por Tipo */}
            <div className="p-6 rounded-2xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/70 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                    Tasa de Aprobación Académica
                  </h3>
                </div>
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                  {tasaAprobacion}%
                </span>
              </div>

              {/* Barra de progreso */}
              <div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-sky-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(0, tasaAprobacion))}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
                  {indicadores?.reservasAprobadas ?? 0} de {indicadores?.totalReservas ?? 0} reservas aprobadas sin cruces horarios.
                </p>
              </div>

              {/* Desglose de Uso por Tipo de Ambiente */}
              <div className="pt-2 space-y-3">
                <div className="flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Demanda por Tipo de Ambiente
                  </h4>
                </div>

                <div className="space-y-2">
                  {Object.entries(tiposNombres).map(([key, nombreLegible]) => {
                    const cant = reservasPorTipo[key] || 0;
                    const pct = totalTipo > 0 ? Math.round((cant / totalTipo) * 100) : 0;

                    return (
                      <div key={key} className="space-y-1">
                        <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
                          <span>{nombreLegible}</span>
                          <span className="font-semibold text-slate-900 dark:text-slate-100">
                            {cant} ({pct}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-sky-600 dark:bg-sky-400 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Agenda del Día (Hora de Lima UTC-5) */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-2xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-sm h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/70 dark:border-slate-800 mb-4">
                  <div className="flex items-center gap-2">
                    <CalendarCheck className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                        Agenda Académica de Hoy
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 capitalize">
                        {fechaHoyFormateada}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-300">
                    {reservasHoy.length} en agenda
                  </span>
                </div>

                {reservasHoy.length === 0 ? (
                  <div className="py-10 text-center space-y-2">
                    <Clock className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                      No hay reservas programadas para la fecha de hoy.
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Horario operativo de 07:00 a 22:00 horas (Lima UTC-5).
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reservasHoy.map((r) => (
                      <div
                        key={r.id}
                        className="p-3 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-2xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-sky-700 dark:text-sky-300 font-mono">
                            {r.horaInicio} - {r.horaFin}
                          </span>
                          {badgeEstado(r.estado)}
                        </div>
                        <p className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                          {r.nombreAmbiente}
                        </p>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                          <User className="w-3 h-3 text-slate-400" />
                          <span className="truncate">{r.nombreSolicitante}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {alIrAReservas && (
                <div className="pt-4 mt-4 border-t border-slate-200/70 dark:border-slate-800">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-center"
                    onClick={alIrAReservas}
                  >
                    Ver calendario completo de reservas
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </FondoModulo>
  );
}
