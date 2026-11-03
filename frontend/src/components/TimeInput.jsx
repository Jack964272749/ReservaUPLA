import React from 'react';

export default function TimeInput({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  min = "07:00",
  max = "22:00",
  disabled = false,
  helperText,
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-1">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <input
        type="time"
        name={name}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step="900"
        disabled={disabled}
        className={`w-full px-3.5 py-2 text-sm rounded-lg border transition-colors shadow-sm focus:outline-none focus:ring-2 ${
          error
            ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/30'
            : 'border-slate-300 focus:border-sky-500 focus:ring-sky-100 bg-white'
        } ${disabled ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'text-slate-800'}`}
      />
      {error && <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>}
      {!error && helperText && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
    </div>
  );
}
