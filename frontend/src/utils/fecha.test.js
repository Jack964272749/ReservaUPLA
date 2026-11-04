import { describe, it, expect } from 'vitest';
import { obtenerFechaLocalISO } from './fecha';

describe('obtenerFechaLocalISO', () => {
  it('formatea correctamente una fecha dada en formato YYYY-MM-DD local', () => {
    const fecha = new Date(2026, 10, 4, 23, 30, 0); // 4 de noviembre de 2026 a las 23:30 local
    const resultado = obtenerFechaLocalISO(fecha);
    expect(resultado).toBe('2026-11-04');
  });

  it('agrega ceros a la izquierda para meses y días de un solo dígito', () => {
    const fecha = new Date(2026, 0, 5, 10, 0, 0); // 5 de enero de 2026
    const resultado = obtenerFechaLocalISO(fecha);
    expect(resultado).toBe('2026-01-05');
  });

  it('usa la fecha actual por defecto si no se pasa argumento', () => {
    const hoy = new Date();
    const esperado = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
    expect(obtenerFechaLocalISO()).toBe(esperado);
  });
});
