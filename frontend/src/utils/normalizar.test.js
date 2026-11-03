import { describe, it, expect } from 'vitest';
import { normalizarTexto, normalizarCorreo } from './normalizar';

describe('Utilidades de Normalización (E-06)', () => {
  it('normalizarTexto elimina espacios sobrantes y colapsa espacios intermedios', () => {
    expect(normalizarTexto('  Laboratorio   de  Cómputo  ')).toBe('Laboratorio de Cómputo');
    expect(normalizarTexto(null)).toBe('');
    expect(normalizarTexto(undefined)).toBe('');
  });

  it('normalizarCorreo convierte a minúsculas y elimina espacios', () => {
    expect(normalizarCorreo('  ALFONSO@UPLA.EDU.PE  ')).toBe('alfonso@upla.edu.pe');
    expect(normalizarCorreo(null)).toBe('');
  });
});
