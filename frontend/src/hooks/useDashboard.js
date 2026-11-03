import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../services/dashboardService';

// Trazabilidad: RF-08 · Nielsen H1 (Visibilidad del estado del sistema) · Shneiderman S3
export function useDashboard() {
  const [indicadores, setIndicadores] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargarDashboard = useCallback(async () => {
    setCargando(true);
    setError(null);
    const res = await dashboardService.obtener();
    if (res.exito && res.datos) {
      setIndicadores(res.datos);
    } else {
      setError(res.error || 'Error al cargar los indicadores del dashboard.');
    }
    setCargando(false);
  }, []);

  useEffect(() => {
    cargarDashboard();
  }, [cargarDashboard]);

  return {
    indicadores,
    cargando,
    error,
    recargar: cargarDashboard,
  };
}
