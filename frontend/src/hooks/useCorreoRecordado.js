import { useState } from 'react';

// Trazabilidad: ISO 9241-11 Eficiencia · Recordar únicamente el correo institucional
export function useCorreoRecordado() {
  const [correoRecordado, setCorreoRecordado] = useState(() => {
    try {
      return localStorage.getItem('upla_correo_rec') || '';
    } catch {
      return '';
    }
  });

  const guardarCorreo = (correo, recordar) => {
    try {
      if (recordar && correo) {
        localStorage.setItem('upla_correo_rec', correo.trim().toLowerCase());
        setCorreoRecordado(correo.trim().toLowerCase());
      } else {
        localStorage.removeItem('upla_correo_rec');
        setCorreoRecordado('');
      }
    } catch {
      // Almacenamiento seguro
    }
  };

  return { correoRecordado, guardarCorreo };
}
