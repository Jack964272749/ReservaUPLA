import React from 'react';
import { HelpCircle, X, Clock, ShieldCheck, AlertCircle, Phone } from 'lucide-react';

// Trazabilidad: Nielsen H10 (Ayuda y documentación) · Shneiderman S8 (Reducir carga cognitiva) · ISO 9241-11
export default function PanelAyuda({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      role="presentation"
    >
      <div
        id="panel-ayuda-contenido"
        role="dialog"
        aria-modal="true"
        aria-labelledby="panel-ayuda-titulo"
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto border border-slate-200 dark:border-slate-700 p-6"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2.5 text-sky-700 dark:text-sky-400">
            <HelpCircle className="w-6 h-6" aria-hidden="true" />
            <h2 id="panel-ayuda-titulo" className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Guía de Uso del Sistema ReservaUPLA
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar panel de ayuda"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4 text-sm text-slate-600 dark:text-slate-300">
          <section className="space-y-2">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-sky-600" aria-hidden="true" />
              Horarios permitidos para reservas (RN-04)
            </h3>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 pl-6">
              Las reservas se pueden realizar exclusivamente de <strong>07:00 a 22:00</strong> horas.
              La hora de fin debe ser estrictamente posterior a la hora de inicio (RN-03).
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2 text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" aria-hidden="true" />
              Roles y permisos del sistema
            </h3>
            <ul className="text-xs list-disc list-inside space-y-1 text-slate-500 dark:text-slate-400 pl-6">
              <li><strong>Solicitante:</strong> Registra solicitudes de reserva y consulta su estado propio.</li>
              <li><strong>Responsable:</strong> Consulta las reservas programadas en sus ambientes asignados.</li>
              <li><strong>Administrador:</strong> Aprueba o rechaza solicitudes (RN-05) y gestiona los ambientes institucionales.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4 text-amber-600" aria-hidden="true" />
              Reglas de modificación y cancelación (RN-01, RN-06)
            </h3>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 pl-6">
              No puede existir más de una reserva aprobada para el mismo ambiente, fecha y rango de horas.
              Una reserva rechazada no puede volver a modificarse.
            </p>
          </section>

          <section className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-slate-600 dark:text-slate-400" aria-hidden="true" />
              Soporte institucional UPLA
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 pl-6">
              Oficina de Tecnologías de la Información · Campus Chorrillos, Huancayo · otic@upla.edu.pe
            </p>
          </section>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 min-h-[44px]"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
