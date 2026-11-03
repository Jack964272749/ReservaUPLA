import React, { forwardRef } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

// Trazabilidad: Nielsen H9 (Diagnosticar errores) · Shneiderman S3 (Feedback informativo), S5 (Manejo simple) · ISO 9241-11 (Eficacia)
const AlertMessage = forwardRef(function AlertMessage(
  {
    type = 'info', // success, error, warning, info
    message,
    onClose,
    className = '',
  },
  ref
) {
  if (!message) return null;

  const config = {
    success: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" aria-hidden="true" />,
    },
    error: {
      bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200',
      icon: <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0" aria-hidden="true" />,
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" aria-hidden="true" />,
    },
    info: {
      bg: 'bg-sky-50 dark:bg-sky-950/40 border-sky-300 dark:border-sky-800 text-sky-900 dark:text-sky-200',
      icon: <Info className="w-5 h-5 text-sky-600 dark:text-sky-400 flex-shrink-0" aria-hidden="true" />,
    },
  }[type];

  return (
    <div
      ref={ref}
      role="alert"
      aria-live="assertive"
      tabIndex={-1}
      className={`flex items-start gap-3 p-4 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 ${config.bg} ${className}`}
    >
      {config.icon}
      <div className="flex-1 font-medium">{message}</div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar notificación"
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 rounded-md min-h-[32px] min-w-[32px] flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
});

export default AlertMessage;
