import React, { useState, useEffect } from 'react';
import {
  CalendarPlus,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Building,
  User,
  ArrowRight,
} from 'lucide-react';
import TextInput from '../components/TextInput';
import SelectInput from '../components/SelectInput';
import DateInput from '../components/DateInput';
import TimeInput from '../components/TimeInput';
import Button from '../components/Button';
import AlertMessage from '../components/AlertMessage';
import { api } from '../services/api';

export default function CrearReserva({ setActiveTab }) {
  const [usuarios, setUsuarios] = useState([]);
  const [ambientes, setAmbientes] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    usuarioId: '',
    ambienteId: '',
    fecha: new Date().toISOString().split('T')[0],
    horaInicio: '08:00',
    horaFin: '10:00',
    motivo: '',
  });

  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  // Availability validation state
  const [availabilityCheck, setAvailabilityCheck] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  useEffect(() => {
    const loadDependencies = async () => {
      try {
        const [uData, aData] = await Promise.all([
          api.getUsuarios(),
          api.getAmbientes(),
        ]);
        setUsuarios(uData.filter((u) => u.activo));
        setAmbientes(aData.filter((a) => a.estado === 'Disponible'));
      } catch (err) {
        setAlert({
          type: 'error',
          message: 'Error al cargar usuarios y ambientes. Verifique la conexión al backend.',
        });
      }
    };
    loadDependencies();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
    setAvailabilityCheck(null);
  };

  const validateForm = () => {
    const newErrors = {};

    // RN-02: Campos obligatorios
    if (!formData.usuarioId) newErrors.usuarioId = 'Debe seleccionar un solicitante (RN-02).';
    if (!formData.ambienteId) newErrors.ambienteId = 'Debe seleccionar un ambiente (RN-02).';
    if (!formData.fecha) newErrors.fecha = 'La fecha es obligatoria (RN-02).';
    if (!formData.horaInicio) newErrors.horaInicio = 'Hora de inicio requerida (RN-02).';
    if (!formData.horaFin) newErrors.horaFin = 'Hora de fin requerida (RN-02).';
    if (!formData.motivo.trim()) newErrors.motivo = 'El motivo de la reserva es obligatorio (RN-02).';

    // RN-03: Hora fin > Hora inicio
    if (formData.horaInicio && formData.horaFin) {
      if (formData.horaFin <= formData.horaInicio) {
        newErrors.horaFin = 'La hora de fin debe ser estrictamente mayor a la hora de inicio (RN-03).';
      }
    }

    // RN-04: Horario permitido 07:00 a 22:00
    if (formData.horaInicio && (formData.horaInicio < '07:00' || formData.horaInicio > '22:00')) {
      newErrors.horaInicio = 'Las reservas solo pueden iniciar entre las 07:00 y las 22:00 hrs (RN-04).';
    }
    if (formData.horaFin && (formData.horaFin < '07:00' || formData.horaFin > '22:00')) {
      newErrors.horaFin = 'Las reservas solo pueden finalizar hasta las 22:00 hrs (RN-04).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // RF-04: Validar disponibilidad antes de registrar
  const handleCheckAvailability = async () => {
    if (!formData.ambienteId) {
      setErrors((prev) => ({ ...prev, ambienteId: 'Seleccione un ambiente para verificar disponibilidad.' }));
      return;
    }
    if (!formData.fecha || !formData.horaInicio || !formData.horaFin) {
      setAlert({ type: 'warning', message: 'Complete la fecha y los horarios antes de validar disponibilidad.' });
      return;
    }

    if (formData.horaFin <= formData.horaInicio) {
      setErrors((prev) => ({ ...prev, horaFin: 'Hora de fin debe ser mayor a hora de inicio.' }));
      return;
    }

    setCheckingAvailability(true);
    setAvailabilityCheck(null);
    try {
      const res = await api.validarDisponibilidad({
        ambienteId: formData.ambienteId,
        fecha: formData.fecha,
        horaInicio: formData.horaInicio.length === 5 ? `${formData.horaInicio}:00` : formData.horaInicio,
        horaFin: formData.horaFin.length === 5 ? `${formData.horaFin}:00` : formData.horaFin,
      });

      setAvailabilityCheck(res);
      if (res.disponible) {
        setAlert({ type: 'success', message: res.mensaje });
      } else {
        setAlert({ type: 'error', message: res.mensaje });
      }
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
    } finally {
      setCheckingAvailability(false);
    }
  };

  // RF-03: Enviar reserva
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setAlert({ type: 'error', message: 'Por favor complete todos los campos requeridos correctamente.' });
      return;
    }

    setLoading(true);
    setAlert(null);
    try {
      await api.createReserva({
        usuarioId: formData.usuarioId,
        ambienteId: formData.ambienteId,
        fecha: formData.fecha,
        horaInicio: formData.horaInicio.length === 5 ? `${formData.horaInicio}:00` : formData.horaInicio,
        horaFin: formData.horaFin.length === 5 ? `${formData.horaFin}:00` : formData.horaFin,
        motivo: formData.motivo,
      });

      setAlert({
        type: 'success',
        message: '¡Solicitud de reserva registrada con éxito! El estado inicial es Pendiente de aprobación.',
      });

      setTimeout(() => {
        setActiveTab('reservas');
      }, 1500);
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Registrar Nueva Reserva</h1>
        <p className="text-sm text-slate-500">
          Formulario con validación en tiempo real de reglas de negocio (RN-01 a RN-04).
        </p>
      </div>

      {alert && (
        <AlertMessage
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Reglas de Negocio Reference Banner */}
      <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 text-xs text-sky-900">
        <div className="flex items-center gap-2 font-bold mb-1">
          <ShieldCheck className="w-4 h-4 text-sky-700" />
          <span>Reglas de Negocio Aplicadas:</span>
        </div>
        <ul className="list-disc list-inside space-y-0.5 text-sky-800">
          <li><strong>RN-01:</strong> No se permiten reservas aprobadas superpuestas para el mismo ambiente y horario.</li>
          <li><strong>RN-03:</strong> La hora de fin debe ser estrictamente posterior a la hora de inicio.</li>
          <li><strong>RN-04:</strong> Rango institucional permitido de reservas: 07:00 a 22:00 horas.</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Solicitante */}
          <SelectInput
            label="Usuario Solicitante"
            name="usuarioId"
            value={formData.usuarioId}
            onChange={handleChange}
            options={usuarios.map((u) => ({
              value: u.id,
              label: `${u.nombreCompleto} (${u.rol})`,
            }))}
            placeholder="Seleccione el solicitante"
            required
            error={errors.usuarioId}
          />

          {/* Ambiente */}
          <SelectInput
            label="Ambiente Universitario"
            name="ambienteId"
            value={formData.ambienteId}
            onChange={handleChange}
            options={ambientes.map((a) => ({
              value: a.id,
              label: `${a.nombre} - Capacidad: ${a.capacidad}`,
            }))}
            placeholder="Seleccione el ambiente"
            required
            error={errors.ambienteId}
          />
        </div>

        {/* Fecha y Horarios */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 border-t pt-5 border-slate-100">
          <DateInput
            label="Fecha de Reserva"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            required
            error={errors.fecha}
          />

          <TimeInput
            label="Hora de Inicio"
            name="horaInicio"
            value={formData.horaInicio}
            onChange={handleChange}
            helperText="Entre 07:00 y 22:00"
            required
            error={errors.horaInicio}
          />

          <TimeInput
            label="Hora de Fin"
            name="horaFin"
            value={formData.horaFin}
            onChange={handleChange}
            helperText="Mayor que hora inicio"
            required
            error={errors.horaFin}
          />
        </div>

        {/* Botón de Comprobación de Disponibilidad (RF-04) */}
        <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
          <div className="text-xs text-slate-600">
            <span className="font-semibold block text-slate-800">Verificación Previa (RF-04)</span>
            Compruebe si el ambiente cuenta con colisión de horarios antes de registrar.
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCheckAvailability}
            loading={checkingAvailability}
          >
            Validar Disponibilidad
          </Button>
        </div>

        {/* Motivo de la Reserva */}
        <div className="border-t pt-5 border-slate-100">
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Motivo de la Reserva <span className="text-rose-500">*</span>
          </label>
          <textarea
            name="motivo"
            rows="3"
            value={formData.motivo}
            onChange={handleChange}
            placeholder="Describa el objetivo académico, práctica calificada o evento..."
            className={`w-full px-3.5 py-2 text-sm rounded-lg border transition-colors shadow-sm focus:outline-none focus:ring-2 ${
              errors.motivo
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/30'
                : 'border-slate-300 focus:border-sky-500 focus:ring-sky-100 bg-white'
            }`}
          />
          {errors.motivo && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.motivo}</p>}
        </div>

        {/* Submit and Cancel Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            onClick={() => setActiveTab('reservas')}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            icon={CalendarPlus}
            loading={loading}
          >
            Registrar Reserva
          </Button>
        </div>
      </form>
    </div>
  );
}
