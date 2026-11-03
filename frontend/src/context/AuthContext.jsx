import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

// Trazabilidad: Nielsen H1 (Visibilidad del estado del sistema), H3 (Control) · Shneiderman S1, S4 · ISO 9241-11
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [errorAuth, setErrorAuth] = useState(null);

  const verificarSesion = useCallback(async () => {
    setCargando(true);
    setErrorAuth(null);
    const res = await authService.obtenerUsuarioActual();
    if (res.exito && res.datos) {
      setUsuario(res.datos);
    } else {
      setUsuario(null);
    }
    setCargando(false);
  }, []);

  useEffect(() => {
    verificarSesion();
  }, [verificarSesion]);

  const login = async (correo, contrasena) => {
    setErrorAuth(null);
    const res = await authService.login(correo, contrasena);
    if (res.exito && res.datos) {
      setUsuario(res.datos);
      return { exito: true };
    }
    setErrorAuth(res.error || 'Credenciales inválidas');
    return { exito: false, error: res.error, estado: res.estado, accion: res.accion };
  };

  const logout = async () => {
    await authService.logout();
    setUsuario(null);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        cargando,
        errorAuth,
        login,
        logout,
        recargarUsuario: verificarSesion,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
