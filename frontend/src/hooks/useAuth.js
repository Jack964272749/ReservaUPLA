import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Trazabilidad: Nielsen H1 (Visibilidad del estado del sistema) · ISO 9241-11
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
}
