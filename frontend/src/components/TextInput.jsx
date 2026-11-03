import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Campo from './Campo';

// Trazabilidad: Nielsen H3 (Libertad), H4 (Consistencia), H5 (Prevención de errores), H7 (Eficiencia) · Shneiderman S2 · ISO 9241-11
export default function TextInput({
  id,
  name,
  label,
  value,
  onChange,
  onKeyDown,
  placeholder,
  error,
  obligatorio = false,
  disabled = false,
  readOnly = false,
  type = 'text',
  ayuda,
  autoComplete,
  inputMode,
  autoFocus = false,
  maxLength,
  min,
  max,
  className = '',
  inputRef,
  mostrarAlternarClave = false,
}) {
  const [mostrarClave, setMostrarClave] = useState(false);
  const tipoEfectivo = type === 'password' && mostrarClave ? 'text' : type;
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
      <div className="relative w-full">
        <input
          ref={inputRef}
          id={id}
          name={name || id}
          type={tipoEfectivo}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          autoComplete={autoComplete}
          inputMode={inputMode}
          autoFocus={autoFocus}
          maxLength={maxLength}
          min={min}
          max={max}
          aria-invalid={Boolean(error)}
          aria-describedby={descripcionId}
          aria-required={obligatorio}
          className={`w-full min-h-[44px] px-3.5 py-2 text-sm rounded-lg border transition-all duration-150 shadow-sm focus:outline-none focus:ring-2 ${
            mostrarAlternarClave && type === 'password' ? 'pr-12' : ''
          } ${
            error
              ? 'border-rose-500 focus:border-rose-600 focus:ring-rose-200 dark:focus:ring-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 text-slate-900 dark:text-slate-100'
              : 'border-slate-300 dark:border-slate-600 focus:border-sky-600 focus:ring-sky-200 dark:focus:ring-sky-900/40 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100'
          } ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-100 dark:bg-slate-900' : ''}`}
        />
        {type === 'password' && mostrarAlternarClave && (
          <button
            type="button"
            onClick={() => setMostrarClave((prev) => !prev)}
            aria-label={mostrarClave ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            aria-pressed={mostrarClave}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 rounded-md"
          >
            {mostrarClave ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
    </Campo>
  );
}
