import React, { useState } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import Reservas from './pages/Reservas';
import CrearReserva from './pages/CrearReserva';
import Ambientes from './pages/Ambientes';
import Usuarios from './pages/Usuarios';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
        {activeTab === 'reservas' && <Reservas setActiveTab={setActiveTab} />}
        {activeTab === 'nueva-reserva' && <CrearReserva setActiveTab={setActiveTab} />}
        {activeTab === 'ambientes' && <Ambientes />}
        {activeTab === 'usuarios' && <Usuarios />}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} Universidad Peruana Los Andes (UPLA) — Caso Práctico Construcción de Software.
          </p>
          <div className="flex items-center gap-4">
            <span className="font-semibold text-slate-700">ReservaUPLA Prototipo v1.0.0</span>
            <span>Semanas 01 - 09</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
