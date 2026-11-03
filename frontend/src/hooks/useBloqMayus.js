import { useState } from 'react';

// Trazabilidad: Nielsen H5 - Prevención de errores · Aviso de Bloq Mayús activo
export function useBloqMayus() {
  const [bloqMayusActivo, setBloqMayusActivo] = useState(false);

  const verificarBloqMayus = (evento) => {
    if (evento.getModifierState) {
      setBloqMayusActivo(evento.getModifierState('CapsLock'));
    }
  };

  return { bloqMayusActivo, verificarBloqMayus };
}
