import React, { useRef } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ModalConfirmacion from './ModalConfirmacion';

function TestWrapperModal({ isOpen, onClose, onConfirm }) {
  const triggerRef = useRef(null);
  return (
    <div>
      <button ref={triggerRef} type="button">Abrir Modal</button>
      <ModalConfirmacion
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={onConfirm}
        title="Confirmar Acción"
        message="¿Desea continuar con la operación?"
        triggerRef={triggerRef}
      />
    </div>
  );
}

describe('ModalConfirmacion (E-33 · Nielsen H3, H5 · Shneiderman S4)', () => {
  it('renderiza role="alertdialog" con aria-modal="true"', () => {
    render(
      <TestWrapperModal
        isOpen={true}
        onClose={() => {}}
        onConfirm={() => {}}
      />
    );
    const dialog = screen.getByRole('alertdialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByText('Confirmar Acción')).toBeInTheDocument();
  });

  it('cierra el modal al presionar la tecla Escape (E-33)', () => {
    const handleClose = vi.fn();
    render(
      <TestWrapperModal
        isOpen={true}
        onClose={handleClose}
        onConfirm={() => {}}
      />
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
