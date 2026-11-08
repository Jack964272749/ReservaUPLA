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
// Panel izquierdo: Campus UPLA inmersivo con lienzo glacial estilo igloo.inc.
// Panel derecho: Formulario centrado en tarjeta redondeada ("sin puntas").
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
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#EDF3F9] dark:bg-slate-950 transition-colors">
      
      {/* Panel Izquierdo: Hero Institucional con fondo de campus y animación Igloo */}
      <FondoModulo
        imagen="/backgrounds/bg_login.jpg"
        className="hidden lg:flex flex-1 flex-col justify-between p-8 lg:p-12 relative overflow-hidden min-h-screen"
        overlayClassName="bg-slate-950/60 dark:bg-slate-950/70"
      >
        <LienzoIgloo className="z-10" />

        {/* Cabecera del Hero */}
        <div className="relative z-20 flex items-center gap-3">
          <div className="bg-sky-500/20 backdrop-blur-md p-2.5 rounded-xl border border-sky-400/30 shadow-inner">
            <Building className="w-6 h-6 text-sky-300" />
          </div>
          <span className="font-semibold text-sm tracking-wide text-sky-200">
            Portal Institucional UPLA
          </span>
        </div>

        {/* Mensaje central */}
        <div className="relative z-20 max-w-xl my-auto py-8">
          <h1 className="text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Tecnología que impulsa la <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">
              gestión académica
            </span>
          </h1>
          <p className="mt-4 text-sm xl:text-base text-slate-200 leading-relaxed font-normal drop-shadow-sm">
            Plataforma oficial para registrar, validar y consultar la disponibilidad de auditorios, laboratorios y salas de conferencias en tiempo real con validación estricta de cruces horarios.
          </p>

          {/* Grid de 4 pilares */}
          <div className="mt-8 grid grid-cols-2 gap-3.5">
            <div className="p-3.5 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-700/60">
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
                  <CalendarCheck2 className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-xs text-slate-100">Disponibilidad en Vivo</h3>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Consulta inmediata de ambientes sin cruces ni duplicados.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-700/60">
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                  <Building className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-xs text-slate-100">Gestión de Ambientes</h3>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Control de laboratorios de cómputo, auditorios y salas.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-700/60">
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-xs text-slate-100">Panel de Indicadores</h3>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Métricas de uso, solicitudes pendientes y ambiente de mayor demanda.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-700/60">
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-xs text-slate-100">Seguridad por Roles</h3>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Permisos diferenciados para Solicitante, Responsable y Admin.
              </p>
            </div>
          </div>
        </div>

        {/* Footer institucional del hero */}
        <div className="relative z-20 text-xs text-slate-300/80 drop-shadow">
          <p>Campus Universitario Chorrillos · Huancayo, Junín</p>
        </div>
      </FondoModulo>

      {/* Panel Derecho: Formulario centrado en tarjeta sin puntas (rounded-3xl) */}
      <div className="w-full lg:w-[480px] xl:w-[540px] flex flex-col justify-between p-6 sm:p-8 lg:p-10 bg-slate-50 dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-20 flex-shrink-0 min-h-screen">
        
        {/* Controles superiores (Animación y Tema) */}
        <div className="flex items-center justify-end gap-2 mb-4">
          <button
            type="button"
            onClick={alternarAnimacion}
            aria-label={animacionActiva ? 'Desactivar animación de fondo' : 'Activar animación de fondo'}
            className="btn-estatico inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors shadow-xs cursor-pointer"
          >
            <Sparkles className={`w-3.5 h-3.5 ${animacionActiva ? 'text-amber-500 dark:text-amber-400' : 'text-slate-400'}`} aria-hidden="true" />
            <span>Animación: {animacionActiva ? 'sí' : 'no'}</span>
          </button>

          <button
            type="button"
            onClick={alternarTema}
            aria-label={tema === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            className="btn-estatico inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors shadow-xs cursor-pointer"
          >
            {tema === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
                <span>Modo claro</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-sky-600" aria-hidden="true" />
                <span>Modo oscuro</span>
              </>
            )}
          </button>
        </div>

        {/* Tarjeta de Formulario: Cuadro centrado sin puntas (rounded-3xl) */}
        <div className="my-auto w-full max-w-md mx-auto bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/90 dark:border-slate-800">
          
          {/* Logo y Encabezado */}
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
              ref={correoRef}
              id="login-correo"
              label="Correo institucional"
              type="email"
              value={correo}
              onChange={(e) => {
                setCorreo(e.target.value);
                setEsClaveDemo(false);
              }}
              required
              error={errores.correo}
              placeholder="nombre@upla.edu.pe"
              helperText="Ejemplo: nombre@upla.edu.pe"
              autoComplete="username"
            />

            <div>
              <TextInput
                ref={claveRef}
                id="login-clave"
                label="Contraseña"
                type="password"
                value={clave}
                onChange={(e) => {
                  setClave(e.target.value);
                  setEsClaveDemo(false);
                }}
                onKeyDown={verificarBloqMayus}
                required
                error={errores.clave}
                placeholder="••••••••"
                autoComplete="current-password"
                mostrarAlternarClave={true}
                bloquearMostrarClave={esClaveDemo}
                helperText={
                  esClaveDemo
                    ? 'Acceso de demostración cargado (contraseña protegida).'
                    : 'Puede mostrarla para comprobar lo que escribe.'
                }
              />

              {bloqMayusActivo && (
                <div
                  role="status"
                  aria-live="polite"
                  className="mt-2 flex items-center gap-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs"
                >
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span>Bloq Mayús está activado</span>
                </div>
              )}
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={recordar}
                  onChange={(e) => setRecordar(e.target.checked)}
                  className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer"
                />
                <span className="text-xs text-slate-700 dark:text-slate-300">
                  Recordar correo en este equipo
                </span>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full justify-center text-sm font-semibold py-2.5 rounded-xl cursor-pointer"
              loading={enviando}
            >
              Ingresar
            </Button>
          </form>

          {/* Acceso de Demostración */}
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                ACCESO DE DEMOSTRACION
              </span>
              <span className="text-[10px] text-slate-400">1 clic</span>
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
                className="font-semibold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
              >
                Regístrate como Solicitante
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 text-center text-[10px] text-slate-400 dark:text-slate-500">
          <p>© {anioActual} Universidad Peruana Los Andes · Sistema Oficial de Reservas</p>
        </div>
      </div>
    </div>
  );
}
