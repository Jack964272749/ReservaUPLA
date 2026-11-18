import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  GitCompare,
  UserPlus,
  LogIn,
  LayoutDashboard,
  ClipboardList,
  Eye,
  ShieldCheck,
  Sun,
  Moon,
  Sparkles,
  HelpCircle,
  X,
} from 'lucide-react';
import Logo from '../components/Logo';
import Button from '../components/Button';
import LienzoIgloo from '../components/LienzoIgloo';
import { useTema } from '../hooks/useTema';
import { useAnimacionFondo } from '../hooks/useAnimacionFondo';
import { useAuth } from '../hooks/useAuth';
import { REGLAS } from '../constants/reglas';

const anioActual = new Date().getFullYear();

const ROLES = [
  {
    nombre: 'Solicitante',
    descripcion: 'Crea reservas y consulta el estado de las suyas.',
    icono: ClipboardList,
    color: 'text-sky-400',
    border: 'border-sky-500/30',
    badge: 'Docentes / Alumnos',
  },
  {
    nombre: 'Responsable de Ambiente',
    descripcion: 'Supervisa los ambientes asignados a su cargo.',
    icono: Eye,
    color: 'text-violet-400',
    border: 'border-violet-500/30',
    badge: 'Encargados',
  },
  {
    nombre: 'Administrador',
    descripcion: 'Aprueba o rechaza reservas y gestiona el sistema.',
    icono: ShieldCheck,
    color: 'text-rose-400',
    border: 'border-rose-500/30',
    badge: 'Control Total',
  },
];

