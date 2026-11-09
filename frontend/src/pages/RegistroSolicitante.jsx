import React from 'react';
import { ArrowLeft, UserPlus, Clock } from 'lucide-react';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import AlertMessage from '../components/AlertMessage';
import Logo from '../components/Logo';
import FondoModulo from '../components/FondoModulo';
import LienzoIgloo from '../components/LienzoIgloo';
import { useRegistroUsuario } from '../hooks/useRegistroUsuario';

// Trazabilidad: RF-01 · Nielsen H2, H3, H5, H9 · Shneiderman S1..S5 · ISO 9241-11
export default function RegistroSolicitante({ alVolverALogin }) {
  const {
    nombreCompleto,
    setNombreCompleto,
    codigo,
    setCodigo,
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
    codigoRef,
    correoRef,
    contrasenaRef,
  } = useRegistroUsuario({
    onRegistroExitoso: () => {},
  });

  return (
    <FondoModulo
      imagen="/backgrounds/bg_registro.jpg"
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 transition-colors"
    >
      <LienzoIgloo className="absolute inset-0 z-10 pointer-events-none" />
      <div className="relative z-20 max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl">
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
            Cree su solicitud de cuenta institucional para reservar ambientes universitarios en la UPLA.
          </p>
        </div>

        {exito ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Clock className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                <span>¡Registro recibido exitosamente!</span>
              </div>
              <p className="text-xs text-sky-800 dark:text-sky-300">
                Su cuenta institucional ha sido registrada con el código <strong>{codigo}</strong> y se encuentra en estado <strong>PENDIENTE DE VALIDACIÓN</strong> por el Administrador Central.
              </p>
              <p className="text-xs text-sky-700 dark:text-sky-400">
                Al ser un software universitario oficial, la administración validará sus datos antes de habilitar el acceso al sistema de reservas.
              </p>
            </div>
            <Button
              variant="primary"
              className="w-full"
              onClick={alVolverALogin}
            >
              Volver al Inicio de Sesión
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
              inputRef={codigoRef}
              id="registro-codigo"
              name="codigo"
              label="Código institucional / Matrícula"
              placeholder="Ej. 202110452 o DOC-4921"
              ayuda="Código de estudiante o carnet docente asignado por la UPLA."
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              error={errores.codigo}
              obligatorio
              disabled={enviando}
            />

            <TextInput
              inputRef={correoRef}
              id="registro-correo"
              name="correo"
              type="email"
              label="Correo electrónico institucional"
              placeholder="usuario@upla.edu.pe"
              ayuda="Debe ser su correo universitario (@upla.edu.pe)."
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
                {enviando ? 'Registrando…' : 'Enviar Solicitud de Registro'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </FondoModulo>
  );
}
