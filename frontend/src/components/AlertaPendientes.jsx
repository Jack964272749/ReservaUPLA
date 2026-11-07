import React, { useEffect, useRef, useState } from 'react';
import { BellRing, Clock, User, X } from 'lucide-react';
import { reservaService } from '../services/reservaService';
import Button from './Button';

const MAXIMO_VISIBLE = 5;
const UN_DIA_MS = 24 * 60 * 60 * 1000;

const formatearRegistro = (iso) =>
  new Date(iso).toLocaleString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

// Trazabilidad: RF-07 · RN-05 · Nielsen H1 (Visibilidad del estado) · Shneiderman S3 (Retroalimentación informativa)
// Al entrar, avisa al Administrador de las reservas pendientes de aprobación (las más recientes primero).
export default function AlertaPendientes({ alRevisar }) {
  const [visible, setVisible] = useState(false);
  const [pendientes, setPendientes] = useState([]);
  const [total, setTotal] = useState(0);
  const botonRef = useRef(null);

  useEffect(() => {
    let montado = true;
    (async () => {
      const res = await reservaService.listar({ estado: 'Pendiente', pagina: 1, tamanoPagina: 50 });
      if (!montado || !res.exito || !res.datos || !(res.datos.totalItems > 0)) return;
      const ordenadas = [...res.datos.items].sort(
        (a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro)
      );
      setPendientes(ordenadas);
      setTotal(res.datos.totalItems);
      setVisible(true);
    })();
    return () => {
      montado = false;
    };
  }, []);

  useEffect(() => {
    if (!visible) return undefined;
    if (botonRef.current) botonRef.current.focus();
    const alTeclear = (e) => {
      if (e.key === 'Escape') setVisible(false);
    };
    window.addEventListener('keydown', alTeclear);
    return () => window.removeEventListener('keydown', alTeclear);
  }, [visible]);

  if (!visible) return null;

  const cerrar = () => setVisible(false);
  const revisar = () => {
    setVisible(false);
    if (alRevisar) alRevisar();
  };
  const ahora = Date.now();
  const restantes = total - Math.min(pendientes.length, MAXIMO_VISIBLE);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-ayuda-fondo"
      onClick={cerrar}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="alerta-pendientes-titulo"
        aria-describedby="alerta-pendientes-descripcion"
        onClick={(e) => e.stopPropagation()}
        className="animate-ayuda-caer w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden"
      >
        <div className="flex items-start gap-3 p-5 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-900/60">
          <span className="flex-shrink-0 w-11 h-11 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 flex items-center justify-center">
            <BellRing className="w-5 h-5" aria-hidden="true" />
          </span>
          <div className="flex-1 min-w-0">
            <h2
              id="alerta-pendientes-titulo"
              className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight"
            >
              Reservas pendientes por revisar
            </h2>
            <p
              id="alerta-pendientes-descripcion"
              className="mt-1 text-sm text-slate-600 dark:text-slate-300"
            >
              {total === 1
                ? 'Hay 1 solicitud esperando su aprobación.'
                : `Hay ${total} solicitudes esperando su aprobación.`}
            </p>
          </div>
          <button
            type="button"
            onClick={cerrar}
            aria-label="Cerrar alerta"
            className="p-2 -m-1 rounded-lg text-slate-500 hover:bg-amber-100 dark:hover:bg-amber-900/40 min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <ul className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {pendientes.slice(0, MAXIMO_VISIBLE).map((r) => {
            const esNueva = ahora - new Date(r.fechaRegistro).getTime() < UN_DIA_MS;
            return (
              <li key={r.id} className="px-5 py-3.5">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    {r.ambienteNombre}
                  </p>
                  {esNueva && (
                    <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                      Nueva
                    </span>
                  )}
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" aria-hidden="true" />
                  {r.fecha} · {r.horaInicio} – {r.horaFin}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <User className="w-3.5 h-3.5" aria-hidden="true" />
                  {r.solicitanteNombre} · registrada el {formatearRegistro(r.fechaRegistro)}
                </p>
              </li>
            );
          })}
        </ul>

        {restantes > 0 && (
          <p className="px-5 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800">
            y {restantes} más en el listado de reservas.
          </p>
        )}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 p-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" onClick={cerrar}>
            Cerrar
          </Button>
          <button
            ref={botonRef}
            type="button"
            onClick={revisar}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold min-h-[44px] text-white bg-gradient-to-r from-sky-500 to-sky-700 hover:from-sky-600 hover:to-sky-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
          >
            Revisar pendientes
          </button>
        </div>
      </div>
    </div>
  );
}
