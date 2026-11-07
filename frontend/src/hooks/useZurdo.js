import { useState, useEffect } from 'react';

const CLAVE = 'upla_modo_zurdo';

// Trazabilidad: Nielsen H7 (Flexibilidad y eficiencia) · ISO 9241-110 (Adaptabilidad) · Accesibilidad para personas zurdas
// Recuerda si el usuario prefiere el formulario de inicio de sesión en el lado izquierdo.
export function useZurdo() {
  const [zurdo, setZurdo] = useState(() => {
    try {
      return localStorage.getItem(CLAVE) === '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, zurdo ? '1' : '0');
    } catch {
      // Ignorar fallo de acceso a storage
    }
  }, [zurdo]);

  return { zurdo, alternarZurdo: () => setZurdo((v) => !v) };
}
