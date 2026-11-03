import { describe, it, expect } from 'vitest';
import {
  validarCorreo,
  validarNombre,
  validarClave,
  validarFormularioReserva,
} from './validaciones';

describe('Validaciones de Usuario y Reserva', () => {
  it('E-01: valida correo y nombre correctos', () => {
    expect(validarCorreo('docente@upla.edu.pe')).toBeNull();
    expect(validarNombre('Alfonso López')).toBeNull();
  });

  it('E-02: rechaza campos vacíos', () => {
    expect(validarNombre('')).not.toBeNull();
    expect(validarCorreo('')).not.toBeNull();
    expect(validarClave('')).not.toBeNull();
  });

  it('E-03: rechaza correo con formato incorrecto', () => {
    expect(validarCorreo('correo-invalido')).not.toBeNull();
    expect(validarCorreo('usuario@')).not.toBeNull();
  });

  it('E-06: valida longitud de clave mínima de 8 caracteres (RV-03)', () => {
    expect(validarClave('1234567')).not.toBeNull();
    expect(validarClave('12345678')).toBeNull();
  });

  it('E-14: RN-03 rechaza horaFin menor o igual a horaInicio', () => {
    const resIgual = validarFormularioReserva({
      ambienteId: 'amb-1',
      fecha: '2026-12-01',
      horaInicio: '10:00',
      horaFin: '10:00',
      motivo: 'Examen final',
    });
    expect(resIgual.esValido).toBe(false);
    expect(resIgual.errores.horaFin).toBeDefined();

    const resMenor = validarFormularioReserva({
      ambienteId: 'amb-1',
      fecha: '2026-12-01',
      horaInicio: '11:00',
      horaFin: '09:00',
      motivo: 'Examen final',
    });
    expect(resMenor.esValido).toBe(false);
    expect(resMenor.errores.horaFin).toBeDefined();
  });

  it('E-15: RN-04 rechaza horarios fuera del rango institucional 07:00 a 22:00', () => {
    const resMadrugada = validarFormularioReserva({
      ambienteId: 'amb-1',
      fecha: '2026-12-01',
      horaInicio: '06:00',
      horaFin: '08:00',
      motivo: 'Clase',
    });
    expect(resMadrugada.esValido).toBe(false);
    expect(resMadrugada.errores.horaInicio).toBeDefined();

    const resNoche = validarFormularioReserva({
      ambienteId: 'amb-1',
      fecha: '2026-12-01',
      horaInicio: '21:00',
      horaFin: '23:00',
      motivo: 'Clase',
    });
    expect(resNoche.esValido).toBe(false);
    expect(resNoche.errores.horaFin).toBeDefined();
  });

  it('valida formulario de reserva correcto', () => {
    const res = validarFormularioReserva({
      ambienteId: 'amb-1',
      fecha: '2026-12-01',
      horaInicio: '08:00',
      horaFin: '10:00',
      motivo: 'Sustentación de tesis de grado',
    });
    expect(res.esValido).toBe(true);
    expect(Object.keys(res.errores).length).toBe(0);
  });
});
