import React from 'react';
import {
  Clock,
  Hourglass,
  CheckCircle2,
  XCircle,
  Ban,
  UserPlus,
  LogIn,
  LayoutDashboard,
  ClipboardList,
  Eye,
  ShieldCheck,
  Users,
  Building2,
  Sun,
  Moon,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import Logo from '../components/Logo';
import Button from '../components/Button';
import LienzoIgloo from '../components/LienzoIgloo';
import FondoModulo from '../components/FondoModulo';
import { useTema } from '../hooks/useTema';
import { useAnimacionFondo } from '../hooks/useAnimacionFondo';
import { useAuth } from '../hooks/useAuth';
import { REGLAS } from '../constants/reglas';

const anioActual = new Date().getFullYear();

const ESTADOS_RESERVA = [
  {
    nombre: 'Pendiente',
    descripcion: 'La solicitud fue registrada y espera revisión del Administrador.',
    icono: Hourglass,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-200/90 dark:border-amber-800/80',
  },
  {
    nombre: 'Aprobada',
    descripcion: 'La reserva fue aceptada y el ambiente queda asignado.',
    icono: CheckCircle2,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-200/90 dark:border-emerald-800/80',
  },
  {
    nombre: 'Rechazada',
    descripcion: 'La solicitud fue denegada con una justificación formal.',
    icono: XCircle,
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-200/90 dark:border-rose-800/80',
  },
  {
    nombre: 'Cancelada',
    descripcion: 'El solicitante anuló la reserva antes de su aprobación.',
    icono: Ban,
    color: 'text-slate-600 dark:text-slate-400',
    bg: 'bg-slate-50/90 dark:bg-slate-900/50 border-slate-200/90 dark:border-slate-700/80',
  },
];

const ROLES = [
  {
    nombre: 'Solicitante',
    descripcion: 'Crea reservas de ambientes universitarios y consulta el estado de las suyas.',
    icono: ClipboardList,
    color: 'text-sky-600 dark:text-sky-400',
    bg: 'border-sky-200/90 dark:border-sky-800/80',
  },
  {
    nombre: 'Responsable de Ambiente',
    descripcion: 'Consulta las reservas de los ambientes asignados a su cargo.',
    icono: Eye,
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'border-violet-200/90 dark:border-violet-800/80',
  },
  {
    nombre: 'Administrador',
    descripcion: 'Aprueba o rechaza reservas y gestiona usuarios y ambientes.',
    icono: ShieldCheck,
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'border-rose-200/90 dark:border-rose-800/80',
  },
];

export default function LandingPage({ alIrALogin, alIrARegistro }) {
  const { tema, alternarTema } = useTema();
  const { animacionActiva, alternarAnimacion } = useAnimacionFondo();
  const { usuario } = useAuth();

  const horaApertura = REGLAS.RESERVA.HORA_APERTURA;
  const horaCierre = REGLAS.RESERVA.HORA_CIERRE;

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f6fa] dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors">
      {/* Skip link — Accessibility */}
      <a
        href="#contenido-principal"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-sky-600 focus:text-white focus:rounded-lg focus:text-sm focus:font-semibold"
      >
        Saltar al contenido
      </a>

      {/* ───── Header ───── */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <Logo className="h-9 w-auto" />
            <span className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight">
              Reserva<span className="text-sky-600 dark:text-sky-400">UPLA</span>
            </span>
          </div>

          <nav aria-label="Navegación principal" className="flex items-center gap-2 sm:gap-3">
            {/* Control accesible de animación de fondo */}
            <button
              type="button"
              onClick={alternarAnimacion}
              aria-label={animacionActiva ? 'Desactivar animación de fondo' : 'Activar animación de fondo'}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 min-h-[44px] min-w-[44px] flex items-center justify-center transition-all"
            >
              <Sparkles className={`w-4 h-4 ${animacionActiva ? 'text-amber-500' : 'text-slate-400'}`} aria-hidden="true" />
            </button>
            {/* Alternar modo claro/oscuro */}
            <button
              type="button"
              onClick={alternarTema}
              aria-label={tema === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 min-h-[44px] min-w-[44px] flex items-center justify-center transition-all"
            >
              {tema === 'dark'
                ? <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
                : <Moon className="w-4 h-4" aria-hidden="true" />
              }
            </button>

            <span className="h-8 w-px bg-slate-200 dark:bg-slate-700" aria-hidden="true" />

            {usuario ? (
              <Button onClick={alIrALogin} variant="primary" size="sm" icon={LayoutDashboard}>
                Ir al panel
              </Button>
            ) : (
              <>
                <Button onClick={alIrALogin} variant="outline" size="sm" icon={LogIn}>
                  Iniciar sesión
                </Button>
                <Button onClick={alIrARegistro} variant="primary" size="sm" icon={UserPlus} className="hidden sm:inline-flex">
                  Regístrate como solicitante
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* ───── Main ───── */}
      <main id="contenido-principal" className="flex-1">

        {/* ── Hero ── */}
        <section className="relative overflow-hidden" aria-labelledby="hero-titulo">
          {/* Fondo animado interactivo */}
          <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
            <LienzoIgloo />
          </div>
          <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-white/60 via-transparent to-white/80 dark:from-slate-950/70 dark:via-transparent dark:to-slate-950/80" aria-hidden="true" />

          <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 py-20 sm:py-28 lg:py-36">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/80 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 text-xs font-semibold mb-6 border border-sky-200 dark:border-sky-800 shadow-xs">
              <Building2 className="w-3.5 h-3.5" aria-hidden="true" />
              Universidad Peruana Los Andes
            </div>

            <h1 id="hero-titulo" className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
              Reserva
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-sky-700 dark:from-sky-400 dark:to-sky-500">
                UPLA
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
              Sistema institucional para registrar, validar y consultar reservas de ambientes
              universitarios, evitando duplicidades y cruces de horarios.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {usuario ? (
                <Button onClick={alIrALogin} variant="primary" size="lg" icon={LayoutDashboard}>
                  Ir al panel
                </Button>
              ) : (
                <>
                  <Button onClick={alIrALogin} variant="primary" size="lg" icon={LogIn}>
                    Iniciar sesión
                  </Button>
                  <Button onClick={alIrARegistro} variant="outline" size="lg" icon={UserPlus}>
                    Regístrate como solicitante
                  </Button>
                </>
              )}
            </div>

            <div className="mt-12 animate-bounce" aria-hidden="true">
              <ChevronDown className="w-6 h-6 mx-auto text-slate-400 dark:text-slate-500" />
            </div>
          </div>
        </section>

        {/* ── Horario Institucional con Imagen de Fondo ── */}
        <FondoModulo
          imagen="/backgrounds/bg_dashboard.jpg"
          className="border-y border-slate-200 dark:border-slate-800"
          overlayClassName="bg-slate-50/85 dark:bg-slate-950/85 backdrop-blur-[2px]"
        >
          <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center" aria-labelledby="horario-titulo">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-100/90 dark:bg-sky-900/60 backdrop-blur-md mb-5 shadow-sm border border-sky-200/60 dark:border-sky-800/60">
              <Clock className="w-7 h-7 text-sky-600 dark:text-sky-400" aria-hidden="true" />
            </div>
            <h2 id="horario-titulo" className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
              Horario Institucional
            </h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-xl mx-auto mb-8 font-medium">
              Las reservas de ambientes están habilitadas exclusivamente dentro del
              horario operativo de la universidad.
            </p>
            <div className="inline-flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-sky-200 dark:border-sky-800 shadow-md">
              <span className="text-3xl sm:text-4xl font-extrabold text-sky-700 dark:text-sky-300" data-testid="hora-apertura">
                {horaApertura}
              </span>
              <span className="text-slate-400 dark:text-slate-500 text-xl font-bold">—</span>
              <span className="text-3xl sm:text-4xl font-extrabold text-sky-700 dark:text-sky-300" data-testid="hora-cierre">
                {horaCierre}
              </span>
            </div>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 font-medium">
              Fuera de este rango, el sistema no permitirá crear ni aprobar reservas.
            </p>
          </section>
        </FondoModulo>

        {/* ── Estados de una Reserva con Imagen de Fondo ── */}
        <FondoModulo
          imagen="/backgrounds/bg_listado.jpg"
          className="border-b border-slate-200 dark:border-slate-800"
          overlayClassName="bg-slate-50/85 dark:bg-slate-950/85 backdrop-blur-[2px]"
        >
          <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20" aria-labelledby="estados-titulo">
            <div className="text-center mb-12">
              <h2 id="estados-titulo" className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
                Estados de una Reserva
              </h2>
              <p className="text-slate-600 dark:text-slate-300 max-w-xl mx-auto font-medium">
                Cada solicitud de reserva pasa por un ciclo de vida claro y auditable.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {ESTADOS_RESERVA.map(({ nombre, descripcion, icono: Icono, color, bg }) => (
                <div
                  key={nombre}
                  className={`rounded-2xl p-5 border backdrop-blur-md transition-all hover:shadow-lg ${bg}`}
                >
                  <Icono className={`w-8 h-8 mb-3 ${color}`} aria-hidden="true" />
                  <h3 className={`font-bold text-base mb-1 ${color}`}>{nombre}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {descripcion}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </FondoModulo>

        {/* ── Roles del Sistema con Imagen de Fondo ── */}
        <FondoModulo
          imagen="/backgrounds/bg_ambientes.jpg"
          className="border-b border-slate-200 dark:border-slate-800"
          overlayClassName="bg-slate-50/85 dark:bg-slate-950/85 backdrop-blur-[2px]"
        >
          <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20" aria-labelledby="roles-titulo">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-violet-100/90 dark:bg-violet-900/60 backdrop-blur-md mb-5 shadow-sm border border-violet-200/60 dark:border-violet-800/60">
                <Users className="w-7 h-7 text-violet-600 dark:text-violet-400" aria-hidden="true" />
              </div>
              <h2 id="roles-titulo" className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
                Roles del Sistema
              </h2>
              <p className="text-slate-600 dark:text-slate-300 max-w-xl mx-auto font-medium">
                Cada usuario accede a las funcionalidades correspondientes a su rol institucional.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ROLES.map(({ nombre, descripcion, icono: Icono, color, bg }) => (
                <div
                  key={nombre}
                  className={`rounded-2xl p-6 border bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-all hover:shadow-xl ${bg}`}
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 shadow-xs mb-4`}>
                    <Icono className={`w-6 h-6 ${color}`} aria-hidden="true" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{nombre}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {descripcion}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </FondoModulo>

        {/* ── Comienza a reservar ambientes con Imagen de Fondo ── */}
        <FondoModulo
          imagen="/backgrounds/bg_nueva_reserva.jpg"
          className=""
          overlayClassName="bg-slate-50/85 dark:bg-slate-950/85 backdrop-blur-[2px]"
        >
          <section className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center" aria-labelledby="cta-titulo">
            <h2 id="cta-titulo" className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
              Comienza a reservar ambientes
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-8 font-medium">
              Accede al sistema con tu cuenta institucional o solicita tu registro como solicitante.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {usuario ? (
                <Button onClick={alIrALogin} variant="primary" size="lg" icon={LayoutDashboard}>
                  Ir al panel
                </Button>
              ) : (
                <>
                  <Button onClick={alIrALogin} variant="primary" size="lg" icon={LogIn}>
                    Iniciar sesión
                  </Button>
                  <Button onClick={alIrARegistro} variant="outline" size="lg" icon={UserPlus}>
                    Regístrate como solicitante
                  </Button>
                </>
              )}
            </div>
          </section>
        </FondoModulo>
      </main>

      {/* ───── Footer ───── */}
      <footer className="py-6 border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60">
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          © {anioActual} Universidad Peruana Los Andes · Sistema de Reservas
        </p>
      </footer>
    </div>
  );
}
