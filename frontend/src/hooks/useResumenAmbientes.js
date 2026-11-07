import { useState, useEffect } from 'react';
import { ambienteService } from '../services/ambienteService';
import { reservaService } from '../services/reservaService';

// Trazabilidad: RF-05 · Actor Responsable de ambiente: "Consulta el uso del ambiente asignado"
// Obtiene los ambientes asignados al usuario y cuántas reservas tiene cada uno (total, aprobadas, pendientes).
export function useResumenAmbientes(activo, usuarioId) {
  const [ambientes, setAmbientes] = useState([]);
  const [resumen, setResumen] = useState({});
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (!activo || !usuarioId) return undefined;
    let montado = true;

    // Con tamanoPagina = 1 solo interesa el total que informa el backend
    const contar = async (ambienteId, estado) => {
      const res = await reservaService.listar({ ambienteId, estado, pagina: 1, tamanoPagina: 1 });
      return res.exito ? res.datos?.totalItems ?? 0 : 0;
    };

    (async () => {
      setCargando(true);
      const res = await ambienteService.listar();
      if (!montado) return;
      const mios =
        res.exito && Array.isArray(res.datos)
          ? res.datos.filter((a) => a.responsableId === usuarioId)
          : [];
      setAmbientes(mios);

      const entradas = await Promise.all(
        mios.map(async (a) => {
          const [total, aprobadas, pendientes] = await Promise.all([
            contar(a.id, undefined),
            contar(a.id, 'Aprobada'),
            contar(a.id, 'Pendiente'),
          ]);
          return [a.id, { total, aprobadas, pendientes }];
        })
      );
      if (!montado) return;
      setResumen(Object.fromEntries(entradas));
      setCargando(false);
    })();

    return () => {
      montado = false;
    };
  }, [activo, usuarioId]);

  return { ambientes, resumen, cargando };
}
