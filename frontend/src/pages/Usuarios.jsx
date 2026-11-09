import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Shield,
  RefreshCw,
  Pencil,
  UserX,
  UserCheck,
  UserPlus,
  Clock,
  KeyRound,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import TableList from '../components/TableList';
import Button from '../components/Button';
import AlertMessage from '../components/AlertMessage';
import ModalConfirmacion from '../components/ModalConfirmacion';
import TextInput from '../components/TextInput';
import SelectInput from '../components/SelectInput';
import { useAuth } from '../hooks/useAuth';
import { usuarioService } from '../services/usuarioService';
import { REGLAS } from '../constants/reglas';
import { MENSAJES } from '../constants/mensajes';
import { BASE, ESTILOS, DESHABILITADO } from '../utils/estilosAccion';
import { validarCorreo, validarNombre, validarClave } from '../validation/validaciones';
import { normalizarTexto, normalizarCorreo } from '../utils/normalizar';

// Trazabilidad: RF-01 · Nielsen H1, H3, H4, H5, H8 · Shneiderman S1, S2 · ISO 9241-11
export default function Usuarios() {
  const { usuario: usuarioActual } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('todos'); // 'todos' | 'pendientes' | 'activos' | 'inactivos'

  // Estados para modal de registro por Administrador
  const [modalRegistroAbierto, setModalRegistroAbierto] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoCodigo, setNuevoCodigo] = useState('');
  const [nuevoCorreo, setNuevoCorreo] = useState('');
  const [nuevoRol, setNuevoRol] = useState('Solicitante');
  const [nuevaClave, setNuevaClave] = useState('');
  const [erroresRegistro, setErroresRegistro] = useState({});
  const [guardandoRegistro, setGuardandoRegistro] = useState(false);

  // Estados para modal de edición
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [editNombre, setEditNombre] = useState('');
  const [editCodigo, setEditCodigo] = useState('');
  const [editRol, setEditRol] = useState('');
  const [editActivo, setEditActivo] = useState(true);
  const [errorEditNombre, setErrorEditNombre] = useState(null);
  const [guardandoEdit, setGuardandoEdit] = useState(false);

  // Estados para modal de confirmación de estado (activar / desactivar / validar)
  const [usuarioCambioEstado, setUsuarioCambioEstado] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState(false);
  const [esValidacionDirecta, setEsValidacionDirecta] = useState(false);
  const [procesandoEstado, setProcesandoEstado] = useState(false);

  const cargarUsuarios = async () => {
    setCargando(true);
    setError(null);
    const res = await usuarioService.listar();
    if (res.exito && res.datos) {
      setUsuarios(res.datos);
    } else {
      setError(res.error || 'Error al obtener el listado de usuarios.');
    }
    setCargando(false);
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // Conteos para tabs y métricas
  const pendientes = useMemo(() => usuarios.filter((u) => !u.activo), [usuarios]);
  const activos = useMemo(() => usuarios.filter((u) => u.activo), [usuarios]);

  const usuariosFiltrados = useMemo(() => {
    if (filtroEstado === 'pendientes') return pendientes;
    if (filtroEstado === 'activos') return activos;
    return usuarios;
  }, [usuarios, filtroEstado, pendientes, activos]);

  // Generador de clave aleatoria institucional
  const generarClaveTemporal = () => {
    const prefijo = 'Upla' + Math.floor(1000 + Math.random() * 9000);
    const clave = `${prefijo}*Segura`;
    setNuevaClave(clave);
    if (erroresRegistro.contrasena) {
      setErroresRegistro((prev) => ({ ...prev, contrasena: null }));
    }
  };

  const abrirModalCrearUsuario = () => {
    setNuevoNombre('');
    setNuevoCodigo('');
    setNuevoCorreo('');
    setNuevoRol('Solicitante');
    generarClaveTemporal();
    setErroresRegistro({});
    setError(null);
    setMensajeExito(null);
    setModalRegistroAbierto(true);
  };

  const cerrarModalCrearUsuario = () => {
    setModalRegistroAbierto(false);
    setErroresRegistro({});
  };

  const guardarNuevoUsuario = async () => {
    const errs = {};
    const nombreLimpio = normalizarTexto(nuevoNombre);
    const codigoLimpio = (nuevoCodigo || '').trim().toUpperCase();
    const correoLimpio = normalizarCorreo(nuevoCorreo);

    const errNombre = validarNombre(nombreLimpio);
    if (errNombre) errs.nombreCompleto = errNombre;

    if (!codigoLimpio) {
      errs.codigo = 'El código institucional o matrícula es requerido.';
    } else if (codigoLimpio.length < 4 || codigoLimpio.length > 20) {
      errs.codigo = 'El código debe tener entre 4 y 20 caracteres.';
    }

    const errCorreo = validarCorreo(correoLimpio);
    if (errCorreo) errs.correo = errCorreo;

    const errClave = validarClave(nuevaClave);
    if (errClave) errs.contrasena = errClave;

    if (Object.keys(errs).length > 0) {
      setErroresRegistro(errs);
      return;
    }

    setGuardandoRegistro(true);
    setError(null);
    setMensajeExito(null);

    const res = await usuarioService.crearPorAdmin({
      nombreCompleto: nombreLimpio,
      codigo: codigoLimpio,
      correo: correoLimpio,
      rol: nuevoRol,
      contrasena: nuevaClave,
      activo: true, // Creado directamente por el Administrador -> cuenta verificada y activa
    });

    if (res.exito) {
      setMensajeExito(`Usuario '${nombreLimpio}' (Cód: ${codigoLimpio}) registrado y activado exitosamente.`);
      cerrarModalCrearUsuario();
      cargarUsuarios();
    } else {
      setError(res.error || 'Error al registrar el usuario en el sistema.');
    }

    setGuardandoRegistro(false);
  };

  const abrirModalEditar = (u) => {
    setUsuarioEditando(u);
    setEditNombre(u.nombreCompleto);
    setEditCodigo(u.codigo || '');
    setEditRol(u.rol);
    setEditActivo(u.activo);
    setErrorEditNombre(null);
    setError(null);
  };

  const cerrarModalEditar = () => {
    setUsuarioEditando(null);
    setErrorEditNombre(null);
  };

  const guardarEdicion = async () => {
    if (!usuarioEditando) return;

    const nombreLimpio = editNombre.trim();
    if (!nombreLimpio) {
      setErrorEditNombre(MENSAJES.NOMBRE_REQUERIDO);
      return;
    }
    if (
      nombreLimpio.length < REGLAS.USUARIO.MIN_NOMBRE ||
      nombreLimpio.length > REGLAS.USUARIO.MAX_NOMBRE
    ) {
      setErrorEditNombre(MENSAJES.NOMBRE_LONGITUD);
      return;
    }
    if (!REGLAS.USUARIO.REGEX_NOMBRE.test(nombreLimpio)) {
      setErrorEditNombre(MENSAJES.NOMBRE_INVALIDO);
      return;
    }

    setGuardandoEdit(true);
    setError(null);
    setMensajeExito(null);

    const res = await usuarioService.actualizar(usuarioEditando.id, {
      nombreCompleto: nombreLimpio,
      codigo: editCodigo ? editCodigo.trim().toUpperCase() : null,
      rol: editRol,
      activo: editActivo,
    });

    if (res.exito) {
      setMensajeExito(`Usuario '${nombreLimpio}' actualizado correctamente.`);
      cerrarModalEditar();
      cargarUsuarios();
    } else {
      setError(res.error || 'Error al actualizar el usuario.');
    }

    setGuardandoEdit(false);
  };

  const pedirValidacionCuenta = (u) => {
    setUsuarioCambioEstado(u);
    setNuevoEstado(true);
    setEsValidacionDirecta(true);
    setError(null);
  };

  const pedirConfirmacionEstado = (u, activar) => {
    setUsuarioCambioEstado(u);
    setNuevoEstado(activar);
    setEsValidacionDirecta(false);
    setError(null);
  };

  const confirmarCambioEstado = async () => {
    if (!usuarioCambioEstado) return;

    setProcesandoEstado(true);
    setError(null);
    setMensajeExito(null);

    const res = await usuarioService.cambiarEstado(usuarioCambioEstado.id, nuevoEstado);

    if (res.exito) {
      if (esValidacionDirecta) {
        setMensajeExito(
          `¡Cuenta institucional de '${usuarioCambioEstado.nombreCompleto}' validada y activada con éxito! Ya puede iniciar sesión.`
        );
      } else {
        const accion = nuevoEstado ? 'activada' : 'desactivada';
        setMensajeExito(`La cuenta de '${usuarioCambioEstado.nombreCompleto}' fue ${accion} correctamente.`);
      }
      setUsuarioCambioEstado(null);
      cargarUsuarios();
    } else {
      setError(res.error || 'Error al procesar el estado de la cuenta.');
      setUsuarioCambioEstado(null);
    }

    setProcesandoEstado(false);
  };

  const badgeRol = (rol) => {
    const config = {
      Administrador: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-300',
      Responsable: 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border-sky-300',
      Solicitante: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300',
    }[rol] || 'bg-slate-100 text-slate-800';

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config}`}>
        <Shield className="w-3 h-3" />
        {rol}
      </span>
    );
  };

  const opcionesEstado = [
    { value: 'true', label: 'Activo (Acceso permitido)' },
    { value: 'false', label: 'Inactivo / Pendiente (Acceso bloqueado)' },
  ];

  const opcionesRoles = [
    { value: 'Solicitante', label: 'Solicitante (Docente / Estudiante)' },
    { value: 'Responsable', label: 'Responsable (Encargado de Ambiente)' },
    { value: 'Administrador', label: 'Administrador (Control Total del Campus)' },
  ];

  const columnas = [
    {
      header: 'Nombre Completo',
      render: (u) => (
        <div>
          <p className="font-semibold text-slate-900 dark:text-slate-100">{u.nombreCompleto}</p>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {u.codigo ? (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 font-mono font-bold text-[11px]">
                Cód: {u.codigo}
              </span>
            ) : (
              <span className="text-[11px] text-slate-400 italic">Sin código</span>
            )}
            <span>· ID: {u.id.substring(0, 8)}…</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Correo Electrónico',
      render: (u) => (
        <span className="text-xs font-mono text-slate-700 dark:text-slate-300">
          {u.correo}
        </span>
      ),
    },
    {
      header: 'Rol en el Sistema',
      render: (u) => badgeRol(u.rol),
    },
    {
      header: 'Estado',
      render: (u) => (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
            u.activo
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800'
          }`}
        >
          {u.activo ? (
            <>
              <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>Activo</span>
            </>
          ) : (
            <>
              <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              <span>Pendiente de Validación</span>
            </>
          )}
        </span>
      ),
    },
    {
      header: 'Acciones',
      render: (u) => {
        const esMismoAdmin = usuarioActual && (usuarioActual.id === u.id || usuarioActual.correo === u.correo);

        return (
          <div className="flex flex-wrap items-center gap-2">
            {!u.activo ? (
              <button
                type="button"
                onClick={() => pedirValidacionCuenta(u)}
                aria-label={`Validar y activar cuenta de ${u.nombreCompleto}`}
                title="Aprobar y habilitar cuenta institucional"
                className={`${BASE} ${ESTILOS.aprobar} font-bold`}
              >
                <UserCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-300" aria-hidden="true" />
                <span>Validar Cuenta</span>
              </button>
            ) : null}

            <button
              type="button"
              onClick={() => abrirModalEditar(u)}
              aria-label={`Modificar cuenta de ${u.nombreCompleto}`}
              title="Editar cuenta"
              className={`${BASE} ${ESTILOS.ver}`}
            >
              <Pencil className="w-4 h-4" aria-hidden="true" />
              <span>Editar</span>
            </button>

            {u.activo && (
              <button
                type="button"
                onClick={() => pedirConfirmacionEstado(u, false)}
                disabled={esMismoAdmin}
                aria-label={`Desactivar cuenta de ${u.nombreCompleto}`}
                title={esMismoAdmin ? 'No puede desactivar su propia cuenta en uso' : 'Suspender acceso a la cuenta'}
                className={`${BASE} ${ESTILOS.rechazar} ${DESHABILITADO}`}
              >
                <UserX className="w-4 h-4" aria-hidden="true" />
                <span>Desactivar</span>
              </button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Encabezado con Botones Principales */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-sky-700 dark:text-sky-400" aria-hidden="true" />
            <span>Usuarios del Sistema ReservaUPLA</span>
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mt-1">
            Gestión institucional de cuentas, control de estado y validación de usuarios universitarios.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="primary"
            size="sm"
            onClick={abrirModalCrearUsuario}
            icon={UserPlus}
            ariaLabel="Registrar nuevo usuario con código institucional"
            className="font-semibold shadow-xs"
          >
            + Registrar Usuario
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={cargarUsuarios}
            icon={RefreshCw}
            ariaLabel="Actualizar lista de usuarios"
          >
            Actualizar
          </Button>
        </div>
      </div>

      {/* Alerta de Cuentas Pendientes de Validación */}
      {pendientes.length > 0 && (
        <div
          role="status"
          className="p-4 rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/90 dark:bg-amber-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900 dark:text-amber-200 shadow-xs"
        >
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-lg bg-amber-200 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200">
              <Clock className="w-5 h-5" />
            </span>
            <div>
              <p className="text-sm font-bold">
                {pendientes.length} {pendientes.length === 1 ? 'cuenta pendiente de validación' : 'cuentas pendientes de validación'}
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-400">
                Usuarios auto-registrados que esperan su aprobación para reservar ambientes universitarios.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="xs"
              variant={filtroEstado === 'pendientes' ? 'primary' : 'outline'}
              onClick={() => setFiltroEstado(filtroEstado === 'pendientes' ? 'todos' : 'pendientes')}
            >
              {filtroEstado === 'pendientes' ? 'Mostrar Todos' : 'Ver Solo Pendientes'}
            </Button>
          </div>
        </div>
      )}

      {/* Selector de Filtros por Estado */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto text-xs">
        <button
          type="button"
          onClick={() => setFiltroEstado('todos')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            filtroEstado === 'todos'
              ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Todos ({usuarios.length})
        </button>

        <button
          type="button"
          onClick={() => setFiltroEstado('pendientes')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            filtroEstado === 'pendientes'
              ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-200'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>Pendientes de Validación</span>
          {pendientes.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-bold">
              {pendientes.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setFiltroEstado('activos')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            filtroEstado === 'activos'
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Activos ({activos.length})
        </button>
      </div>

      {mensajeExito && (
        <AlertMessage
          type="success"
          message={mensajeExito}
        />
      )}

      {error && (
        <AlertMessage
          type="error"
          message={error}
        />
      )}

      <TableList
        caption="Directorio de usuarios registrados en el sistema"
        columns={columnas}
        data={usuariosFiltrados}
        loading={cargando}
        emptyMessage={
          filtroEstado === 'pendientes'
            ? '¡Excelente! No hay cuentas pendientes de validación en este momento.'
            : 'No se encontraron usuarios en este filtro.'
        }
      />

      {/* Modal para Registrar Usuario Directamente por el Administrador */}
      <ModalConfirmacion
        isOpen={modalRegistroAbierto}
        onClose={cerrarModalCrearUsuario}
        onConfirm={guardarNuevoUsuario}
        title="Registrar Nuevo Usuario Institucional"
        message="Complete los datos institucionales para crear y habilitar un nuevo usuario."
        confirmText={guardandoRegistro ? 'Registrando…' : 'Registrar y Activar Usuario'}
        cancelText="Cancelar"
        loading={guardandoRegistro}
        variant="primary"
      >
        <div className="space-y-4 text-left pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextInput
              id="nuevo-codigo"
              name="codigo"
              label="Código Institucional / Matrícula"
              placeholder="Ej. DOC-4921 o 202110452"
              value={nuevoCodigo}
              onChange={(e) => {
                setNuevoCodigo(e.target.value);
                if (erroresRegistro.codigo) setErroresRegistro((prev) => ({ ...prev, codigo: null }));
              }}
              error={erroresRegistro.codigo}
              obligatorio
              ayuda="Identificador institucional UPLA."
            />

            <TextInput
              id="nuevo-nombre"
              name="nombreCompleto"
              label="Nombre Completo"
              placeholder="Ej. Ing. Marco Aurelio Torres"
              value={nuevoNombre}
              onChange={(e) => {
                setNuevoNombre(e.target.value);
                if (erroresRegistro.nombreCompleto) setErroresRegistro((prev) => ({ ...prev, nombreCompleto: null }));
              }}
              error={erroresRegistro.nombreCompleto}
              obligatorio
              maxLength={REGLAS.USUARIO.MAX_NOMBRE}
            />
          </div>

          <TextInput
            id="nuevo-correo"
            name="correo"
            type="email"
            label="Correo Electrónico Institucional"
            placeholder="usuario@upla.edu.pe"
            value={nuevoCorreo}
            onChange={(e) => {
              setNuevoCorreo(e.target.value);
              if (erroresRegistro.correo) setErroresRegistro((prev) => ({ ...prev, correo: null }));
            }}
            error={erroresRegistro.correo}
            obligatorio
            ayuda="Debe ser una cuenta institucional (@upla.edu.pe)."
          />

          <SelectInput
            id="nuevo-rol"
            name="rol"
            label="Rol en el Sistema"
            value={nuevoRol}
            onChange={(e) => setNuevoRol(e.target.value)}
            options={opcionesRoles}
            obligatorio
            ayuda="Define los permisos en el sistema de reservas."
          />

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="nueva-clave" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Contraseña Inicial <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={generarClaveTemporal}
                className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
              >
                <KeyRound className="w-3 h-3" />
                Generar Clave Aleatoria
              </button>
            </div>
            <TextInput
              id="nueva-clave"
              name="contrasena"
              type="text"
              placeholder="Mínimo 6 caracteres"
              value={nuevaClave}
              onChange={(e) => {
                setNuevaClave(e.target.value);
                if (erroresRegistro.contrasena) setErroresRegistro((prev) => ({ ...prev, contrasena: null }));
              }}
              error={erroresRegistro.contrasena}
              obligatorio
              ayuda="El usuario podrá usar esta credencial para su primer acceso institucional."
            />
          </div>

          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              <strong>Validación Inmediata:</strong> Al ser registrado por el Administrador Central, la cuenta se creará directamente verificada y activa.
            </span>
          </div>
        </div>
      </ModalConfirmacion>

      {/* Modal para Modificar Datos de Usuario */}
      <ModalConfirmacion
        isOpen={Boolean(usuarioEditando)}
        onClose={cerrarModalEditar}
        onConfirm={guardarEdicion}
        title="Modificar Datos de Usuario"
        message="Actualice los datos institucionales del usuario seleccionado."
        confirmText={guardandoEdit ? 'Guardando…' : 'Guardar Cambios'}
        cancelText="Cancelar"
        loading={guardandoEdit}
      >
        {usuarioEditando && (
          <div className="space-y-4 text-left pt-2">
            <TextInput
              id="edit-correo"
              label="Correo institucional"
              value={usuarioEditando.correo}
              disabled
              ayuda="El correo institucional identifica la cuenta y es inmutable."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <TextInput
                id="edit-codigo"
                label="Código Institucional"
                value={editCodigo}
                onChange={(e) => setEditCodigo(e.target.value)}
                placeholder="Ej. DOC-4921 o 202110452"
                ayuda="Matrícula o código docente."
              />

              <TextInput
                id="edit-rol"
                label="Rol institucional"
                value={editRol}
                disabled
                ayuda="El rol es inmutable por seguridad."
              />
            </div>

            <TextInput
              id="edit-nombre"
              label="Nombre Completo"
              value={editNombre}
              onChange={(e) => {
                setEditNombre(e.target.value);
                if (errorEditNombre) setErrorEditNombre(null);
              }}
              error={errorEditNombre}
              obligatorio
              maxLength={REGLAS.USUARIO.MAX_NOMBRE}
              placeholder="Ej. Juan Pérez Huamán"
            />

            <SelectInput
              id="edit-estado"
              label="Estado de la Cuenta"
              value={editActivo ? 'true' : 'false'}
              onChange={(e) => setEditActivo(e.target.value === 'true')}
              options={opcionesEstado}
              obligatorio
              ayuda={
                usuarioActual?.id === usuarioEditando.id
                  ? 'Atención: No puede desactivar su propia cuenta en uso.'
                  : 'Cambiar a inactivo suspende el acceso al sistema.'
              }
              disabled={usuarioActual?.id === usuarioEditando.id}
            />
          </div>
        )}
      </ModalConfirmacion>

      {/* Modal para Confirmar Validación o Cambio de Estado */}
      <ModalConfirmacion
        isOpen={Boolean(usuarioCambioEstado)}
        onClose={() => setUsuarioCambioEstado(null)}
        onConfirm={confirmarCambioEstado}
        title={
          esValidacionDirecta
            ? 'Validar y Habilitar Cuenta Institucional'
            : nuevoEstado
            ? '¿Activar cuenta de usuario?'
            : '¿Desactivar cuenta de usuario?'
        }
        message={
          esValidacionDirecta
            ? `¿Desea validar y habilitar la cuenta de '${usuarioCambioEstado?.nombreCompleto}' (Código: ${
                usuarioCambioEstado?.codigo || 'S/C'
              }, Correo: ${usuarioCambioEstado?.correo})? El usuario podrá iniciar sesión inmediatamente en ReservaUPLA.`
            : nuevoEstado
            ? `¿Desea reactivar el acceso al sistema para '${usuarioCambioEstado?.nombreCompleto}'?`
            : `¿Está seguro de suspender el acceso de '${usuarioCambioEstado?.nombreCompleto}'? El usuario no podrá iniciar sesión mientras su cuenta permanezca inactiva.`
        }
        confirmText={
          procesandoEstado
            ? 'Procesando…'
            : esValidacionDirecta
            ? 'Validar y Activar Cuenta'
            : nuevoEstado
            ? 'Activar Cuenta'
            : 'Desactivar Cuenta'
        }
        cancelText="Cancelar"
        variant={nuevoEstado ? 'success' : 'danger'}
        loading={procesandoEstado}
      />
    </div>
  );
}
