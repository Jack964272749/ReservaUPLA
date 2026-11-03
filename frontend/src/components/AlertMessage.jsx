import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export default function AlertMessage({
  type = 'info', // success, error, warning, info
  message,
  onClose,
  className = '',
}) {
  if (!message) return null;

  const config = {
    success: {
      bg: 'bg-emerald-50 border-emerald-300 text-emerald-800',
      icon: <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
    },
    error: {
      bg: 'bg-rose-50 border-rose-300 text-rose-800',
      icon: <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />,
    },
    warning: {
      bg: 'bg-amber-50 border-amber-300 text-amber-800',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />,
    },
    info: {
      bg: 'bg-sky-50 border-sky-300 text-sky-800',
      icon: <Info className="w-5 h-5 text-sky-600 flex-shrink-0" />,
    },
  }[type];

  return (
    <div className={`flex items-start gap-3 p-3.5 rounded-lg border text-sm ${config.bg} ${className}`}>
      {config.icon}
      <div className="flex-1 font-medium">{message}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
