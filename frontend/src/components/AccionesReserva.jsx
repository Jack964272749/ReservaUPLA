import React from 'react';
import { Eye, Check, X, Ban } from 'lucide-react';
import { BASE, ESTILOS } from '../utils/estilosAccion';

// Trazabilidad: RF-06, RF-07 · RN-05, RN-06 · Nielsen H4 (Consistencia), H6 (Reconocer antes que recordar), H8 · Shneiderman S1, S7
// Acciones de una reserva con texto + ícono, reutilizadas en la tabla y en la tarjeta móvil.
export default function AccionesReserva({ reserva, rol, onVer, onAccion }) {
  const puedeResolver = rol === 'Administrador' && reserva.estado === 'Pendiente'; // RN-05
  // El Administrador solo aprueba o rechaza (RN-05); la cancelación la realiza el Solicitante sobre sus reservas
  const puedeCancelar =
    rol === 'Solicitante' &&
    reserva.estado !== 'Rechazada' && // RN-06
    reserva.estado !== 'Cancelada';
  const sinAcciones = !puedeResolver && !puedeCancelar && rol !== 'Responsable';
  const nombre = reserva.solicitanteNombre || 'el solicitante';

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <button
        type="button"
        onClick={() => onVer(reserva)}
        aria-label={`Ver detalles de la reserva de ${nombre}`}
        title="Ver detalles"
        className={`${BASE} ${ESTILOS.ver}`}
      >
        <Eye className="w-4 h-4" aria-hidden="true" />
        <span>Ver</span>
      </button>

      {puedeResolver && (
        <>
          <button
            type="button"
            onClick={(e) => onAccion(reserva, 'Aprobada', e.currentTarget)}
            aria-label={`Aprobar reserva de ${nombre}`}
            title="Aprobar reserva"
            className={`${BASE} ${ESTILOS.aprobar}`}
          >
            <Check className="w-4 h-4" aria-hidden="true" />
            <span>Aprobar</span>
          </button>
          <button
            type="button"
            onClick={(e) => onAccion(reserva, 'Rechazada', e.currentTarget)}
            aria-label={`Rechazar reserva de ${nombre}`}
            title="Rechazar reserva"
            className={`${BASE} ${ESTILOS.rechazar}`}
          >
            <X className="w-4 h-4" aria-hidden="true" />
            <span>Rechazar</span>
          </button>
        </>
      )}

      {puedeCancelar && (
        <button
          type="button"
          onClick={(e) => onAccion(reserva, 'Cancelada', e.currentTarget)}
          aria-label={`Cancelar la reserva de ${nombre}`}
          title="Cancelar reserva"
          className={`${BASE} ${ESTILOS.cancelar}`}
        >
          <Ban className="w-4 h-4" aria-hidden="true" />
          <span>Cancelar</span>
        </button>
      )}

      {sinAcciones && (
        <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
          Sin acciones disponibles
        </span>
      )}
    </div>
  );
}
