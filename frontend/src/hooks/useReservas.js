import { useState, useEffect, useCallback, useRef } from 'react';
import { reservaService } from '../services/reservaService';

// Trazabilidad: RF-05, RF-06, RF-07 · RN-05, RN-06 · Nielsen H1, H3, H5, H9
export function useReservas(estadoInicial = '') {
  const [reservas, setReservas] = useState([]);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // Filtros
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroAmbiente, setFiltroAmbiente] = useState('');
  const [filtroEstado, setFiltroEstado] = useState(estadoInicial || '');

  // Modal de acción (Aprobar, Rechazar, Cancelar)
  const [modalAccion, setModalAccion] = useState(null); // { id, nuevoEstado, titulo, mensaje, variante }
  const [procesandoAccion, setProcesandoAccion] = useState(false);
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const ultimoBotonAccionRef = useRef(null);

  const cargarReservas = useCallback(async () => {
    setCargando(true);
    setError(null);

    const filtros = {
      pagina: paginaActual,
      tamanoPagina: 10,
    };
    if (filtroFecha) filtros.fecha = filtroFecha;
    if (filtroAmbiente) filtros.ambienteId = filtroAmbiente;
    if (filtroEstado) filtros.estado = filtroEstado;

    const res = await reservaService.listar(filtros);
    if (res.exito && res.datos) {
      setReservas(res.datos.items || []);
      setTotalRegistros(res.datos.totalRegistros || 0);
      setTotalPaginas(res.datos.totalPaginas || 1);
    } else {
      setError(res.error || 'Error al cargar las reservas.');
    }
    setCargando(false);
  }, [paginaActual, filtroFecha, filtroAmbiente, filtroEstado]);

  useEffect(() => {
    cargarReservas();
  }, [cargarReservas]);

  const abrirModalAccion = (reserva, nuevoEstado, triggerElement) => {
    ultimoBotonAccionRef.current = triggerElement;
    setMotivoRechazo('');

    let titulo = 'Confirmar cambio';
    let mensaje = '¿Desea cambiar el estado de la reserva?';
    let variante = 'primary';

    if (nuevoEstado === 'Aprobada') {
      titulo = 'Aprobar Solicitud de Reserva';
      mensaje = `¿Confirma la aprobación de la reserva en ${reserva.ambienteNombre} para el ${reserva.fecha}?`;
      variante = 'success';
    } else if (nuevoEstado === 'Rechazada') {
      titulo = 'Rechazar Solicitud de Reserva';
      mensaje = `Indique el motivo por el cual se rechaza la reserva de ${reserva.solicitanteNombre}:`;
      variante = 'danger';
    } else if (nuevoEstado === 'Cancelada') {
      titulo = 'Cancelar Reserva';
      mensaje = '¿Confirma que desea cancelar esta reserva? Esta acción no se puede deshacer.';
      variante = 'danger';
    }

    setModalAccion({
      id: reserva.id,
      nuevoEstado,
      titulo,
      mensaje,
      variante,
    });
  };

  const cerrarModalAccion = () => {
    setModalAccion(null);
    setMotivoRechazo('');
  };

  const confirmarAccion = async () => {
    if (!modalAccion) return;

    setProcesandoAccion(true);
    const res = await reservaService.cambiarEstado(
      modalAccion.id,
      modalAccion.nuevoEstado,
      motivoRechazo || undefined
    );

    if (res.exito) {
      cerrarModalAccion();
      await cargarReservas();
    } else {
      setError(res.error || 'No se pudo actualizar el estado de la reserva.');
    }
    setProcesandoAccion(false);
  };

  return {
    reservas,
    totalRegistros,
    paginaActual,
    totalPaginas,
    setPaginaActual,
    cargando,
    error,
    filtroFecha,
    setFiltroFecha,
    filtroAmbiente,
    setFiltroAmbiente,
    filtroEstado,
    setFiltroEstado,
    recargar: cargarReservas,
    modalAccion,
    abrirModalAccion,
    cerrarModalAccion,
    confirmarAccion,
    procesandoAccion,
    motivoRechazo,
    setMotivoRechazo,
    ultimoBotonAccionRef,
  };
}
