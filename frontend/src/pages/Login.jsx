import React from 'react';
import {
  CalendarCheck2,
  Building,
  BarChart3,
  ShieldCheck,
  AlertTriangle,
  Sun,
  Moon,
} from 'lucide-react';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import AlertMessage from '../components/AlertMessage';
import Logo from '../components/Logo';
import { useLogin } from '../hooks/useLogin';
import { useTema } from '../hooks/useTema';

const anioActual = new Date().getFullYear();

// Trazabilidad: Nielsen H1, H2, H3, H4, H5 (BloqMayús), H6, H7, H8, H9 · Shneiderman S1..S5 · ISO 9241-11
export default function Login({ alIrARegistro }) {
  const {
    correo,
    setCorreo,
    clave,
    setClave,
    recordar,
    setRecordar,
    errores,
    errorServidor,
    enviando,
    bloqMayusActivo,
    verificarBloqMayus,
    handleSubmit,
    correoRef,
    claveRef,
    alertaRef,
  } = useLogin();

  const { tema, alternarTema } = useTema();

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#EDF3F9] dark:bg-slate-950 transition-colors">
      {/* Panel Izquierdo: Formulario de Autenticación (~35-40% en desktop) */}
      <div className="flex-1 lg:max-w-md xl:max-w-lg w-full flex flex-col justify-between p-6 sm:p-10 lg:p-12 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-xl lg:shadow-none z-10">
        <div>
          <div className="mb-8 flex items-center justify-between">
            <Logo />
            <button
              type="button"
              onClick={alternarTema}
              aria-label={tema === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              {tema === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Iniciar sesión
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Ingrese sus credenciales institucionales para continuar
            </p>
          </div>

          {errorServidor && (
            <div className="mb-6">
              <AlertMessage
                ref={alertaRef}
                type="error"
                message={errorServidor}
              />
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <TextInput
              inputRef={correoRef}
              id="login-correo"
              name="correo"
              type="email"
              label="Correo institucional"
              placeholder="nombre@upla.edu.pe"
              ayuda="Ejemplo: nombre@upla.edu.pe"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              error={errores.correo}
              obligatorio
              autoComplete="email"
              inputMode="email"
              autoFocus
              disabled={enviando}
            />

            <div className="space-y-1.5">
              <TextInput
                inputRef={claveRef}
                id="login-clave"
                name="contrasena"
                type="password"
                label="Contraseña"
                placeholder="••••••••"
                ayuda="Puede mostrarla para comprobar lo que escribe."
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                onKeyDown={verificarBloqMayus}
                error={errores.clave}
                obligatorio
                autoComplete="current-password"
                mostrarAlternarClave
                disabled={enviando}
              />

              {bloqMayusActivo && (
                <div
                  role="status"
                  aria-live="polite"
                  className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-md border border-amber-200 dark:border-amber-800"
                >
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span>Bloqueo de mayúsculas activado</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={recordar}
                  onChange={(e) => setRecordar(e.target.checked)}
                  className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300 dark:border-slate-600 dark:bg-slate-800"
                />
                <span>Recordar correo en este equipo</span>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={enviando}
              className="w-full font-semibold shadow-md"
            >
              {enviando ? 'Ingresando…' : 'Ingresar'}
            </Button>
          </form>

          {alIrARegistro && (
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center text-sm text-slate-600 dark:text-slate-400">
              <span>¿No cuentas con usuario? </span>
              <button
                type="button"
                onClick={alIrARegistro}
                className="font-semibold text-sky-700 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-300 underline focus:outline-none focus:ring-2 focus:ring-sky-500 rounded p-1"
              >
                Regístrate como Solicitante
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 pt-4 text-center text-xs text-slate-400 dark:text-slate-500">
          <p>© {anioActual} Universidad Peruana Los Andes</p>
          <p className="mt-0.5 text-[11px]">Sistema Oficial de Reserva de Ambientes</p>
        </div>
      </div>

      {/* Panel Derecho: Imagen / Brand Showcase Institucional (~60-65% en desktop) */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 xl:p-16 bg-gradient-to-br from-slate-950 via-sky-950 to-slate-900 text-white relative overflow-hidden">
        {/* Decoración de fondo */}
        <div
          className="absolute -top-32 -right-32 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-32 -left-32 w-96 h-96 bg-sky-700/15 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        {/* Barra superior con botón de tema */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="bg-sky-500/20 backdrop-blur-md p-2 rounded-lg border border-sky-400/30">
              <Building className="w-5 h-5 text-sky-300" />
            </div>
            <span className="font-semibold text-sm tracking-wide text-sky-200">
              Portal Institucional UPLA
            </span>
          </div>

          <button
            type="button"
            onClick={alternarTema}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium text-slate-200 transition-colors"
          >
            {tema === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Modo claro</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-sky-300" />
                <span>Modo oscuro</span>
              </>
            )}
          </button>
        </div>

        {/* Mensaje central */}
        <div className="my-auto py-10 z-10 max-w-2xl">
          <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Tecnología que impulsa la{' '}
            <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
              gestión académica
            </span>
          </h2>
          <p className="mt-4 text-slate-300 text-sm xl:text-base leading-relaxed">
            Plataforma oficial para registrar, validar y consultar la disponibilidad de
            auditorios, laboratorios y salas de conferencias en tiempo real con validación
            estricta de cruces horarios.
          </p>

          {/* Tarjetas de características (como en la imagen de referencia) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400">
                  <CalendarCheck2 className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-sm text-slate-100">Disponibilidad en Vivo</h3>
              </div>
              <p className="text-xs text-slate-400 leading-normal">
                Verificación inmediata de ambientes para evitar cruces y reservas duplicadas.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                  <Building className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-sm text-slate-100">Gestión de Ambientes</h3>
              </div>
              <p className="text-xs text-slate-400 leading-normal">
                Control de laboratorios de cómputo, auditorios institucionales y salas de reuniones.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-sm text-slate-100">Panel de Indicadores</h3>
              </div>
              <p className="text-xs text-slate-400 leading-normal">
                Métricas de uso, solicitudes pendientes y ambiente de mayor demanda académica.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-sm text-slate-100">Seguridad por Roles</h3>
              </div>
              <p className="text-xs text-slate-400 leading-normal">
                Permisos diferenciados para Solicitantes, Responsables y Administradores.
              </p>
            </div>
          </div>
        </div>

        {/* Footer institucional */}
        <div className="z-10 text-xs text-slate-500">
          <p>Campus Universitario Chorrillos · Huancayo, Junín</p>
        </div>
      </div>
    </div>
  );
}
