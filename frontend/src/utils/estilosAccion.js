// Trazabilidad: Nielsen H4 (Consistencia) · Shneiderman S1 (Consistencia)
// Estilos únicos para los botones de acción de todos los módulos: neutro/rol (ver), verde (aprobar/activar),
// azul (reservar) y rojo (rechazar/desactivar/cancelar).
export const BASE =
  'inline-flex items-center justify-center gap-1.5 px-3 rounded-xl border text-xs font-semibold min-h-[44px] sm:min-h-[40px] whitespace-nowrap transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1';

// Estilos adaptados del botón "Ver" según el rol activo para identidad visual coordinada
export const ESTILOS_VER_POR_ROL = {
  Administrador:
    'border-indigo-300 dark:border-indigo-700/80 bg-indigo-50/90 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 hover:border-indigo-400 focus-visible:ring-indigo-500 shadow-xs',
  Responsable:
    'border-amber-300 dark:border-amber-700/80 bg-amber-50/90 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 hover:border-amber-400 focus-visible:ring-amber-500 shadow-xs',
  Solicitante:
    'border-sky-300 dark:border-sky-700/80 bg-sky-50/90 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/60 hover:border-sky-400 focus-visible:ring-sky-500 shadow-xs',
};

export const ESTILOS = {
  ver: ESTILOS_VER_POR_ROL.Solicitante,
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
