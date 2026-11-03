import React, { useState, useEffect } from 'react';
import { DoorOpen, Plus, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import TableList from '../components/TableList';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import SelectInput from '../components/SelectInput';
import AlertMessage from '../components/AlertMessage';
import { api } from '../services/api';

export default function Ambientes() {
  const [ambientes, setAmbientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [alert, setAlert] = useState(null);

  const [formData, setFormData] = useState({
    nombre: '',
    tipo: 'Laboratorio de Cómputo',
    capacidad: 30,
    ubicacion: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const fetchAmbientes = async () => {
    setLoading(true);
    try {
      const data = await api.getAmbientes();
      setAmbientes(data);
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Error al cargar ambientes.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmbientes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre del ambiente es obligatorio.';
    if (!formData.tipo) newErrors.tipo = 'Seleccione el tipo de ambiente.';
    if (!formData.capacidad || Number(formData.capacidad) <= 0) {
      newErrors.capacidad = 'La capacidad debe ser un entero positivo.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      await api.createAmbiente({
        ...formData,
        capacidad: Number(formData.capacidad),
      });
      setAlert({ type: 'success', message: 'Ambiente universitario registrado con éxito.' });
      setFormData({
        nombre: '',
        tipo: 'Laboratorio de Cómputo',
        capacidad: 30,
        ubicacion: '',
      });
      setShowForm(false);
      fetchAmbientes();
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Nombre del Ambiente',
      render: (a) => (
        <div>
          <span className="font-semibold text-slate-800">{a.nombre}</span>
          <p className="text-xs text-slate-400">ID: {a.id.slice(0, 8)}...</p>
        </div>
      ),
    },
    {
      header: 'Tipo',
      render: (a) => (
        <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
          {a.tipo}
        </span>
      ),
    },
    {
      header: 'Capacidad',
      align: 'center',
      render: (a) => (
        <span className="font-semibold text-slate-800 text-xs">{a.capacidad} personas</span>
      ),
    },
    {
      header: 'Ubicación',
      accessor: 'ubicacion',
    },
    {
      header: 'Estado',
      align: 'center',
      render: (a) => (
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
            a.estado === 'Disponible'
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              : 'bg-amber-100 text-amber-800 border border-amber-200'
          }`}
        >
          {a.estado}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Ambientes Universitarios</h1>
          <p className="text-sm text-slate-500">
            Catálogo de laboratorios, auditorios y salas disponibles para reserva (RF-02).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={RefreshCw} onClick={fetchAmbientes} loading={loading}>
            Refrescar
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Ocultar Formulario' : 'Nuevo Ambiente'}
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

      {/* Formulario Registro de Ambiente (RF-02) */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 animate-fade-in">
          <h2 className="text-base font-bold text-slate-900 border-b pb-2">Registrar Nuevo Ambiente</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInput
              label="Nombre del Ambiente"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej. Laboratorio de Redes 204"
              required
              error={errors.nombre}
            />

            <SelectInput
              label="Tipo de Ambiente"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              required
              error={errors.tipo}
              options={[
                { value: 'Laboratorio de Cómputo', label: 'Laboratorio de Cómputo' },
                { value: 'Auditorio', label: 'Auditorio' },
                { value: 'Sala de Reuniones', label: 'Sala de Reuniones' },
                { value: 'Laboratorio Especializado', label: 'Laboratorio Especializado' },
              ]}
            />

            <TextInput
              label="Capacidad (Aforo)"
              name="capacidad"
              type="number"
              value={formData.capacidad}
              onChange={handleChange}
              required
              error={errors.capacidad}
            />

            <TextInput
              label="Ubicación"
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleChange}
              placeholder="Ej. Pabellón C - 2do Piso"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={submitting}>
              Guardar Ambiente
            </Button>
          </div>
        </form>
      )}

      {/* Listado */}
      <TableList
        columns={columns}
        data={ambientes}
        loading={loading}
        emptyMessage="No hay ambientes universitarios registrados."
      />
    </div>
  );
}
