import React from 'react';
import { Eye, Check, X, Ban } from 'lucide-react';
import { BASE, ESTILOS, ESTILOS_VER_POR_ROL } from '../utils/estilosAccion';

// Trazabilidad: RF-06, RF-07 · RN-05, RN-06 · Nielsen H4 (Consistencia), H6 (Reconocer antes que recordar), H8 · Shneiderman S1, S7
// Acciones de una reserva con texto + ícono, cuadrícula de alineación vertical fija y centrado armónico bajo la columna Acciones.
export default function AccionesReserva({ reserva, rol, onVer, onAccion }) {
  const puedeResolver = rol === 'Administrador' && reserva.estado === 'Pendiente'; // RN-05
  // El Administrador solo aprueba o rechaza (RN-05); la cancelación la realiza el Solicitante sobre sus reservas
  const puedeCancelar =
    rol === 'Solicitante' &&
    reserva.estado !== 'Rechazada' && // RN-06
    reserva.estado !== 'Cancelada';
  const nombre = reserva.solicitanteNombre || 'el solicitante';

  // Color de identidad visual diferenciado por rol para el botón "Ver"
  const estiloVer = ESTILOS_VER_POR_ROL[rol] || ESTILOS_VER_POR_ROL.Solicitante;

  // Cuadrícula fija para garantizar que todos los botones "Ver" queden en la misma línea vertical sin zig-zag
  const contenedorClases =
    rol === 'Administrador'
      ? 'flex items-center justify-start gap-2 w-[292px] mx-auto'
      : rol === 'Solicitante'
      ? 'flex items-center justify-start gap-2 w-[196px] mx-auto'
      : 'flex items-center justify-center gap-2 w-auto mx-auto';

  return (
    <div className={contenedorClases}>
      <button
        type="button"
        onClick={() => onVer(reserva)}
        aria-label={`Ver detalles de la reserva de ${nombre}`}
        title="Ver detalles"
        className={`${BASE} ${estiloVer} w-20 flex-shrink-0`}
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
            className={`${BASE} ${ESTILOS.aprobar} w-[96px] flex-shrink-0`}
          >
            <Check className="w-4 h-4" aria-hidden="true" />
            <span>Aprobar</span>
          </button>
          <button
            type="button"
            onClick={(e) => onAccion(reserva, 'Rechazada', e.currentTarget)}
            aria-label={`Rechazar reserva de ${nombre}`}
            title="Rechazar reserva"
            className={`${BASE} ${ESTILOS.rechazar} w-[100px] flex-shrink-0`}
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
          className={`${BASE} ${ESTILOS.cancelar} w-[104px] flex-shrink-0`}
        >
          <Ban className="w-4 h-4" aria-hidden="true" />
          <span>Cancelar</span>
        </button>
      )}
    </div>
  );
}
