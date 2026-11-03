import React from 'react';

// Trazabilidad: Nielsen H1 (Visibilidad del estado), H4 (Consistencia), H5 (Prevención de errores) · Shneiderman S1, S3 · ISO 9241-11
export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // primary, secondary, danger, success, outline
  size = 'md', // sm, md, lg
  disabled = false,
  loading = false,
  icon: Icon,
  className = '',
  ariaLabel,
  motivoDeshabilitado,
}) {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none min-h-[44px]';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-5 py-3 text-base gap-2.5',
  };

  const variantClasses = {
    primary:
      'bg-sky-700 hover:bg-sky-800 active:bg-sky-900 text-white focus:ring-sky-600 shadow-sky-700/20 dark:bg-sky-600 dark:hover:bg-sky-700',
    secondary:
      'bg-slate-700 hover:bg-slate-800 active:bg-slate-900 text-white focus:ring-slate-600 dark:bg-slate-600 dark:hover:bg-slate-500',
    success:
      'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white focus:ring-emerald-500 shadow-emerald-600/20',
    danger:
      'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white focus:ring-rose-500 shadow-rose-600/20',
    outline:
      'border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 focus:ring-slate-400',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
      aria-label={ariaLabel}
      title={disabled && motivoDeshabilitado ? motivoDeshabilitado : undefined}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {loading ? (
        <>
          <span
            className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-1"
            aria-hidden="true"
          />
          <span className="sr-only">Cargando...</span>
        </>
      ) : (
        Icon && <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
      )}
      {children}
    </button>
  );
}
