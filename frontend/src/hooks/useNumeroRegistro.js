import { useState, useEffect } from 'react';
import { reservaService } from '../services/reservaService';

// Trazabilidad: RF-05 · Nielsen H6 (Reconocer antes que recordar)
// Numera cada reserva según su orden de registro: la más reciente es la N° 1 y la primera registrada,
// la de número más alto. El listado se ordena igual, así la numeración se lee de arriba abajo.
export function useNumeroRegistro(activo, version) {
  const [numeros, setNumeros] = useState({});

  useEffect(() => {
    if (!activo) return undefined;
    let montado = true;

    (async () => {
      const todas = [];
      let pagina = 1;
      let totalPaginas = 1;
      do {
        const res = await reservaService.listar({ pagina, tamanoPagina: 50 });
        if (!res.exito || !res.datos) break;
        todas.push(...res.datos.items);
        totalPaginas = res.datos.totalPaginas || 1;
        pagina += 1;
      } while (pagina <= totalPaginas && pagina <= 40);

      if (!montado) return;
      todas.sort(
        (a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro) || b.id.localeCompare(a.id)
      );
      setNumeros(Object.fromEntries(todas.map((r, i) => [r.id, i + 1])));
    })();

    return () => {
      montado = false;
    };
  }, [activo, version]);

  return numeros;
}
