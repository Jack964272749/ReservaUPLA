import { useState, useEffect, useRef } from 'react';
import { ambienteService } from '../services/ambienteService';
import { reservaService } from '../services/reservaService';
import { validarFormularioReserva } from '../validation/validaciones';
import { normalizarTexto } from '../utils/normalizar';

// Trazabilidad: RF-03, RF-04 · RN-01 a RN-04 · Nielsen H1, H5, H9 · ISO 9241-11
export function useReservaForm({ ambientePreseleccionadoId, onReservaExitosa }) {
  const [ambientes, setAmbientes] = useState([]);
  const [ambienteId, setAmbienteId] = useState(ambientePreseleccionadoId || '');
  const [fecha, setFecha] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [motivo, setMotivo] = useState('');

  const [cargandoAmbientes, setCargandoAmbientes] = useState(false);
  const [validandoDisponibilidad, setValidandoDisponibilidad] = useState(false);
  const [reservasExistentes, setReservasExistentes] = useState([]);
  const [enviando, setEnviando] = useState(false);
  const [errores, setErrores] = useState({});
  const [errorServidor, setErrorServidor] = useState(null);
  const [exito, setExito] = useState(false);

  const ambienteRef = useRef(null);
  const fechaRef = useRef(null);
  const horaInicioRef = useRef(null);
  const horaFinRef = useRef(null);
  const motivoRef = useRef(null);

  // Carga lista de ambientes
  useEffect(() => {
    let montado = true;
    async function cargar() {
      setCargandoAmbientes(true);
      const res = await ambienteService.listar();
      if (montado && res.exito && res.datos) {
        setAmbientes(res.datos);
        if (ambientePreseleccionadoId) {
          setAmbienteId(ambientePreseleccionadoId);
        }
      }
      if (montado) setCargandoAmbientes(false);
    }
    cargar();
    return () => {
      montado = false;
    };
  }, [ambientePreseleccionadoId]);

  // Consulta de disponibilidad en tiempo real cuando se eligen ambiente y fecha (RF-04)
  useEffect(() => {
    if (!ambienteId || !fecha) {
      setReservasExistentes([]);
      return;
    }

    let montado = true;
    async function verificar() {
      setValidandoDisponibilidad(true);
      const res = await ambienteService.consultarDisponibilidad(ambienteId, fecha);
      if (montado) {
        if (res.exito && res.datos) {
          const lista = Array.isArray(res.datos) ? res.datos : res.datos.reservas;
          setReservasExistentes(Array.isArray(lista) ? lista : []);
        } else {
          setReservasExistentes([]);
        }
        setValidandoDisponibilidad(false);
      }
    }

    verificar();
    return () => {
      montado = false;
    };
  }, [ambienteId, fecha]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (enviando) return;

    setErrorServidor(null);
    const motivoLimpio = normalizarTexto(motivo);

    const datosValidacion = {
      ambienteId,
      fecha,
      horaInicio,
      horaFin,
      motivo: motivoLimpio,
    };

    const validacion = validarFormularioReserva(datosValidacion);
    if (!validacion.esValido) {
      setErrores(validacion.errores);
      // Foco en el primer campo con error (ISO 9241-11)
      if (validacion.errores.ambienteId && ambienteRef.current) {
        ambienteRef.current.focus();
      } else if (validacion.errores.fecha && fechaRef.current) {
        fechaRef.current.focus();
      } else if (validacion.errores.horaInicio && horaInicioRef.current) {
        horaInicioRef.current.focus();
      } else if (validacion.errores.horaFin && horaFinRef.current) {
        horaFinRef.current.focus();
      } else if (validacion.errores.motivo && motivoRef.current) {
        motivoRef.current.focus();
      }
      return;
    }

    setErrores({});
    setEnviando(true);

    try {
      const res = await reservaService.crear({
        ambienteId,
        fecha,
        horaInicio,
        horaFin,
        motivo: motivoLimpio,
      });

      if (res.exito) {
        setExito(true);
        if (onReservaExitosa) onReservaExitosa(res.datos);
      } else {
        setErrorServidor(res.error || 'No fue posible registrar la reserva.');
      }
    } finally {
      setEnviando(false);
    }
  };

  return {
    ambientes,
    cargandoAmbientes,
    ambienteId,
    setAmbienteId,
    fecha,
    setFecha,
    horaInicio,
    setHoraInicio,
    horaFin,
    setHoraFin,
    motivo,
    setMotivo,
    validandoDisponibilidad,
    reservasExistentes,
    errores,
    errorServidor,
    enviando,
    exito,
    handleSubmit,
    ambienteRef,
    fechaRef,
    horaInicioRef,
    horaFinRef,
    motivoRef,
  };
}
