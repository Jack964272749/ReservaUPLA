import { useState, useEffect, useCallback } from 'react';
import { ambienteService } from '../services/ambienteService';
import { normalizarTexto } from '../utils/normalizar';
import { validarAmbiente } from '../validation/validaciones';

// Trazabilidad: RF-02 · Nielsen H1, H5, H9 · ISO 9241-11
export function useAmbientes() {
  const [ambientes, setAmbientes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // Formulario nuevo ambiente
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('LaboratorioComputo');
  const [capacidad, setCapacidad] = useState(30);
  const [ubicacion, setUbicacion] = useState('');
  const [responsableId, setResponsableId] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [erroresForm, setErroresForm] = useState({});

  const cargarAmbientes = useCallback(async () => {
    setCargando(true);
    setError(null);
    const res = await ambienteService.listar();
    if (res.exito && res.datos) {
      setAmbientes(res.datos);
    } else {
      setError(res.error || 'Error al cargar los ambientes.');
    }
    setCargando(false);
  }, []);

  useEffect(() => {
    cargarAmbientes();
  }, [cargarAmbientes]);

  const abrirModalCrear = () => {
    setNombre('');
    setTipo('LaboratorioComputo');
    setCapacidad(30);
    setUbicacion('');
    setResponsableId('');
    setErroresForm({});
    setModalAbierto(true);
  };

  const cerrarModalCrear = () => {
    setModalAbierto(false);
    setErroresForm({});
  };

  const guardarAmbiente = async (e) => {
    if (e) e.preventDefault();
    if (guardando) return;

    const validacion = validarAmbiente({
      nombre,
      tipo,
      capacidad,
      ubicacion,
    });

    if (!validacion.esValido) {
      setErroresForm(validacion.errores);
      return;
    }
    const nombreLimpio = normalizarTexto(nombre);
    const ubicacionLimpia = normalizarTexto(ubicacion);

    const capNum = Number(capacidad);

    setGuardando(true);
    setErroresForm({});

    const res = await ambienteService.crear({
      nombre: nombreLimpio,
      tipo,
      capacidad: capNum,
      ubicacion: ubicacionLimpia,
      responsableId: responsableId || null,
    });

    if (res.exito) {
      cerrarModalCrear();
      await cargarAmbientes();
    } else {
      setErroresForm({ general: res.error || 'No se pudo crear el ambiente.' });
    }
    setGuardando(false);
  };

  return {
    ambientes,
    cargando,
    error,
    recargar: cargarAmbientes,
    modalAbierto,
    abrirModalCrear,
    cerrarModalCrear,
    nombre,
    setNombre,
    tipo,
    setTipo,
    capacidad,
    setCapacidad,
    ubicacion,
    setUbicacion,
    responsableId,
    setResponsableId,
    erroresForm,
    guardando,
    guardarAmbiente,
  };
}
