import React from 'react';
import { ArrowRight } from 'lucide-react';

// Trazabilidad: Nielsen H1 (Visibilidad del estado del sistema), H7 (Flexibilidad) · Shneiderman S3 (Retroalimentación informativa)
// Si recibe onClick se comporta como un botón (accesible por teclado) y muestra una pista de la acción.
export default function CardIndicador({
  titulo,
  valor,
  descripcion,
  icon: Icon,
  color = 'sky', // sky, amber, emerald, rose, purple, indigo
  onClick,
  pista,
  className = '',
}) {
  const colorStyles = {
    sky: 'border-sky-500/30 bg-white/85 dark:bg-slate-900/80 text-sky-700 dark:text-sky-300',
    amber: 'border-amber-500/30 bg-white/85 dark:bg-slate-900/80 text-amber-700 dark:text-amber-300',
    emerald: 'border-emerald-500/30 bg-white/85 dark:bg-slate-900/80 text-emerald-700 dark:text-emerald-300',
    rose: 'border-rose-500/30 bg-white/85 dark:bg-slate-900/80 text-rose-700 dark:text-rose-300',
    purple: 'border-purple-500/30 bg-white/85 dark:bg-slate-900/80 text-purple-700 dark:text-purple-300',
    indigo: 'border-indigo-500/30 bg-white/85 dark:bg-slate-900/80 text-indigo-700 dark:text-indigo-300',
  }[color] || 'border-slate-500/30 bg-white/85 dark:bg-slate-900/80 text-slate-700';

  const iconBgStyles = {
    sky: 'bg-sky-600 text-white shadow-sky-600/30',
    amber: 'bg-amber-600 text-white shadow-amber-600/30',
    emerald: 'bg-emerald-600 text-white shadow-emerald-600/30',
    rose: 'bg-rose-600 text-white shadow-rose-600/30',
    purple: 'bg-purple-600 text-white shadow-purple-600/30',
    indigo: 'bg-indigo-600 text-white shadow-indigo-600/30',
  }[color] || 'bg-slate-600 text-white';

  const esTextoLargo = typeof valor === 'string' && valor.length > 12;
  const Raiz = onClick ? 'button' : 'div';
  const propsRaiz = onClick
    ? { type: 'button', onClick, 'aria-label': `${titulo}: ${valor}. ${pista || 'Abrir'}` }
    : { role: 'status', 'aria-label': `${titulo}: ${valor}` };

  return (
    <Raiz
      {...propsRaiz}
      className={`p-5 rounded-2xl border backdrop-blur-md transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 flex items-start gap-4 w-full text-left ${
        onClick
          ? 'cursor-pointer hover:border-indigo-500/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500'
          : ''
      } ${colorStyles} ${className}`}
    >
      {Icon && (
        <div className={`p-3 rounded-xl shadow-md flex-shrink-0 ${iconBgStyles}`} aria-hidden="true">
          <Icon className="w-5 h-5" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 break-words">
          {titulo}
        </p>
        <p
          className={`text-slate-900 dark:text-slate-100 mt-1 break-words ${
            esTextoLargo
              ? 'text-lg sm:text-xl font-bold leading-snug'
              : 'text-2xl sm:text-3xl font-extrabold'
          }`}
          title={typeof valor === 'string' ? valor : undefined}
        >
          {valor}
        </p>
        {descripcion && (
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium break-words">
            {descripcion}
          </p>
        )}
        {pista && (
          <p className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-indigo-700 dark:text-indigo-300">
            {pista}
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </p>
        )}
      </div>
    </Raiz>
  );
}
