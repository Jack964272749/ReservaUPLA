import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import Button from './Button';

export default function ModalConfirmacion({
  isOpen,
  onClose,
  onConfirm,
  title = '¿Confirmar acción?',
  message = '¿Está seguro de proceder con esta operación?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'primary', // primary, danger, success
  children,
  loading = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2 text-slate-800 font-semibold">
            <AlertCircle className={`w-5 h-5 ${variant === 'danger' ? 'text-rose-600' : 'text-sky-600'}`} />
            <span>{title}</span>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 py-4 text-slate-600 text-sm">
          <p className="mb-3">{message}</p>
          {children}
        </div>

        <div className="flex items-center justify-end gap-3 px-5 py-3.5 bg-slate-50 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button variant={variant} size="sm" onClick={onConfirm} loading={loading}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
