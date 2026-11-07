import { describe, it, expect } from 'vitest';
import { obtenerRuta } from './rutas';

describe('obtenerRuta', () => {
  it('el Administrador inicia en el dashboard', () => {
    const ruta = obtenerRuta('dashboard', 'Administrador');
    expect(ruta.map((r) => r.label)).toEqual(['Inicio', 'Panel de Control']);
    expect(ruta[0].tab).toBe('dashboard');
  });

  it('el Solicitante ve la ruta completa de Nueva Reserva', () => {
    const ruta = obtenerRuta('nueva-reserva', 'Solicitante');
    expect(ruta.map((r) => r.label)).toEqual(['Inicio', 'Mis Reservas', 'Nueva Reserva']);
    expect(ruta[1].tab).toBe('reservas');
    expect(ruta[0].tab).toBe('reservas');
  });

  it('adapta el nombre del listado según el rol', () => {
    expect(obtenerRuta('reservas', 'Responsable')[1].label).toBe('Reservas Asignadas');
    expect(obtenerRuta('reservas', 'Administrador')[1].label).toBe('Listado de Reservas');
  });
});
