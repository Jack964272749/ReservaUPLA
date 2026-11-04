import React from 'react';
import {
  CalendarCheck2,
  Building,
  BarChart3,
  ShieldCheck,
  AlertTriangle,
  Sun,
  Moon,
  Shield,
  UserCheck,
  User,
  Sparkles,
} from 'lucide-react';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import AlertMessage from '../components/AlertMessage';
import Logo from '../components/Logo';
import FondoModulo from '../components/FondoModulo';
import { useLogin } from '../hooks/useLogin';
import { useTema } from '../hooks/useTema';

const anioActual = new Date().getFullYear();

const CUENTAS_DEMO = [
  {
    rol: 'Admin',
    titulo: 'Administrador',
    subtitulo: 'Control total',
    correo: 'admin@upla.edu.pe',
    clave: 'Admin123*UPLA',
    icono: Shield,
    colorBorde: 'border-rose-200 hover:border-rose-400 dark:border-rose-900/60 dark:hover:border-rose-700',
    colorBg: 'bg-rose-50/60 hover:bg-rose-100/70 dark:bg-rose-950/20 dark:hover:bg-rose-950/40',
    colorTexto: 'text-rose-700 dark:text-rose-400',
    colorBadge: 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300',
  },
  {
    rol: 'Responsable',
    titulo: 'Responsable',
    subtitulo: 'Ambientes y Labs',
    correo: 'responsable@upla.edu.pe',
    clave: 'Usuario123*UPLA',
    icono: UserCheck,
    colorBorde: 'border-amber-200 hover:border-amber-400 dark:border-amber-900/60 dark:hover:border-amber-700',
    colorBg: 'bg-amber-50/60 hover:bg-amber-100/70 dark:bg-amber-950/20 dark:hover:bg-amber-950/40',
    colorTexto: 'text-amber-700 dark:text-amber-400',
    colorBadge: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
  },
  {
    rol: 'Solicitante',
    titulo: 'Solicitante',
    subtitulo: 'Docente / Alumno',
    correo: 'solicitante@upla.edu.pe',
    clave: 'Usuario123*UPLA',
    icono: User,
    colorBorde: 'border-sky-200 hover:border-sky-400 dark:border-sky-900/60 dark:hover:border-sky-700',
    colorBg: 'bg-sky-50/60 hover:bg-sky-100/70 dark:bg-sky-950/20 dark:hover:bg-sky-950/40',
    colorTexto: 'text-sky-700 dark:text-sky-400',
    colorBadge: 'bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300',
  },
];

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

  const autocompletarCuenta = (cuenta) => {
    setCorreo(cuenta.correo);
    setClave(cuenta.clave);
  };

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

          <div className="mb-6">
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

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
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

          {/* Botones de Autocompletado de Usuarios para Pruebas / Demostración */}
          <div className="mt-6 pt-5 border-t border-slate-200/90 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2.5">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
                <span>Autocompletar acceso rápido</span>
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                1 clic
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {CUENTAS_DEMO.map((cuenta) => {
                const Icono = cuenta.icono;
                const estaSeleccionado = correo === cuenta.correo;
                return (
                  <button
                    key={cuenta.rol}
                    type="button"
                    onClick={() => autocompletarCuenta(cuenta)}
                    disabled={enviando}
                    title={`Autocompletar como ${cuenta.titulo} (${cuenta.correo})`}
                    className={`p-2 sm:p-2.5 rounded-xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between ${cuenta.colorBorde} ${cuenta.colorBg} ${
                      estaSeleccionado
                        ? 'ring-2 ring-sky-500 shadow-sm scale-[1.02]'
                        : 'hover:shadow-xs hover:-translate-y-0.5'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <Icono className={`w-4 h-4 ${cuenta.colorTexto}`} aria-hidden="true" />
                      {estaSeleccionado && (
                        <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                      )}
                    </div>
                    <div>
                      <p className={`text-xs font-bold leading-tight ${cuenta.colorTexto}`}>
                        {cuenta.titulo}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                        {cuenta.subtitulo}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {alIrARegistro && (
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-sm text-slate-600 dark:text-slate-400">
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

        <div className="mt-6 pt-3 text-center text-xs text-slate-400 dark:text-slate-500">
          <p>© {anioActual} Universidad Peruana Los Andes</p>
          <p className="mt-0.5 text-[11px]">Sistema Oficial de Reserva de Ambientes</p>
        </div>
      </div>

      {/* Panel Derecho: Imagen / Brand Showcase Institucional (~60-65% en desktop) */}
      <FondoModulo
        imagen="/backgrounds/bg_login.jpg"
        className="hidden lg:flex flex-1 flex-col justify-between p-12 xl:p-16 text-white rounded-none border-0"
        overlayClassName="bg-gradient-to-br from-slate-950/70 via-sky-950/60 to-slate-900/65"
      >
        <div className="relative z-10 flex flex-col justify-between h-full">

        {/* Decoración de fondo */}
        <div
          className="absolute -top-32 -right-32 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none z-[1]"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-32 -left-32 w-96 h-96 bg-sky-700/15 rounded-full blur-3xl pointer-events-none z-[1]"
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
          <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight drop-shadow-lg">
            Tecnología que impulsa la{' '}
            <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
              gestión académica
            </span>
          </h2>
          <p className="mt-4 text-slate-200 text-sm xl:text-base leading-relaxed drop-shadow-md">
            Plataforma oficial para registrar, validar y consultar la disponibilidad de
            auditorios, laboratorios y salas de conferencias en tiempo real con validación
            estricta de cruces horarios.
          </p>

          {/* Tarjetas de características */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 backdrop-blur-md">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400">
                  <CalendarCheck2 className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-sm text-slate-100">Disponibilidad en Vivo</h3>
              </div>
              <p className="text-xs text-slate-300 leading-normal">
                Verificación inmediata de ambientes para evitar cruces y reservas duplicadas.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 backdrop-blur-md">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                  <Building className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-sm text-slate-100">Gestión de Ambientes</h3>
              </div>
              <p className="text-xs text-slate-300 leading-normal">
                Control de laboratorios de cómputo, auditorios institucionales y salas de reuniones.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 backdrop-blur-md">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-sm text-slate-100">Panel de Indicadores</h3>
              </div>
              <p className="text-xs text-slate-300 leading-normal">
                Métricas de uso, solicitudes pendientes y ambiente de mayor demanda académica.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 backdrop-blur-md">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-sm text-slate-100">Seguridad por Roles</h3>
              </div>
              <p className="text-xs text-slate-300 leading-normal">
                Permisos diferenciados para Solicitantes, Responsables y Administradores.
              </p>
            </div>
          </div>
        </div>

        {/* Footer institucional */}
        <div className="z-10 text-xs text-slate-400 drop-shadow">
          <p>Campus Universitario Chorrillos · Huancayo, Junín</p>
        </div>
        </div>
      </FondoModulo>
    </div>
  );
}
