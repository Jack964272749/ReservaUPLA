import React, { useEffect, useRef } from 'react';
import { AlertCircle, X } from 'lucide-react';
import Button from './Button';

// Trazabilidad: Nielsen H3 (Control y libertad), H5 (Prevención de errores) · Shneiderman S4 (Cierre de diálogos), S5 · E-33
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
  triggerRef, // Ref to element that triggered the modal to return focus on close (E-33)
}) {
  const modalRef = useRef(null);
  const cancelBtnRef = useRef(null);

  // Focus trap + Escape listener (E-33)
  useEffect(() => {
    if (!isOpen) return;

    const modalElement = modalRef.current;
    if (!modalElement) return;

    const elementosEnfocables = modalElement.querySelectorAll(
      'button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const primerElemento = elementosEnfocables[0];
    const ultimoElemento = elementosEnfocables[elementosEnfocables.length - 1];

    // Foco inicial en cancelar (acción más segura)
    if (cancelBtnRef.current) {
      cancelBtnRef.current.focus();
    }

    const manejarTeclado = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (!loading) onClose();
      } else if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === primerElemento) {
            e.preventDefault();
            ultimoElemento?.focus();
          }
        } else {
          if (document.activeElement === ultimoElemento) {
            e.preventDefault();
            primerElemento?.focus();
          }
        }
      }
    };

    const elementoDisparador = triggerRef?.current;
    document.addEventListener('keydown', manejarTeclado);

    return () => {
      document.removeEventListener('keydown', manejarTeclado);
      // Retornar foco al elemento disparador (E-33)
      if (elementoDisparador) {
        elementoDisparador.focus();
      }
    };
  }, [isOpen, loading, onClose, triggerRef]);

  if (!isOpen) return null;

  const titleId = 'modal-confirmacion-titulo';
  const descId = 'modal-confirmacion-descripcion';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      role="presentation"
    >
      <div
        ref={modalRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-700"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-semibold">
            <AlertCircle
              className={`w-5 h-5 flex-shrink-0 ${
                variant === 'danger' ? 'text-rose-600' : 'text-sky-600'
              }`}
              aria-hidden="true"
            />
            <h2 id={titleId} className="text-base font-semibold">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Cerrar ventana de diálogo"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 py-4 text-slate-600 dark:text-slate-300 text-sm">
          <p id={descId} className="mb-3 font-normal">
            {message}
          </p>
          {children}
        </div>

        <div className="flex items-center justify-end gap-3 px-5 py-3.5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-700">
          <Button
            ref={cancelBtnRef}
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={variant}
            size="md"
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
