import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LandingPage from './LandingPage';
import { REGLAS } from '../constants/reglas';

// ── Mocks ──
vi.mock('../hooks/useTema', () => ({
  useTema: () => ({ tema: 'light', alternarTema: vi.fn() }),
}));

vi.mock('../hooks/useAnimacionFondo', () => ({
  useAnimacionFondo: () => ({ animacionActiva: true, alternarAnimacion: vi.fn() }),
}));

// Default: not authenticated
const mockUseAuth = vi.fn(() => ({ usuario: null, cargando: false }));
vi.mock('../hooks/useAuth', () => ({
  useAuth: (...args) => mockUseAuth(...args),
}));

// LienzoIgloo uses canvas — stub it
vi.mock('../components/LienzoIgloo', () => ({
  default: () => <div data-testid="lienzo-igloo" />,
}));

describe('LandingPage', () => {
  const alIrALogin = vi.fn();
  const alIrARegistro = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({ usuario: null, cargando: false });
  });

  it('renders the h1 with ReservaUPLA', () => {
    render(<LandingPage alIrALogin={alIrALogin} alIrARegistro={alIrARegistro} />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toContain('Reserva');
    expect(heading.textContent).toContain('UPLA');
  });

  it('renders the three roles: Solicitante, Responsable de Ambiente, Administrador', () => {
    render(<LandingPage alIrALogin={alIrALogin} alIrARegistro={alIrARegistro} />);
    expect(screen.getByText('Solicitante')).toBeInTheDocument();
    expect(screen.getByText('Responsable de Ambiente')).toBeInTheDocument();
    expect(screen.getByText('Administrador')).toBeInTheDocument();
  });

  it('CTA buttons call alIrALogin and alIrARegistro', () => {
    render(<LandingPage alIrALogin={alIrALogin} alIrARegistro={alIrARegistro} />);

    // There are multiple "Iniciar sesión" buttons (header + hero + CTA)
    const loginButtons = screen.getAllByRole('button', { name: /iniciar sesión/i });
    expect(loginButtons.length).toBeGreaterThanOrEqual(1);
    loginButtons[0].click();
    expect(alIrALogin).toHaveBeenCalled();

    const registroButtons = screen.getAllByRole('button', { name: /regístrate como solicitante/i });
    expect(registroButtons.length).toBeGreaterThanOrEqual(1);
    registroButtons[0].click();
    expect(alIrARegistro).toHaveBeenCalled();
  });

  it('shows schedule hours from constants/reglas.js', () => {
    render(<LandingPage alIrALogin={alIrALogin} alIrARegistro={alIrARegistro} />);
    const apertura = screen.getByTestId('hora-apertura');
    const cierre = screen.getByTestId('hora-cierre');
    expect(apertura.textContent).toBe(REGLAS.RESERVA.HORA_APERTURA);
    expect(cierre.textContent).toBe(REGLAS.RESERVA.HORA_CIERRE);
  });

  it('shows "Ir al panel" instead of "Iniciar sesión" when user is authenticated', () => {
    mockUseAuth.mockReturnValue({
      usuario: { id: '1', nombre: 'Test User', rol: 'Administrador' },
      cargando: false,
    });

    render(<LandingPage alIrALogin={alIrALogin} alIrARegistro={alIrARegistro} />);

    const panelButtons = screen.getAllByRole('button', { name: /ir al panel/i });
    expect(panelButtons.length).toBeGreaterThanOrEqual(1);

    // "Iniciar sesión" should NOT be present
    expect(screen.queryByRole('button', { name: /iniciar sesión/i })).not.toBeInTheDocument();
  });
});
