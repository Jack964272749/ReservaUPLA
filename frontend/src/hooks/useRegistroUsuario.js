import { useState, useRef } from 'react';
import { authService } from '../services/authService';
import { validarCorreo, validarNombre, validarClave } from '../validation/validaciones';
import { normalizarTexto, normalizarCorreo } from '../utils/normalizar';

// Trazabilidad: RF-01 · Nielsen H5, H9 · Shneiderman S4, S5 · ISO 9241-11
export function useRegistroUsuario({ onRegistroExitoso }) {
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [codigo, setCodigo] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [errores, setErrores] = useState({});
  const [errorServidor, setErrorServidor] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);

  const nombreRef = useRef(null);
  const codigoRef = useRef(null);
  const correoRef = useRef(null);
  const contrasenaRef = useRef(null);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (enviando) return;

    setErrorServidor(null);
    const errs = {};

    const nombreLimpio = normalizarTexto(nombreCompleto);
    const codigoLimpio = (codigo || '').trim().toUpperCase();
    const correoLimpio = normalizarCorreo(correo);

    const errNombre = validarNombre(nombreLimpio);
    if (errNombre) errs.nombreCompleto = errNombre;

    if (!codigoLimpio) {
      errs.codigo = 'El código institucional o matrícula es requerido.';
    } else if (codigoLimpio.length < 4 || codigoLimpio.length > 20) {
      errs.codigo = 'El código debe tener entre 4 y 20 caracteres.';
    }

    const errCorreo = validarCorreo(correoLimpio);
    if (errCorreo) errs.correo = errCorreo;

    const errClave = validarClave(contrasena);
    if (errClave) errs.contrasena = errClave;

    if (Object.keys(errs).length > 0) {
      setErrores(errs);
      if (errs.nombreCompleto && nombreRef.current) {
        nombreRef.current.focus();
      } else if (errs.codigo && codigoRef.current) {
        codigoRef.current.focus();
      } else if (errs.correo && correoRef.current) {
        correoRef.current.focus();
      } else if (errs.contrasena && contrasenaRef.current) {
        contrasenaRef.current.focus();
      }
      return;
    }

    setErrores({});
    setEnviando(true);

    try {
      const res = await authService.registrarSolicitante(
        nombreLimpio,
        correoLimpio,
        contrasena,
        codigoLimpio
      );

      if (res.exito) {
        setExito(true);
        if (onRegistroExitoso) onRegistroExitoso(res.datos);
      } else {
        setErrorServidor(res.error || 'No se pudo completar el registro.');
      }
    } finally {
      setEnviando(false);
    }
  };

  return {
    nombreCompleto,
    setNombreCompleto,
    codigo,
    setCodigo,
    correo,
    setCorreo,
    contrasena,
    setContrasena,
    errores,
    errorServidor,
    enviando,
    exito,
    handleSubmit,
    nombreRef,
    codigoRef,
    correoRef,
    contrasenaRef,
  };
}
