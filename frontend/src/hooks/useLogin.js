import { useState, useRef } from 'react';
import { useAuth } from './useAuth';
import { useBloqMayus } from './useBloqMayus';
import { useCorreoRecordado } from './useCorreoRecordado';
import { validarCorreo, validarClave } from '../validation/validaciones';
import { normalizarCorreo } from '../utils/normalizar';

// Trazabilidad: Nielsen H5 (Prevención de errores), H7 (Eficiencia), H9 (Recuperación) · Shneiderman S2, S5 · E-22 · ISO 9241-11
export function useLogin() {
  const { login } = useAuth();
  const { correoRecordado, guardarCorreo } = useCorreoRecordado();
  const { bloqMayusActivo, verificarBloqMayus } = useBloqMayus();

  const [correo, setCorreo] = useState(correoRecordado || '');
  const [clave, setClave] = useState('');
  const [recordar, setRecordar] = useState(Boolean(correoRecordado));
  const [errores, setErrores] = useState({});
  const [errorServidor, setErrorServidor] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const correoRef = useRef(null);
  const claveRef = useRef(null);
  const alertaRef = useRef(null);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    // Protección contra doble envío concurrente (E-22)
    if (enviando) return;

    setErrorServidor(null);
    const errs = {};

    const correoLimpio = normalizarCorreo(correo);
    const errCorreo = validarCorreo(correoLimpio);
    if (errCorreo) errs.correo = errCorreo;

    const errClave = validarClave(clave);
    if (errClave) errs.clave = errClave;

    if (Object.keys(errs).length > 0) {
      setErrores(errs);
      // Foco automático en el primer campo con error (ISO 9241-11 Eficacia)
      if (errs.correo && correoRef.current) {
        correoRef.current.focus();
      } else if (errs.clave && claveRef.current) {
        claveRef.current.focus();
      }
      return;
    }

    setErrores({});
    setEnviando(true);

    try {
      const res = await login(correoLimpio, clave);
      if (res.exito) {
        if (recordar) {
          guardarCorreo(correoLimpio);
        } else {
          guardarCorreo('');
        }
      } else {
        setErrorServidor(res.error || 'Credenciales incorrectas');
        if (res.accion === 'enfocar_clave' && claveRef.current) {
          claveRef.current.focus();
          setClave('');
        } else if (alertaRef.current) {
          alertaRef.current.focus();
        }
      }
    } finally {
      setEnviando(false);
    }
  };

  return {
    correo,
    setCorreo,
    clave,
    setClave,
    recordar,
    setRecordar,
    errores,
    errorServidor,
    enviando,
    bloqMayusActivo,
    verificarBloqMayus,
    handleSubmit,
    correoRef,
    claveRef,
    alertaRef,
  };
}
