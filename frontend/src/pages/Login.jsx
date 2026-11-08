import React, { useState } from 'react';
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
import LienzoIgloo from '../components/LienzoIgloo';
import { useLogin } from '../hooks/useLogin';
import { useTema } from '../hooks/useTema';
import { useAnimacionFondo } from '../hooks/useAnimacionFondo';

const anioActual = new Date().getFullYear();

const CUENTAS_DEMO = [
  {
    rol: 'Admin',
    titulo: 'Administrador',
    subtitulo: 'Control total',
    correo: 'admin@upla.edu.pe',
    clave: 'UPLA#Admin$2026!SecOps*9',
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
    clave: 'UPLA#Resp$2026!GestAmb*4',
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
    clave: 'UPLA#Solic$2026!AcadUpla*7',
    icono: User,
    colorBorde: 'border-sky-200 hover:border-sky-400 dark:border-sky-900/60 dark:hover:border-sky-700',
    colorBg: 'bg-sky-50/60 hover:bg-sky-100/70 dark:bg-sky-950/20 dark:hover:bg-sky-950/40',
    colorTexto: 'text-sky-700 dark:text-sky-400',
    colorBadge: 'bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300',
  },
];

// Trazabilidad: Nielsen H1..H9 · Shneiderman S1..S5 · ISO 9241-11
// Diseño institucional: hero a la izquierda y tarjeta flotante redondeada ("sin puntas") centrada a la derecha.
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
  const { animacionActiva, alternarAnimacion } = useAnimacionFondo();
  const [esClaveDemo, setEsClaveDemo] = useState(false);

  const autocompletarCuenta = (cuenta) => {
    setCorreo(cuenta.correo);
    setClave(cuenta.clave);
    setEsClaveDemo(true);
    claveRef.current?.focus();
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-950 overflow-x-hidden">
      {/* Fondo inmersivo institucional con Lienzo glacial estilo Igloo */}
      <FondoModulo
        imagen="/backgrounds/bg_login.jpg"
        className="absolute inset-0 w-full h-full rounded-none border-0"
        overlayClassName="bg-gradient-to-br from-slate-950/85 via-sky-950/75 to-slate-950/90"
      >
        <LienzoIgloo className="absolute inset-0 z-10 pointer-events-none" />
      </FondoModulo>

      {/* Controles globales superiores (Animación y Tema) - Directamente interactivos y sin bloqueos */}
      <aside aria-label="Preferencias de interfaz" className="absolute top-4 right-4 sm:top-6 sm:right-8 z-40 flex items-center gap-2.5 pointer-events-auto">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            alternarAnimacion();
          }}
          aria-label={animacionActiva ? 'Desactivar animación de fondo' : 'Activar animación de fondo'}
          className="btn-estatico inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800/90 dark:bg-slate-800/80 dark:hover:bg-slate-700/90 backdrop-blur-md border border-slate-700/60 text-xs font-semibold text-slate-200 transition-colors shadow-lg cursor-pointer"
        >
          <Sparkles className={`w-3.5 h-3.5 ${animacionActiva ? 'text-amber-400' : 'text-slate-400'}`} aria-hidden="true" />
          <span>Animación: {animacionActiva ? 'sí' : 'no'}</span>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            alternarTema();
          }}
          aria-label={tema === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          className="btn-estatico inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800/90 dark:bg-slate-800/80 dark:hover:bg-slate-700/90 backdrop-blur-md border border-slate-700/60 text-xs font-semibold text-slate-200 transition-colors shadow-lg cursor-pointer"
        >
          {tema === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
              <span>Modo claro</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-sky-300" aria-hidden="true" />
              <span>Modo oscuro</span>
            </>
          )}
        </button>
      </aside>

      {/* Contenedor principal de doble sección (Hero izquierda + Formulario a la derecha) */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-12 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
        
        {/* Sección Izquierda: Hero / Mensaje Institucional (~50-55% en desktop) */}
        <div className="hidden lg:flex flex-col justify-center flex-1 max-w-xl text-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-sky-500/20 backdrop-blur-md p-2.5 rounded-xl border border-sky-400/30 shadow-inner">
              <Building className="w-6 h-6 text-sky-300" />
            </div>
            <span className="font-semibold text-sm tracking-wide text-sky-200">
              Portal Institucional UPLA
            </span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-black leading-tight tracking-tight drop-shadow-md">
            Tecnología que impulsa la{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-300">
              gestión académica
            </span>
          </h1>

          <p className="mt-4 text-base xl:text-lg text-slate-300 leading-relaxed font-normal">
            Plataforma oficial para registrar, validar y consultar la disponibilidad de auditorios, laboratorios y salas de conferencias en tiempo real con validación estricta de cruces horarios.
          </p>

          <div className="grid grid-cols-2 gap-3.5 mt-8">
            <div className="p-3.5 rounded-2xl bg-slate-900/50 backdrop-blur-md border border-slate-700/50 flex items-start gap-3">
              <CalendarCheck2 className="w-5 h-5 text-sky-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-100">Disponibilidad en Vivo</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">Consulta inmediata sin cruces de horarios.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/50 backdrop-blur-md border border-slate-700/50 flex items-start gap-3">
              <Building className="w-5 h-5 text-sky-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-100">Gestión de Ambientes</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">Laboratorios, salas y auditorios UPLA.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/50 backdrop-blur-md border border-slate-700/50 flex items-start gap-3">
              <BarChart3 className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-100">Panel de Indicadores</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">Métricas de ocupación y solicitudes.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/50 backdrop-blur-md border border-slate-700/50 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-100">Seguridad por Roles</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">Permisos para Solicitante, Responsable y Admin.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sección Derecha: Formulario centrado en un cuadro sin puntas (rounded-3xl) */}
        <div className="w-full lg:w-auto flex items-center justify-center flex-shrink-0">
          <div className="w-full max-w-md sm:max-w-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-9 shadow-2xl border border-slate-200/90 dark:border-slate-800 transition-all">
            
            {/* Cabecera de la tarjeta con Logo */}
            <div className="mb-6 flex items-center gap-3">
              <Logo className="h-10 w-auto" />
              <div className="border-l border-slate-300 dark:border-slate-700 pl-3">
                <div className="text-xl font-black tracking-tight leading-none">
                  <span className="text-sky-600 dark:text-sky-400">Reserva</span>
                  <span className="text-slate-900 dark:text-slate-100 font-bold">UPLA</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-none mt-1">
                  Universidad Peruana Los Andes
                </p>
              </div>
            </div>

            <div className="mb-5">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Iniciar sesión
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Ingrese sus credenciales institucionales para continuar
              </p>
            </div>

            {errorServidor && (
              <div className="mb-5">
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
                  ayuda={
                    esClaveDemo
                      ? "Acceso de demostración cargado (contraseña protegida)."
                      : "Puede mostrarla para comprobar lo que escribe."
                  }
                  value={clave}
                  onChange={(e) => {
                    setClave(e.target.value);
                    setEsClaveDemo(false);
                  }}
                  onKeyDown={verificarBloqMayus}
                  error={errores.clave}
                  obligatorio
                  autoComplete="current-password"
                  mostrarAlternarClave
                  bloquearMostrarClave={esClaveDemo}
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
                className="w-full font-semibold shadow-md rounded-xl"
              >
                {enviando ? 'Ingresando…' : 'Ingresar'}
              </Button>
            </form>

            {/* Bloque de Acceso de Demostración */}
            <div className="mt-5 pt-4 border-t border-slate-200/90 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
                  <span>ACCESO DE DEMOSTRACION</span>
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
                      title={`Acceso de demostración como ${cuenta.titulo} (${cuenta.correo})`}
                      className={`p-2 sm:p-2.5 rounded-2xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between ${cuenta.colorBorde} ${cuenta.colorBg} ${
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
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-600 dark:text-slate-400">
                <span>¿No cuentas con usuario? </span>
                <button
                  type="button"
                  onClick={alIrARegistro}
                  className="font-semibold text-sky-600 dark:text-sky-400 hover:underline"
                >
                  Regístrate como Solicitante
                </button>
              </div>
            )}

            <div className="mt-4 pt-2 text-center text-[10px] text-slate-400 dark:text-slate-500">
              <p>© {anioActual} Universidad Peruana Los Andes · Sistema Oficial de Reservas</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
