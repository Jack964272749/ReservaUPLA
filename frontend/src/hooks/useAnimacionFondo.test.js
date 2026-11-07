import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAnimacionFondo } from './useAnimacionFondo';

describe('useAnimacionFondo', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('tiene valor activo (true) por defecto', () => {
    const { result } = renderHook(() => useAnimacionFondo());
    expect(result.current.animacionActiva).toBe(true);
  });

  it('permite alternar el estado y persiste en localStorage', () => {
    const { result } = renderHook(() => useAnimacionFondo());
    expect(result.current.animacionActiva).toBe(true);

    act(() => {
      result.current.alternarAnimacion();
    });

    expect(result.current.animacionActiva).toBe(false);
    expect(localStorage.getItem('upla_animacion_fondo')).toBe('false');

    act(() => {
      result.current.alternarAnimacion();
    });

    expect(result.current.animacionActiva).toBe(true);
    expect(localStorage.getItem('upla_animacion_fondo')).toBe('true');
  });
});
