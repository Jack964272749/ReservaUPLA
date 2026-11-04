import React, { useState, useEffect } from 'react';
import { Users, Shield, RefreshCw, Pencil, UserX, UserCheck } from 'lucide-react';
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

// Trazabilidad: RF-01 · Nielsen H1, H3, H4, H5, H8 · Shneiderman S1, S2 · ISO 9241-11
export default function Usuarios() {
  const { usuario: usuarioActual } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(null);

  // Estados para modal de edición
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [editNombre, setEditNombre] = useState('');
  const [editRol, setEditRol] = useState('');
  const [editActivo, setEditActivo] = useState(true);
  const [errorEditNombre, setErrorEditNombre] = useState(null);
  const [guardandoEdit, setGuardandoEdit] = useState(false);

  // Estados para modal de confirmación de estado (activar / desactivar)
  const [usuarioCambioEstado, setUsuarioCambioEstado] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState(false);
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

  const abrirModalEditar = (u) => {
    setUsuarioEditando(u);
    setEditNombre(u.nombreCompleto);
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

  const pedirConfirmacionEstado = (u, activar) => {
    setUsuarioCambioEstado(u);
    setNuevoEstado(activar);
    setError(null);
  };

  const confirmarCambioEstado = async () => {
    if (!usuarioCambioEstado) return;

    setProcesandoEstado(true);
    setError(null);
    setMensajeExito(null);

    const res = await usuarioService.cambiarEstado(usuarioCambioEstado.id, nuevoEstado);

    if (res.exito) {
      const accion = nuevoEstado ? 'activada' : 'desactivada';
      setMensajeExito(`La cuenta de '${usuarioCambioEstado.nombreCompleto}' fue ${accion} correctamente.`);
      setUsuarioCambioEstado(null);
      cargarUsuarios();
    } else {
      setError(res.error || 'Error al cambiar el estado de la cuenta.');
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
    { value: 'false', label: 'Inactivo (Acceso suspendido)' },
  ];

  const columnas = [
    {
      header: 'Nombre Completo',
      render: (u) => (
        <div>
          <p className="font-semibold text-slate-900 dark:text-slate-100">{u.nombreCompleto}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">ID: {u.id.substring(0, 8)}…</p>
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
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
            u.activo
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
              : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-800'
          }`}
        >
          {u.activo ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      header: 'Acciones',
      render: (u) => {
        const esMismoAdmin = usuarioActual && (usuarioActual.id === u.id || usuarioActual.correo === u.correo);

        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => abrirModalEditar(u)}
              icon={Pencil}
              ariaLabel={`Modificar cuenta de ${u.nombreCompleto}`}
            >
              Editar
            </Button>

            {u.activo ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => pedirConfirmacionEstado(u, false)}
                disabled={esMismoAdmin}
                icon={UserX}
                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 border-rose-200 dark:border-rose-900/50"
                ariaLabel={`Desactivar cuenta de ${u.nombreCompleto}`}
                title={esMismoAdmin ? 'No puede desactivar su propia cuenta en uso' : 'Desactivar cuenta'}
              >
                Desactivar
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => pedirConfirmacionEstado(u, true)}
                icon={UserCheck}
                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50"
                ariaLabel={`Activar cuenta de ${u.nombreCompleto}`}
              >
                Activar
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-sky-700 dark:text-sky-400" aria-hidden="true" />
            <span>Usuarios del Sistema ReservaUPLA</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gestión institucional de cuentas, control de estado y visualización de roles.
          </p>
        </div>

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
        data={usuarios}
        loading={cargando}
        emptyMessage="No se encontraron usuarios registrados."
      />

      {/* Modal para Modificar Datos de Usuario (Nielsen H3, H5, H8 · ISO 9241-11) */}
      <ModalConfirmacion
        isOpen={Boolean(usuarioEditando)}
        onClose={cerrarModalEditar}
        onConfirm={guardarEdicion}
        title="Modificar Usuario"
        message="Actualice los datos permitidos del usuario seleccionado."
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

            <TextInput
              id="edit-rol"
              label="Rol institucional asignado"
              value={editRol}
              disabled
              ayuda="El rol asignado (Solicitante, Responsable o Administrador) es inmutable y está bloqueado."
            />

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
                  : undefined
              }
              disabled={usuarioActual?.id === usuarioEditando.id}
            />
          </div>
        )}
      </ModalConfirmacion>

      {/* Modal para Confirmar Activación / Desactivación */}
      <ModalConfirmacion
        isOpen={Boolean(usuarioCambioEstado)}
        onClose={() => setUsuarioCambioEstado(null)}
        onConfirm={confirmarCambioEstado}
        title={nuevoEstado ? '¿Activar cuenta de usuario?' : '¿Desactivar cuenta de usuario?'}
        message={
          nuevoEstado
            ? `¿Desea reactivar el acceso al sistema para '${usuarioCambioEstado?.nombreCompleto}'?`
            : `¿Está seguro de suspender el acceso de '${usuarioCambioEstado?.nombreCompleto}'? El usuario no podrá iniciar sesión mientras su cuenta permanezca inactiva.`
        }
        confirmText={
          procesandoEstado
            ? 'Procesando…'
            : nuevoEstado
            ? 'Activar Cuenta'
            : 'Desactivar Cuenta'
        }
        cancelText="Cancelar"
        variant={nuevoEstado ? 'primary' : 'danger'}
        loading={procesandoEstado}
      />
    </div>
  );
}
