import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TextInput from './TextInput';

describe('Componente Accesible TextInput (Nielsen H4, H5, H9)', () => {
  it('enlaza label con input mediante id y htmlFor', () => {
    render(
      <TextInput
        id="correo-test"
        label="Correo Institucional"
        value=""
        onChange={() => {}}
      />
    );
    const input = screen.getByLabelText(/Correo Institucional/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'correo-test');
  });

  it('muestra estado de error accesible con role="alert" y aria-invalid', () => {
    render(
      <TextInput
        id="correo-test"
        label="Correo"
        value=""
        onChange={() => {}}
        error="El correo es requerido"
      />
    );
    const input = screen.getByLabelText(/Correo/i);
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('El correo es requerido');
  });

  it('permite alternar visibilidad de contraseña con aria-label dinámico', () => {
    render(
      <TextInput
        id="clave-test"
        label="Contraseña"
        type="password"
        value="Secreta123"
        onChange={() => {}}
        mostrarAlternarClave
      />
    );
    const boton = screen.getByRole('button', { name: /Mostrar contraseña/i });
    expect(boton).toBeInTheDocument();

    fireEvent.click(boton);
    expect(screen.getByRole('button', { name: /Ocultar contraseña/i })).toBeInTheDocument();
  });
});
