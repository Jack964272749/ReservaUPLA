import React from 'react';
import { ArrowLeft, UserPlus } from 'lucide-react';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import AlertMessage from '../components/AlertMessage';
import Logo from '../components/Logo';
import { useRegistroUsuario } from '../hooks/useRegistroUsuario';

// Trazabilidad: RF-01 · Nielsen H2, H3, H5, H9 · Shneiderman S1..S5 · ISO 9241-11
export default function RegistroSolicitante({ alVolverALogin }) {
  const {
    nombreCompleto,
    setNombreCompleto,
    correo,
    setCorreo,
    contrasena,
    setContrasena,
    errores,
    errorServidor,
    enviando,
    exito,
    handleSubmit,
    nombreRef,
    correoRef,
    contrasenaRef,
  } = useRegistroUsuario({
    onRegistroExitoso: () => {},
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[#EDF3F9] dark:bg-slate-950 transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <Logo />
          <button
            type="button"
            onClick={alVolverALogin}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver</span>
          </button>
        </div>

        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            Registro de Solicitante
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Cree su cuenta institucional para solicitar la reserva de ambientes universitarios.
          </p>
        </div>

        {exito ? (
          <div className="space-y-4">
            <AlertMessage
              type="success"
              message="¡Registro completado con éxito! Ahora puede iniciar sesión con sus credenciales."
            />
            <Button
              variant="primary"
              className="w-full"
              onClick={alVolverALogin}
            >
              Ir a Iniciar Sesión
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {errorServidor && (
              <AlertMessage
                type="error"
                message={errorServidor}
              />
            )}

            <TextInput
              inputRef={nombreRef}
              id="registro-nombre"
              name="nombreCompleto"
              label="Nombre completo"
              placeholder="Ej. Juan Pérez Huamán"
              ayuda="Entre 2 y 100 caracteres."
              value={nombreCompleto}
              onChange={(e) => setNombreCompleto(e.target.value)}
              error={errores.nombreCompleto}
              obligatorio
              autoComplete="name"
              autoFocus
              disabled={enviando}
            />

            <TextInput
              inputRef={correoRef}
              id="registro-correo"
              name="correo"
              type="email"
              label="Correo electrónico institucional"
              placeholder="usuario@upla.edu.pe"
              ayuda="Debe ser un correo válido."
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              error={errores.correo}
              obligatorio
              autoComplete="email"
              inputMode="email"
              disabled={enviando}
            />

            <TextInput
              inputRef={contrasenaRef}
              id="registro-contrasena"
              name="contrasena"
              type="password"
              label="Contraseña"
              placeholder="Mínimo 6 caracteres"
              ayuda="Debe tener al menos 6 caracteres."
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              error={errores.contrasena}
              obligatorio
              autoComplete="new-password"
              mostrarAlternarClave
              disabled={enviando}
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={enviando}
                icon={UserPlus}
                className="w-full font-semibold"
              >
                {enviando ? 'Registrando…' : 'Crear Cuenta'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
