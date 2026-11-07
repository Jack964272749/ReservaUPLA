// Trazabilidad: Nielsen H4 (Consistencia) · Shneiderman S1 (Consistencia)
// Estilos únicos para los botones de acción de todos los módulos: neutro (ver/editar), verde (aprobar/activar),
// azul (reservar) y rojo (rechazar/desactivar/cancelar).
export const BASE =
  'inline-flex items-center justify-center gap-1.5 px-3 rounded-xl border text-xs font-semibold min-h-[44px] sm:min-h-[40px] whitespace-nowrap transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1';

export const ESTILOS = {
  ver: 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 dark:hover:border-sky-700 dark:hover:bg-sky-950/30 dark:hover:text-sky-300 focus-visible:ring-sky-400',
  reservar:
    'border-sky-300 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-950/60 focus-visible:ring-sky-500',
  aprobar:
    'border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 focus-visible:ring-emerald-500',
  rechazar:
    'border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-950/60 focus-visible:ring-rose-500',
  cancelar:
    'border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-950/60 focus-visible:ring-rose-500',
};

export const DESHABILITADO =
  'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none';
