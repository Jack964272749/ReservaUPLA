import React, { useState, useEffect } from 'react';
import { Users, Shield, RefreshCw } from 'lucide-react';
import TableList from '../components/TableList';
import Button from '../components/Button';
import AlertMessage from '../components/AlertMessage';
import { usuarioService } from '../services/usuarioService';

// Trazabilidad: RF-01 · Nielsen H1, H4, H8 · Shneiderman S1, S2
export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

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
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
          {u.activo ? 'Activo' : 'Inactivo'}
        </span>
      ),
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
            Gestión institucional de cuentas y asignación de roles.
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
    </div>
  );
}
