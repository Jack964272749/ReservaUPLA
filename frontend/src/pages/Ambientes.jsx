import React from 'react';
import { DoorOpen, Plus, Users, MapPin, CalendarPlus, RefreshCw } from 'lucide-react';
import TableList from '../components/TableList';
import Button from '../components/Button';
import AlertMessage from '../components/AlertMessage';
import ModalConfirmacion from '../components/ModalConfirmacion';
import TextInput from '../components/TextInput';
import SelectInput from '../components/SelectInput';
import FondoModulo from '../components/FondoModulo';
import { useAmbientes } from '../hooks/useAmbientes';
import { useAuth } from '../hooks/useAuth';

// Trazabilidad: RF-02 · Nielsen H1, H4, H5, H7, H8 · Shneiderman S1..S5 · ISO 9241-11
export default function Ambientes({ alReservarAmbiente }) {
  const { usuario } = useAuth();
  const rol = usuario?.rol || 'Solicitante';

  const {
    ambientes,
    cargando,
    error,
    recargar,
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
    erroresForm,
    guardando,
    guardarAmbiente,
  } = useAmbientes();

  const opcionesTipos = [
    { value: 'LaboratorioComputo', label: 'Laboratorio de Cómputo' },
    { value: 'Auditorio', label: 'Auditorio' },
    { value: 'SalaReuniones', label: 'Sala de Reuniones' },
    { value: 'LaboratorioEspecializado', label: 'Laboratorio Especializado' },
  ];

  const columnas = [
    {
      header: 'Ambiente',
      render: (amb) => (
        <div>
          <p className="font-semibold text-slate-900 dark:text-slate-100">{amb.nombre}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Tipo: {amb.tipo}</p>
        </div>
      ),
    },
    {
      header: 'Capacidad',
      render: (amb) => (
        <span className="inline-flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
          <Users className="w-3.5 h-3.5 text-slate-400" />
          {amb.capacidad} personas
        </span>
      ),
    },
    {
      header: 'Ubicación / Pabellón',
      render: (amb) => (
        <span className="inline-flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          {amb.ubicacion}
        </span>
      ),
    },
    {
      header: 'Estado',
      render: (amb) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
          {amb.estado}
        </span>
      ),
    },
    {
      header: 'Acción',
      className: 'text-right',
      render: (amb) => (
        <Button
          variant="outline"
          size="sm"
          icon={CalendarPlus}
          onClick={() => alReservarAmbiente && alReservarAmbiente(amb.id)}
          ariaLabel={`Reservar el ambiente ${amb.nombre}`}
        >
          Reservar
        </Button>
      ),
    },
  ];

  return (
    <FondoModulo
      imagen="/backgrounds/bg_ambientes.jpg"
      className="rounded-2xl"
    >
    <div className="relative z-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <DoorOpen className="w-6 h-6 text-sky-700 dark:text-sky-400" aria-hidden="true" />
            <span>Ambientes Universitarios UPLA</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Catálogo oficial de aulas, auditorios y laboratorios disponibles para actividades académicas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={recargar}
            icon={RefreshCw}
            ariaLabel="Refrescar catálogo"
          >
            Actualizar
          </Button>

          {rol === 'Administrador' && (
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={abrirModalCrear}
            >
              Nuevo Ambiente
            </Button>
          )}
        </div>
      </div>

      {error && (
        <AlertMessage
          type="error"
          message={error}
        />
      )}

      <TableList
        caption="Catálogo de ambientes universitarios disponibles"
        columns={columnas}
        data={ambientes}
        loading={cargando}
        emptyMessage="No hay ambientes registrados en este momento."
        renderMobileCard={(amb) => (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{amb.nombre}</span>
              <span className="text-xs text-slate-500">{amb.tipo}</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              📍 {amb.ubicacion} · 👥 {amb.capacidad} personas
            </p>
            <div className="pt-2 flex justify-end border-t border-slate-100 dark:border-slate-700">
              <Button
                variant="outline"
                size="sm"
                icon={CalendarPlus}
                onClick={() => alReservarAmbiente && alReservarAmbiente(amb.id)}
              >
                Reservar
              </Button>
            </div>
          </div>
        )}
      />

      {/* Modal para Crear Ambiente (RF-02 · Administrador) */}
      <ModalConfirmacion
        isOpen={modalAbierto}
        onClose={cerrarModalCrear}
        onConfirm={guardarAmbiente}
        title="Registrar Nuevo Ambiente"
        message="Ingrese las especificaciones del nuevo ambiente para darlo de alta en el sistema."
        confirmText="Guardar Ambiente"
        cancelText="Cancelar"
        variant="primary"
        loading={guardando}
      >
        <form onSubmit={guardarAmbiente} className="space-y-3 mt-3">
          {erroresForm.general && (
            <AlertMessage
              type="error"
              message={erroresForm.general}
            />
          )}

          <TextInput
            id="ambiente-nombre"
            label="Nombre del ambiente"
            placeholder="Ej. Auditorio Central"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            error={erroresForm.nombre}
            obligatorio
            autoFocus
          />

          <SelectInput
            id="ambiente-tipo"
            label="Tipo de ambiente"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            options={opcionesTipos}
            obligatorio
          />

          <TextInput
            id="ambiente-capacidad"
            label="Capacidad (aforo)"
            type="number"
            min="1"
            max="1000"
            value={capacidad}
            onChange={(e) => setCapacidad(e.target.value)}
            error={erroresForm.capacidad}
            obligatorio
          />

          <TextInput
            id="ambiente-ubicacion"
            label="Ubicación / Pabellón"
            placeholder="Ej. Pabellón G - 2do Piso"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            error={erroresForm.ubicacion}
            obligatorio
          />
        </form>
      </ModalConfirmacion>
    </div>
    </FondoModulo>
  );
}
