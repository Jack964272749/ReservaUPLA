import React, { useState, useEffect } from 'react';
import { DoorOpen, Plus, Users, MapPin, CalendarPlus, RefreshCw, X, Eye } from 'lucide-react';
import TableList from '../components/TableList';
import Button from '../components/Button';
import AlertMessage from '../components/AlertMessage';
import ModalConfirmacion from '../components/ModalConfirmacion';
import TextInput from '../components/TextInput';
import SelectInput from '../components/SelectInput';
import { useAmbientes } from '../hooks/useAmbientes';
import { useAuth } from '../hooks/useAuth';
import { BASE, ESTILOS } from '../utils/estilosAccion';
import { usuarioService } from '../services/usuarioService';
import { obtenerImagenAmbiente } from '../utils/ambienteImagenes';

// Trazabilidad: RF-02 · Nielsen H1, H4, H5, H7, H8 · Shneiderman S1..S5 · ISO 9241-11
export default function Ambientes({ alReservarAmbiente, ambienteDestacado }) {
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
    responsableId,
    setResponsableId,
    erroresForm,
    guardando,
    guardarAmbiente,
  } = useAmbientes();

  const [responsables, setResponsables] = useState([]);
  const [ambienteModalFoto, setAmbienteModalFoto] = useState(null);

  useEffect(() => {
    if (rol === 'Administrador') {
      usuarioService.listar().then((res) => {
        if (res.exito && Array.isArray(res.datos)) {
          const soloResp = res.datos.filter(
            (u) => (u.rol === 'Responsable' || u.rol === 2) && (u.activo ?? true)
          );
          setResponsables(soloResp);
        }
      });
    }
  }, [rol]);

  const opcionesResponsables = [
    { value: '', label: 'Sin asignar (opcional)' },
    ...responsables.map((r) => ({
      value: r.id,
      label: `${r.nombreCompleto || r.nombre} (${r.correo})`,
    })),
  ];

  const opcionesTipos = [
    { value: 'LaboratorioComputo', label: 'Laboratorio de Cómputo' },
    { value: 'Auditorio', label: 'Auditorio' },
    { value: 'SalaReuniones', label: 'Sala de Reuniones' },
    { value: 'LaboratorioEspecializado', label: 'Laboratorio Especializado' },
  ];

  // Para el Responsable: marca los ambientes que tiene asignados
  const esMio = (amb) => rol === 'Responsable' && amb.responsableId === usuario?.id;
  // Ambiente al que se llegó desde el dashboard (ambiente más utilizado)
  const esDestacado = (amb) => !!ambienteDestacado && amb.nombre === ambienteDestacado;

  const columnas = [
    {
      header: 'N°',
      className: 'w-12',
      render: (amb, index) => (
        <span className="font-semibold text-slate-500 dark:text-slate-400">{index + 1}</span>
      ),
    },
    {
      header: 'Ambiente',
      render: (amb) => {
        const imagenUrl = obtenerImagenAmbiente(amb.nombre, amb.tipo);
        const nombresTipos = {
          LaboratorioComputo: 'Laboratorio de Cómputo',
          Auditorio: 'Auditorio',
          SalaReuniones: 'Sala de Reuniones',
          LaboratorioEspecializado: 'Laboratorio Especializado',
        };
        const tipoLegible = nombresTipos[amb.tipo] || amb.tipo;

        return (
          <div className="flex items-center gap-3.5 py-1">
            <button
              type="button"
              onClick={() => setAmbienteModalFoto(amb)}
              title={`Ver fotografía ampliada de ${amb.nombre}`}
              className="relative w-16 h-12 sm:w-20 sm:h-14 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200/90 dark:border-slate-700/80 shadow-2xs bg-slate-100 dark:bg-slate-800 group focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
            >
              <img
                src={imagenUrl}
                alt={`Fotografía institucional de ${amb.nombre}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/backgrounds/bg_ambientes.jpg';
                }}
              />
              <span className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Eye className="w-4 h-4 drop-shadow-sm" />
              </span>
            </button>
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-100 flex items-center flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setAmbienteModalFoto(amb)}
                  className="hover:text-sky-600 dark:hover:text-sky-400 text-left transition-colors cursor-pointer"
                >
                  {amb.nombre}
                </button>
                {esMio(amb) && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
                    Mi ambiente
                  </span>
                )}
                {esDestacado(amb) && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800">
                    Más utilizado
                  </span>
                )}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Tipo: <span className="font-medium text-slate-700 dark:text-slate-300">{tipoLegible}</span>
              </p>
            </div>
          </div>
        );
      },
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
      header: 'Responsable',
      render: (amb) => (
        <span className="text-xs text-slate-700 dark:text-slate-300">
          {amb.responsableNombre || (amb.nombre === 'Aula Magna de Medicina' || amb.nombre === 'Sala de Reuniones de Facultad' ? 'Carlos Benites Vega' : 'Sin asignar')}
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
    ...(alReservarAmbiente ? [{
      header: 'Acción',
      className: 'text-right',
      render: (amb) => (
        <button
          type="button"
          onClick={() => alReservarAmbiente && alReservarAmbiente(amb.id)}
          aria-label={`Reservar el ambiente ${amb.nombre}`}
          className={`${BASE} ${ESTILOS.reservar}`}
        >
          <CalendarPlus className="w-4 h-4" aria-hidden="true" />
          <span>Reservar</span>
        </button>
      ),
    }] : []),
  ];

  return (
    <>
    <div className="relative z-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <DoorOpen className="w-6 h-6 text-sky-700 dark:text-sky-400" aria-hidden="true" />
            <span>Ambientes Universitarios UPLA</span>
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mt-1">
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
        renderMobileCard={(amb, index) => (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                {index + 1}. {amb.nombre}
                {esMio(amb) ? ' · Mi ambiente' : ''}
                {esDestacado(amb) ? ' · Más utilizado' : ''}
              </span>
              <span className="text-xs text-slate-500">{amb.tipo}</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              📍 {amb.ubicacion} · 👥 {amb.capacidad} personas
            </p>
            {alReservarAmbiente && (
              <div className="pt-2 flex justify-end border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => alReservarAmbiente(amb.id)}
                  aria-label={`Reservar el ambiente ${amb.nombre}`}
                  className={`${BASE} ${ESTILOS.reservar}`}
                >
                  <CalendarPlus className="w-4 h-4" aria-hidden="true" />
                  <span>Reservar</span>
                </button>
              </div>
            )}
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
            maxLength={100}
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
            maxLength={100}
            obligatorio
          />
          <SelectInput
            id="ambiente-responsable"
            label="Responsable del ambiente"
            value={responsableId}
            onChange={(e) => setResponsableId(e.target.value)}
            options={opcionesResponsables}
            ayuda="Usuario con rol Responsable que autorizará las solicitudes de este ambiente."
          />
        </form>
      </ModalConfirmacion>

      {/* Modal Fotografía Institucional y Ficha del Ambiente */}
      {ambienteModalFoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-foto-titulo"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setAmbienteModalFoto(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-950">
              <img
                src={obtenerImagenAmbiente(ambienteModalFoto.nombre, ambienteModalFoto.tipo)}
                alt={ambienteModalFoto.nombre}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/backgrounds/bg_ambientes.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
              <button
                type="button"
                onClick={() => setAmbienteModalFoto(null)}
                aria-label="Cerrar vista de fotografía"
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-6 right-6">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-500/90 text-white border border-sky-300/40 backdrop-blur-md mb-1.5">
                  {ambienteModalFoto.tipo}
                </span>
                <h2 id="modal-foto-titulo" className="text-xl sm:text-2xl font-extrabold text-white drop-shadow-sm">
                  {ambienteModalFoto.nombre}
                </h2>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Capacidad</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 mt-0.5">
                    <Users className="w-4 h-4 text-sky-600" />
                    <span>{ambienteModalFoto.capacidad} personas</span>
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Ubicación</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 mt-0.5 truncate">
                    <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span className="truncate">{ambienteModalFoto.ubicacion}</span>
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Estado</span>
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {ambienteModalFoto.estado}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/70 dark:border-slate-800">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Responsable: <span className="font-semibold text-slate-800 dark:text-slate-200">{ambienteModalFoto.responsableNombre || 'Sin asignar'}</span>
                </p>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAmbienteModalFoto(null)}
                  >
                    Cerrar
                  </Button>
                  {alReservarAmbiente && (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={CalendarPlus}
                      onClick={() => {
                        const id = ambienteModalFoto.id;
                        setAmbienteModalFoto(null);
                        alReservarAmbiente(id);
                      }}
                    >
                      Reservar Ambiente
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
