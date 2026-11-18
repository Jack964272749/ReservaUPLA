import React, { useEffect, useState, useCallback } from 'react';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import Shell from './components/Shell';
import AlertaPendientes from './components/AlertaPendientes';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import RegistroSolicitante from './pages/RegistroSolicitante';
import Dashboard from './pages/Dashboard';
import Reservas from './pages/Reservas';
import CrearReserva from './pages/CrearReserva';
import Ambientes from './pages/Ambientes';
import Usuarios from './pages/Usuarios';

// Utility: read the first segment of the pathname (hash‐free)
function leerRuta() {
  return window.location.pathname.replace(/\/+$/, '') || '/';
}

function navegarA(ruta) {
  if (leerRuta() !== ruta) {
    window.history.pushState(null, '', ruta);
  }
}

// Trazabilidad: Nielsen H1, H4, H7 · Shneiderman S1, S2 · ISO 9241-11
function ContenidoApp() {
  const { usuario, cargando } = useAuth();
  const [vistaAuth, setVistaAuth] = useState(() => {
    const ruta = leerRuta();
    if (ruta === '/registro') return 'registro';
    if (ruta === '/login') return 'login';
    return 'landing';
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [ambientePreseleccionado, setAmbientePreseleccionado] = useState(null);
  const [estadoInicialReservas, setEstadoInicialReservas] = useState(null);
  const [ambienteDestacado, setAmbienteDestacado] = useState(null);

  // Sync browser back/forward with internal state
  useEffect(() => {
    const onPopState = () => {
      const ruta = leerRuta();
      if (ruta === '/registro') setVistaAuth('registro');
      else if (ruta === '/login') setVistaAuth('login');
      else if (ruta === '/') setVistaAuth('landing');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Al iniciar sesión: el Administrador entra al Dashboard y el resto a sus reservas
  useEffect(() => {
    if (usuario) {
      setActiveTab(usuario.rol === 'Administrador' ? 'dashboard' : 'reservas');
      setEstadoInicialReservas(null);
    }
  }, [usuario?.id]);

  const irALogin = useCallback(() => {
    navegarA('/login');
    setVistaAuth('login');
  }, []);

  const irARegistro = useCallback(() => {
    navegarA('/registro');
    setVistaAuth('registro');
  }, []);

  const irALanding = useCallback(() => {
    navegarA('/');
    setVistaAuth('landing');
  }, []);

  // Cambio de sección desde el menú: descarta filtros preseleccionados
  const cambiarTab = (id) => {
    setEstadoInicialReservas(null);
    setAmbienteDestacado(null);
    setActiveTab(id);
  };

  if (cargando) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="min-h-screen flex flex-col items-center justify-center bg-[#f4f6fa] dark:bg-slate-950 text-slate-700 dark:text-slate-300"
      >
        <span
          className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-sky-600 border-t-transparent mb-4"
          aria-hidden="true"
        />
        <p className="text-sm font-semibold tracking-wide">
          Verificando sesión institucional…
        </p>
      </div>
    );
  }

  // Vista de usuarios no autenticados
  if (!usuario) {
    if (vistaAuth === 'registro') {
      return <RegistroSolicitante alVolverALogin={irALogin} />;
    }
    if (vistaAuth === 'login') {
      return <Login alIrARegistro={irARegistro} alIrALanding={irALanding} />;
    }
    // Landing page (default for "/")
    return <LandingPage alIrALogin={irALogin} alIrARegistro={irARegistro} />;
  }

  // If authenticated user lands on "/" or "/login", redirect to app
  if (vistaAuth === 'landing' || vistaAuth === 'login') {
    // Show the app shell — do not redirect URL to keep it clean
  }

  // Manejo de tabs según rol
  const rol = usuario.rol;
  const tabValido =
    (rol === 'Administrador' && activeTab !== 'nueva-reserva') ||
    (rol === 'Responsable' && (activeTab === 'reservas' || activeTab === 'ambientes')) ||
    (rol === 'Solicitante' && (activeTab === 'reservas' || activeTab === 'nueva-reserva' || activeTab === 'ambientes'));

  const tabActual = tabValido ? activeTab : (rol === 'Administrador' ? 'dashboard' : 'reservas');

  return (
    <Shell activeTab={tabActual} setActiveTab={cambiarTab}>
      {rol === 'Administrador' && (
        <AlertaPendientes
          alRevisar={() => {
            setActiveTab('reservas');
            setEstadoInicialReservas('Pendiente');
          }}
        />
      )}

      {tabActual === 'dashboard' && rol === 'Administrador' && (
        <Dashboard
          alIrAReservas={(estado) => {
            setEstadoInicialReservas(estado !== undefined ? estado : '');
            setActiveTab('reservas');
          }}
          alIrAAmbientes={(nombre) => {
            setAmbienteDestacado(nombre || null);
            setActiveTab('ambientes');
          }}
        />
      )}

      {tabActual === 'reservas' && (
        <Reservas
          estadoInicial={estadoInicialReservas}
          alIrANuevaReserva={
            rol === 'Solicitante' ? () => setActiveTab('nueva-reserva') : undefined
          }
        />
      )}

      {tabActual === 'nueva-reserva' && (
        <CrearReserva
          ambientePreseleccionadoId={ambientePreseleccionado}
          alVerReservas={() => setActiveTab('reservas')}
        />
      )}

      {tabActual === 'ambientes' && (
        <Ambientes
          ambienteDestacado={ambienteDestacado}
          alReservarAmbiente={
            rol === 'Solicitante'
              ? (id) => {
                  setAmbientePreseleccionado(id);
                  setActiveTab('nueva-reserva');
                }
              : undefined
          }
        />
      )}

      {tabActual === 'usuarios' && rol === 'Administrador' && (
        <Usuarios />
      )}
    </Shell>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ContenidoApp />
    </AuthProvider>
  );
}
