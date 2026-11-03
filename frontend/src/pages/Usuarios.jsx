import React, { useState, useEffect } from 'react';
import { Users, UserPlus, RefreshCw, Mail, CheckCircle } from 'lucide-react';
import TableList from '../components/TableList';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import SelectInput from '../components/SelectInput';
import AlertMessage from '../components/AlertMessage';
import { api } from '../services/api';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [alert, setAlert] = useState(null);

  const [formData, setFormData] = useState({
    nombreCompleto: '',
    correo: '',
    rol: 'Solicitante',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const data = await api.getUsuarios();
      setUsuarios(data);
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Error al cargar usuarios.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.nombreCompleto.trim()) newErrors.nombreCompleto = 'El nombre completo es obligatorio.';
    if (!formData.correo.trim()) {
      newErrors.correo = 'El correo institucional es obligatorio.';
    } else if (!formData.correo.includes('@')) {
      newErrors.correo = 'Ingrese un formato de correo válido.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      await api.createUsuario(formData);
      setAlert({ type: 'success', message: 'Usuario registrado con éxito.' });
      setFormData({
        nombreCompleto: '',
        correo: '',
        rol: 'Solicitante',
      });
      setShowForm(false);
      fetchUsuarios();
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Nombre Completo',
      render: (u) => (
        <div>
          <span className="font-semibold text-slate-800">{u.nombreCompleto}</span>
          <p className="text-xs text-slate-400">ID: {u.id.slice(0, 8)}...</p>
        </div>
      ),
    },
    {
      header: 'Correo Electrónico',
      render: (u) => (
        <span className="flex items-center gap-1.5 text-xs font-mono text-slate-600">
          <Mail className="w-3.5 h-3.5 text-slate-400" />
          {u.correo}
        </span>
      ),
    },
    {
      header: 'Rol Institucional',
      render: (u) => (
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
            u.rol === 'Administrador'
              ? 'bg-purple-100 text-purple-800 border border-purple-200'
              : u.rol === 'Responsable de ambiente'
              ? 'bg-sky-100 text-sky-800 border border-sky-200'
              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
          }`}
        >
          {u.rol}
        </span>
      ),
    },
    {
      header: 'Estado',
      align: 'center',
      render: (u) => (
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
            u.activo ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
          }`}
        >
          {u.activo ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Usuarios y Solicitantes</h1>
          <p className="text-sm text-slate-500">
            Registro y administración de docentes, alumnos y administradores (RF-01).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={RefreshCw} onClick={fetchUsuarios} loading={loading}>
            Refrescar
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={UserPlus}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Ocultar Formulario' : 'Nuevo Usuario'}
          </Button>
        </div>
      </div>

      {alert && (
        <AlertMessage
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Formulario Registro de Usuario (RF-01) */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 animate-fade-in">
          <h2 className="text-base font-bold text-slate-900 border-b pb-2">Registrar Nuevo Usuario Solicitante</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <TextInput
              label="Nombre Completo"
              name="nombreCompleto"
              value={formData.nombreCompleto}
              onChange={handleChange}
              placeholder="Ej. Ing. Carlos Medina"
              required
              error={errors.nombreCompleto}
            />

            <TextInput
              label="Correo Institucional"
              name="correo"
              type="email"
              value={formData.correo}
              onChange={handleChange}
              placeholder="cmedina@upla.edu.pe"
              required
              error={errors.correo}
            />

            <SelectInput
              label="Rol"
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              required
              options={[
                { value: 'Solicitante', label: 'Solicitante (Docente / Alumno)' },
                { value: 'Responsable de ambiente', label: 'Responsable de ambiente' },
                { value: 'Administrador', label: 'Administrador' },
              ]}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={submitting}>
              Guardar Usuario
            </Button>
          </div>
        </form>
      )}

      {/* Listado */}
      <TableList
        columns={columns}
        data={usuarios}
        loading={loading}
        emptyMessage="No hay usuarios registrados."
      />
    </div>
  );
}
