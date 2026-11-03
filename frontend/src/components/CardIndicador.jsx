import React from 'react';

// Trazabilidad: Nielsen H1 (Visibilidad del estado del sistema) · Shneiderman S3 (Retroalimentación informativa)
export default function CardIndicador({
  titulo,
  valor,
  descripcion,
  icon: Icon,
  color = 'sky', // sky, amber, emerald, rose, purple
}) {
  const colorStyles = {
    sky: 'border-sky-500/20 bg-sky-50/50 dark:bg-sky-950/20 text-sky-700 dark:text-sky-300',
    amber: 'border-amber-500/20 bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300',
    emerald: 'border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300',
    rose: 'border-rose-500/20 bg-rose-50/50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300',
    purple: 'border-purple-500/20 bg-purple-50/50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300',
  }[color] || 'border-slate-500/20 bg-slate-50/50 text-slate-700';

  const iconBgStyles = {
    sky: 'bg-sky-600 text-white shadow-sky-600/30',
    amber: 'bg-amber-600 text-white shadow-amber-600/30',
    emerald: 'bg-emerald-600 text-white shadow-emerald-600/30',
    rose: 'bg-rose-600 text-white shadow-rose-600/30',
    purple: 'bg-purple-600 text-white shadow-purple-600/30',
  }[color] || 'bg-slate-600 text-white';

  return (
    <div
      role="status"
      aria-label={`${titulo}: ${valor}`}
      className={`p-5 rounded-xl border transition-all duration-150 shadow-sm flex items-start gap-4 ${colorStyles}`}
    >
      {Icon && (
        <div className={`p-3 rounded-lg shadow-md flex-shrink-0 ${iconBgStyles}`} aria-hidden="true">
          <Icon className="w-5 h-5" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
          {titulo}
        </p>
        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
          {valor}
        </p>
        {descripcion && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
            {descripcion}
          </p>
        )}
      </div>
    </div>
  );
}
