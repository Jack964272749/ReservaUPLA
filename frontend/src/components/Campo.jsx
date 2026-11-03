import React from 'react';

// Trazabilidad: Nielsen H4 (Consistencia y Estándares), H6 (Reconocimiento), H9 (Recuperar errores) · Shneiderman S1, S2 · ISO 9241-11
export default function Campo({
  id,
  label,
  obligatorio = false,
  ayuda,
  error,
  children,
  className = '',
}) {
  const ayudaId = ayuda ? `${id}-ayuda` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-semibold text-slate-700 dark:text-slate-200"
        >
          {label}{' '}
          {obligatorio && (
            <span className="text-xs font-normal text-rose-600 dark:text-rose-400" aria-hidden="true">
              (obligatorio)
            </span>
          )}
          {obligatorio && <span className="sr-only">obligatorio</span>}
        </label>
      )}

      {children}

      {ayuda && !error && (
        <p id={ayudaId} className="text-xs text-slate-500 dark:text-slate-400">
          {ayuda}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-xs font-medium text-rose-600 dark:text-rose-400 flex items-center gap-1"
        >
          <span aria-hidden="true">⚠</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
