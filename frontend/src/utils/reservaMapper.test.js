import { describe, it, expect } from 'vitest';
import { normalizarReserva, normalizarPagina, recortarHora } from './reservaMapper';

describe('recortarHora', () => {
  it('recorta HH:mm:ss a HH:mm y respeta otros valores', () => {
    expect(recortarHora('15:00:00')).toBe('15:00');
    expect(recortarHora('15:00')).toBe('15:00');
    expect(recortarHora(undefined)).toBeUndefined();
  });
});

describe('normalizarReserva', () => {
  it('expone el solicitante a partir de usuarioNombre y usuarioCorreo', () => {
    const r = normalizarReserva({ usuarioNombre: 'Carmen Flores', usuarioCorreo: 'c@upla.edu.pe', horaInicio: '09:00:00', horaFin: '10:00:00' });
    expect(r.solicitanteNombre).toBe('Carmen Flores');
    expect(r.solicitanteCorreo).toBe('c@upla.edu.pe');
    expect(r.horaInicio).toBe('09:00');
    expect(r.horaFin).toBe('10:00');
  });
});

describe('normalizarPagina', () => {
  it('calcula total de registros y de páginas desde totalItems', () => {
    const p = normalizarPagina({ items: [{}, {}], totalItems: 23, pagina: 1, tamanoPagina: 10 });
    expect(p.totalRegistros).toBe(23);
    expect(p.totalPaginas).toBe(3);
    expect(p.items).toHaveLength(2);
  });

  it('devuelve al menos una página cuando no hay registros', () => {
    expect(normalizarPagina({ items: [], totalItems: 0, tamanoPagina: 10 }).totalPaginas).toBe(1);
  });
});
