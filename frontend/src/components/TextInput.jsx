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
  bloquearMostrarClave = false,
}) {
  const [mostrarClave, setMostrarClave] = useState(false);
  const tipoEfectivo = type === 'password' && mostrarClave && !bloquearMostrarClave ? 'text' : type;
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
      <div className="relative w-full h-11">
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
          className={`w-full h-11 px-3.5 py-2 text-sm rounded-xl border transition-colors shadow-sm focus:outline-none focus:ring-2 ${
            mostrarAlternarClave && type === 'password' ? 'pr-12' : ''
          } ${
            error
              ? 'border-rose-500 focus:border-rose-600 focus:ring-rose-200 dark:focus:ring-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 text-slate-900 dark:text-slate-100'
              : 'border-slate-200 dark:border-slate-600 focus:border-sky-500 focus:ring-sky-200 dark:focus:ring-sky-900/40 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
          } ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-100 dark:bg-slate-900' : ''}`}
        />
        {type === 'password' && mostrarAlternarClave && (
          <button
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (bloquearMostrarClave) return;
              setMostrarClave((prev) => !prev);
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            disabled={bloquearMostrarClave || disabled}
            aria-label={
              bloquearMostrarClave
                ? 'Contraseña protegida para acceso de demostración'
                : mostrarClave
                ? 'Ocultar contraseña'
                : 'Mostrar contraseña'
            }
            title={
              bloquearMostrarClave
                ? 'Por seguridad, las credenciales de demostración no pueden visualizarse en texto plano'
                : mostrarClave
                ? 'Ocultar contraseña'
                : 'Mostrar contraseña'
            }
            aria-pressed={mostrarClave}
            className={`btn-estatico absolute right-2 top-1.5 h-8 w-8 flex items-center justify-center rounded-lg select-none pointer-events-auto ${
              bloquearMostrarClave
                ? 'opacity-40 cursor-not-allowed text-slate-400 dark:text-slate-500'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer'
            }`}
          >
            {mostrarClave && !bloquearMostrarClave ? (
              <EyeOff className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            ) : (
              <Eye className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            )}
          </button>
        )}
      </div>
    </Campo>
  );
}
