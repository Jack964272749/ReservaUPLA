import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import Shell from './components/Shell';
import Login from './pages/Login';
import RegistroSolicitante from './pages/RegistroSolicitante';
import Dashboard from './pages/Dashboard';
import Reservas from './pages/Reservas';
import CrearReserva from './pages/CrearReserva';
import Ambientes from './pages/Ambientes';
import Usuarios from './pages/Usuarios';

// Trazabilidad: Nielsen H1, H4, H7 · Shneiderman S1, S2 · ISO 9241-11
function ContenidoApp() {
  const { usuario, cargando } = useAuth();
  const [vistaAuth, setVistaAuth] = useState('login'); // 'login' | 'registro'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [ambientePreseleccionado, setAmbientePreseleccionado] = useState(null);

  if (cargando) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="min-h-screen flex flex-col items-center justify-center bg-[#EDF3F9] dark:bg-slate-950 text-slate-700 dark:text-slate-300"
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
      return <RegistroSolicitante alVolverALogin={() => setVistaAuth('login')} />;
    }
    return <Login alIrARegistro={() => setVistaAuth('registro')} />;
  }

  // Manejo de tabs según rol
  const rol = usuario.rol;
  const tabValido =
    (rol === 'Administrador') ||
    (rol === 'Responsable' && (activeTab === 'reservas' || activeTab === 'ambientes')) ||
    (rol === 'Solicitante' && (activeTab === 'reservas' || activeTab === 'nueva-reserva' || activeTab === 'ambientes'));

  const tabActual = tabValido ? activeTab : (rol === 'Administrador' ? 'dashboard' : 'reservas');

  return (
    <Shell activeTab={tabActual} setActiveTab={setActiveTab}>
      {tabActual === 'dashboard' && rol === 'Administrador' && (
        <Dashboard
          alIrAReservas={() => setActiveTab('reservas')}
          alIrANuevaReserva={() => setActiveTab('nueva-reserva')}
        />
      )}

      {tabActual === 'reservas' && (
        <Reservas
          alIrANuevaReserva={
            rol !== 'Responsable' ? () => setActiveTab('nueva-reserva') : undefined
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
          alReservarAmbiente={(id) => {
            setAmbientePreseleccionado(id);
            setActiveTab('nueva-reserva');
          }}
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