export default function LandingPage({ alIrALogin, alIrARegistro }) {
  const { tema, alternarTema } = useTema();
  const { animacionActiva, alternarAnimacion } = useAnimacionFondo();
  const { usuario } = useAuth();
  const [modalInfo, setModalInfo] = useState(null);

  const horaApertura = REGLAS.RESERVA.HORA_APERTURA;
  const horaCierre = REGLAS.RESERVA.HORA_CIERRE;

  const abrirModal = (titulo, contenido) => {
    setModalInfo({ titulo, contenido });
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col justify-between relative bg-[#071328] dark:bg-slate-950 text-slate-100 transition-colors select-none">
      {/* ── Única imagen de fondo para toda la pantalla ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none bg-cover bg-center scale-105 blur-[1.5px]"
        style={{ backgroundImage: 'url("/backgrounds/bg_ambientes.jpg")' }}
      />

      {/* ── Capa de degradado azul institucional y contraste ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-[#06142e]/90 via-[#07193d]/85 to-[#051124]/95 dark:from-slate-950/95 dark:via-slate-950/90 dark:to-slate-950/95"
      />

      {/* ── Animación interactiva de constelación / igloo ── */}
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        <LienzoIgloo />
      </div>

      {/* Skip link accesibilidad */}
      <a
        href="#contenido-principal"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-sky-600 focus:text-white focus:rounded-lg focus:text-sm focus:font-semibold"
      >
        Saltar al contenido
      </a>

      {/* ───── Cabecera institucional idéntica al diseño de referencia ───── */}
      <header className="relative z-40 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 shrink-0 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-14 px-4 sm:px-6 lg:px-8">
          
          {/* Logo y título */}
          <div className="flex items-center gap-3">
            <Logo className="h-8 w-auto" />
            <div className="flex flex-col">
              <span className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight leading-none">
                Reserva<span className="text-sky-600 dark:text-sky-400">UPLA</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">
                Gestión de ambientes
              </span>
            </div>
          </div>

          {/* Enlaces de navegación tipo reporte */}
          <nav aria-label="Navegación principal" className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <button
              type="button"
              onClick={() => abrirModal('¿Qué es ReservaUPLA?', 'Plataforma oficial de la Universidad Peruana Los Andes para la gestión, reserva y trazabilidad de ambientes académicos, laboratorios y auditorios sin cruces ni duplicidades.')}
              className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
            >
              Qué es
            </button>
            <button
              type="button"
              onClick={() => abrirModal('¿Cómo funciona?', '1. El solicitante registra su reserva.\n2. El sistema valida automáticamente franja horaria y disponibilidad.\n3. El Administrador aprueba o rechaza la solicitud de forma trazable.')}
              className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
            >
              Cómo funciona
            </button>
            <button
              type="button"
              onClick={() => abrirModal('Catálogo de Ambientes', 'Contamos con auditorios centrales, aulas magnas, laboratorios de cómputo Cisco, robótica e inteligencia artificial, y salas de grados')}
              className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
            >
              Ambientes
            </button>
            <button
              type="button"
              onClick={() => abrirModal('Reglas del Sistema', `• Horario institucional: ${horaApertura} a ${horaCierre}.\n• Sin cruces ni traslapes de horario.\n• Todo cambio de estado queda registrado con auditoría.`)}
              className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
            >
              Reglas
            </button>
            <button
              type="button"
              onClick={() => abrirModal('Preguntas Frecuentes', '¿Quiénes pueden reservar? Docentes y solicitantes autorizados con cuenta institucional activa.\n\n¿Cómo valido mi cuenta? Al registrarte, el Administrador validará tu solicitud.')}
              className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
            >
              Preguntas
            </button>
          </nav>

          {/* Acciones del header */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={alternarAnimacion}
              aria-label={animacionActiva ? 'Desactivar animación de fondo' : 'Activar animación de fondo'}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              title="Alternar animación"
            >
              <Sparkles className={`w-4 h-4 ${animacionActiva ? 'text-amber-500' : 'text-slate-400'}`} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={alternarTema}
              aria-label={tema === 'dark' ? 'Modo claro' : 'Modo oscuro'}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              title="Cambiar tema"
            >
              {tema === 'dark'
                ? <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
                : <Moon className="w-4 h-4" aria-hidden="true" />
              }
            </button>
            <span className="h-5 w-px bg-slate-200 dark:bg-slate-700 mx-1" aria-hidden="true" />

            {usuario ? (
              <Button onClick={alIrALogin} variant="primary" size="sm" icon={LayoutDashboard}>
                Ir al panel
              </Button>
            ) : (
              <>
                <Button onClick={alIrALogin} variant="primary" size="sm" icon={LogIn} className="bg-[#0b2447] hover:bg-[#19376d] text-white">
                  Iniciar sesión
                </Button>
                <Button onClick={alIrARegistro} variant="outline" size="sm" icon={UserPlus} className="hidden lg:inline-flex border-slate-300 dark:border-slate-700">
                  Regístrate como solicitante
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ───── Cuerpo principal (Hero centralizado estilo reporte) ───── */}
      <main id="contenido-principal" className="relative z-10 flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-3 text-center max-w-5xl mx-auto">
        
        {/* Pill institucional con punto verde */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 dark:bg-slate-900/60 backdrop-blur-md border border-white/20 text-white text-[11px] font-semibold tracking-wide mb-4 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
          <span>PLATAFORMA INSTITUCIONAL OFICIAL · UPLA</span>
        </div>

        {/* Título principal idéntico al requerimiento */}
        <h1 id="hero-titulo" className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.15] mb-4 drop-shadow-md">
          Reserve ambientes universitarios sin cruces de horario con{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-300 to-sky-200">
            ReservaUPLA
          </span>
        </h1>

        {/* Subtítulo descriptivo */}
        <p className="text-sm sm:text-base lg:text-lg text-slate-200 max-w-2xl mx-auto mb-6 leading-relaxed font-normal drop-shadow-xs">
          Solicite un laboratorio, auditorio o sala, consulte su disponibilidad antes de enviar y siga el estado de su solicitud en un solo lugar.
        </p>

        {/* Botones de acción principales */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          {usuario ? (
            <Button onClick={alIrALogin} variant="primary" size="lg" icon={LayoutDashboard} className="shadow-lg shadow-sky-600/30">
              Ir al panel
            </Button>
          ) : (
            <>
              <Button
                onClick={alIrALogin}
                variant="primary"
                size="lg"
                icon={LogIn}
                className="bg-white hover:bg-slate-100 text-slate-950 font-bold px-6 shadow-xl"
              >
                Iniciar sesión
              </Button>
              <Button
                onClick={alIrARegistro}
                variant="outline"
                size="lg"
                icon={UserPlus}
                className="text-white border-white/30 bg-white/10 hover:bg-white/20 backdrop-blur-md"
              >
                Regístrate como solicitante
              </Button>
            </>
          )}
        </div>

        {/* 3 Pills horizontales de características clave (Validación, Horario, Estados) */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/40 backdrop-blur-md border border-white/15 text-xs text-slate-200 font-medium shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
            <span>Validación de cruces</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/40 backdrop-blur-md border border-white/15 text-xs text-slate-200 font-medium shadow-xs">
            <Clock className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
            <span>
              <span data-testid="hora-apertura">{horaApertura}</span> — <span data-testid="hora-cierre">{horaCierre}</span>
            </span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/40 backdrop-blur-md border border-white/15 text-xs text-slate-200 font-medium shadow-xs">
            <GitCompare className="w-3.5 h-3.5 text-violet-400" aria-hidden="true" />
            <span>4 estados trazables</span>
          </div>
        </div>

        {/* ── Franja de Roles del Sistema (compacta con glassmorphism) ── */}
        <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {ROLES.map(({ nombre, descripcion, icono: Icono, color, border, badge }) => (
            <div
              key={nombre}
              className={`rounded-xl px-3 py-2 bg-white/10 dark:bg-slate-900/40 backdrop-blur-md border ${border} flex items-center gap-2.5 text-left transition-all hover:bg-white/15 shadow-sm`}
            >
              <div className={`p-1.5 rounded-lg bg-slate-950/40 ${color} shrink-0`}>
                <Icono className="w-4 h-4" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs text-white truncate">{nombre}</h3>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">{badge}</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-tight truncate">{descripcion}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ───── Modal de información para los enlaces de navegación ───── */}
      {modalInfo && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-titulo"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setModalInfo(null)}
              aria-label="Cerrar modal"
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
            <h3 id="modal-titulo" className="text-lg font-bold text-sky-400 mb-3">
              {modalInfo.titulo}
            </h3>
            <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed mb-5">
              {modalInfo.contenido}
            </p>
            <div className="flex justify-end">
              <Button onClick={() => setModalInfo(null)} variant="primary" size="sm">
                Entendido
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ───── Pie de página sutil institucional ───── */}
      <footer className="relative z-40 shrink-0 border-t border-white/10 bg-black/40 backdrop-blur-md py-2.5">
        <p className="text-center text-xs text-slate-400">
          © {anioActual} Universidad Peruana Los Andes · Sistema de Reserva de Ambientes Institucionales
        </p>
      </footer>
    </div>
  );
}
