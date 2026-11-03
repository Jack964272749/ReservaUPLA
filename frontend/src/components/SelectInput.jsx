import React from 'react';
import Campo from './Campo';

// Trazabilidad: Nielsen H4 (Consistencia), H6 (Reconocimiento), H9 (Recuperar errores) · Shneiderman S1, S2 · ISO 9241-11
export default function SelectInput({
  id,
  name,
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Seleccione una opción',
  error,
  obligatorio = false,
  disabled = false,
  ayuda,
  className = '',
  selectRef,
}) {
  const descripcionId = error ? `${id}-error` : (ayuda ? `${id}-ayuda` : undefined);

  return (
    <Campo
      id={id}
      label={label}
      obligatorio={obligatorio}
      ayuda={ayuda}
      error={error}
      className={className}
    >
      <select
        ref={selectRef}
        id={id}
        name={name || id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={descripcionId}
        aria-required={obligatorio}
        className={`w-full min-h-[44px] px-3.5 py-2 text-sm rounded-lg border transition-all duration-150 shadow-sm focus:outline-none focus:ring-2 ${
          error
            ? 'border-rose-500 focus:border-rose-600 focus:ring-rose-200 dark:focus:ring-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 text-slate-900 dark:text-slate-100'
            : 'border-slate-300 dark:border-slate-600 focus:border-sky-600 focus:ring-sky-200 dark:focus:ring-sky-900/40 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100'
        } ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-100 dark:bg-slate-900' : ''}`}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </Campo>
  );
}
