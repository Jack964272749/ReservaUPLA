import React, { useState } from 'react';
import {
  Calendar, CalendarPlus, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import SelectInput from '../components/SelectInput';
import DateInput from '../components/DateInput';
import TimeInput from '../components/TimeInput';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import AlertMessage from '../components/AlertMessage';
import ModalConfirmacion from '../components/ModalConfirmacion';
import { useReservaForm } from '../hooks/useReservaForm';
import { obtenerFechaLocalISO } from '../utils/fecha';
import { recortarHora } from '../utils/reservaMapper';

// Obtener fecha mínima permitida (hoy)
const hoyStr = obtenerFechaLocalISO();

// Trazabilidad: RF-03, RF-04 · RN-01 a RN-04 · Nielsen H1, H4, H5, H6, H9 · Shneiderman S1..S5 · ISO 9241-11
export default function CrearReserva({ ambientePreseleccionadoId, alVerReservas }) {
  const [modalResumen, setModalResumen] = useState(false);
  const [reservaCreada, setReservaCreada] = useState(null);

  const {
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
    handleSubmit,
    ambienteRef,
    fechaRef,
    horaInicioRef,
    horaFinRef,
    motivoRef,
  } = useReservaForm({
    ambientePreseleccionadoId,
    onReservaExitosa: (datos) => {
      setReservaCreada(datos);
      setModalResumen(true);
    },
  });

  const opcionesAmbientes = ambientes.map((amb) => ({
    value: amb.id,
    label: `${amb.nombre} (${amb.ubicacion} · Cap: ${amb.capacidad})`,
  }));

  return (
    <>
    <div className="relative z-10 max-w-3xl mx-auto space-y-6">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <CalendarPlus className="w-6 h-6 text-sky-700 dark:text-sky-400" aria-hidden="true" />
          <span>Solicitar Reserva de Ambiente</span>
        </h1>
        <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mt-1">
          Complete el formulario institucional. La disponibilidad se valida en tiempo real.
        </p>
      </div>

      {errorServidor && (
        <AlertMessage
          type="error"
          message={errorServidor}
        />
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-6 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Selección de Ambiente */}
        <SelectInput
          selectRef={ambienteRef}
          id="reserva-ambiente"
          name="ambienteId"
          label="Ambiente universitario"
          value={ambienteId}
          onChange={(e) => setAmbienteId(e.target.value)}
          options={opcionesAmbientes}
          placeholder={cargandoAmbientes ? 'Cargando ambientes…' : 'Seleccione el ambiente'}
          ayuda="Seleccione el aula, laboratorio o auditorio que desea reservar."
          error={errores.ambienteId}
          obligatorio
          disabled={cargandoAmbientes || enviando}
        />

        {/* Selección de Fecha */}
        <DateInput
          inputRef={fechaRef}
          id="reserva-fecha"
          name="fecha"
          label="Fecha de la reserva"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          min={hoyStr}
          ayuda="No se permiten fechas pasadas."
          error={errores.fecha}
          obligatorio
          disabled={enviando}
        />

        {/* Estado de disponibilidad del ambiente seleccionado (RF-04 · Nielsen H1) */}
        {ambienteId && fecha && (
          <div
            role="status"
            aria-live="polite"
            className="p-4 rounded-xl border bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-xs space-y-2"
          >
            <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-200">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                Horarios ocupados para este ambiente en la fecha seleccionada:
              </span>
              {validandoDisponibilidad && (
                <span className="text-sky-600 dark:text-sky-400 animate-pulse">
                  Validando disponibilidad…
                </span>
              )}
            </div>

            {reservasExistentes.length === 0 ? (
              <p className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                No hay reservas aprobadas en esta fecha. El ambiente está completamente disponible.
              </p>
            ) : (
              <div className="space-y-1">
                <p className="text-slate-500 dark:text-slate-400">
                  Franjas horarias ocupadas (no disponibles):
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {reservasExistentes.map((r, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-mono text-[11px]"
                    >
                      <AlertCircle className="w-3 h-3 text-rose-500" />
                      {recortarHora(r.horaInicio)} – {recortarHora(r.horaFin)} ({r.estado})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Horarios (Inicio y Fin) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TimeInput
            inputRef={horaInicioRef}
            id="reserva-hora-inicio"
            name="horaInicio"
            label="Hora de inicio"
            value={horaInicio}
            onChange={(e) => setHoraInicio(e.target.value)}
            min="07:00"
            max="22:00"
            step="900"
            ayuda="Horario permitido: 07:00 a 22:00."
            error={errores.horaInicio}
            obligatorio
            disabled={enviando}
          />

          <TimeInput
            inputRef={horaFinRef}
            id="reserva-hora-fin"
            name="horaFin"
            label="Hora de finalización"
            value={horaFin}
            onChange={(e) => setHoraFin(e.target.value)}
            min="07:00"
            max="22:00"
            step="900"
            ayuda="Debe ser posterior a la hora de inicio."
            error={errores.horaFin}
            obligatorio
            disabled={enviando}
          />
        </div>

        {/* Motivo de la Reserva */}
        <TextInput
          inputRef={motivoRef}
          id="reserva-motivo"
          name="motivo"
          label="Motivo académico / justificación"
          placeholder="Ej. Clase magistral del curso de Arquitectura de Software"
          ayuda="Máximo 500 caracteres descriptivos."
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          error={errores.motivo}
          maxLength={500}
          obligatorio
          disabled={enviando}
        />

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={enviando}
            className="w-full sm:w-auto font-semibold"
          >
            {enviando ? 'Validando y registrando…' : 'Enviar Solicitud de Reserva'}
          </Button>
        </div>
      </form>

      {/* Modal de Confirmación y Cierre de Diálogo (Nielsen H3, Shneiderman S4, ISO 9241-11) */}
      <ModalConfirmacion
        isOpen={modalResumen}
        onClose={() => setModalResumen(false)}
        onConfirm={() => {
          setModalResumen(false);
          if (alVerReservas) alVerReservas();
        }}
        title="¡Solicitud de Reserva Registrada!"
        message="Su solicitud ha sido registrada correctamente y está en estado Pendiente de aprobación administrativa."
        confirmText="Ver Listado de Reservas"
        cancelText="Registrar otra"
        variant="success"
      >
        {reservaCreada && (
          <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-3 font-medium shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-900 dark:text-slate-100">{reservaCreada.ambienteNombre}</span>
              <span className="text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 border border-amber-300 px-2 py-0.5 rounded-full text-[11px] font-bold">
                {reservaCreada.estado}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/50 border border-sky-200/90 dark:border-sky-800 text-sky-800 dark:text-sky-300">
                <Calendar className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400">Fecha</p>
                  <p className="font-bold text-sky-950 dark:text-sky-100">{reservaCreada.fecha}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/90 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300">
                <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">Horario</p>
                  <p className="font-bold font-mono text-indigo-950 dark:text-indigo-100">{reservaCreada.horaInicio} – {reservaCreada.horaFin}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </ModalConfirmacion>
    </div>
    </>
  );
}
