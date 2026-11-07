import React, { useEffect, useState } from 'react';
import Header from './Header';
import Navigation from './Navigation';
import { useAuth } from '../hooks/useAuth';
import { obtenerRuta } from '../utils/rutas';

const anioActual = new Date().getFullYear();

// Imagen de fondo difuminada según el módulo (las mismas que usan las páginas en /public/backgrounds)
const FONDOS = {
  dashboard: '/backgrounds/bg_dashboard.jpg',
  reservas: '/backgrounds/bg_listado.jpg',
  'nueva-reserva': '/backgrounds/bg_nueva_reserva.jpg',
  ambientes: '/backgrounds/bg_ambientes.jpg',
  usuarios: '/backgrounds/bg_listado.jpg',
};

// Trazabilidad: Nielsen H4 (Consistencia), H8 (Estética y minimalismo) · Shneiderman S1, S2 · WCAG 2.1 AA
// Disposición: barra de navegación vertical a la izquierda (fija en escritorio, desplegable en móvil).
export default function Shell({ activeTab, setActiveTab, children }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { usuario } = useAuth();

  // Escape cierra el menú desplegable en móvil (Shneiderman S7 · Control del usuario)
  useEffect(() => {
    if (!menuAbierto) return undefined;
    const alPresionar = (e) => {
      if (e.key === 'Escape') setMenuAbierto(false);
    };
    window.addEventListener('keydown', alPresionar);
    return () => window.removeEventListener('keydown', alPresionar);
  }, [menuAbierto]);

  return (
    <div className="min-h-screen bg-[#f4f6fa] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      {/* Enlace de salto accesible para lectores de pantalla y navegación por teclado (WCAG 2.4.1) */}
      <a
        href="#contenido-principal"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:px-4 focus:py-2 focus:bg-sky-700 focus:text-white focus:rounded-lg focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 font-semibold text-sm"
      >
        Saltar al contenido principal
      </a>

      {/* Barra lateral fija (escritorio) */}
      <aside
        id="menu-lateral"
        className="hidden lg:block fixed inset-y-0 left-0 z-40 w-64 xl:w-72"
      >
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </aside>

      {/* Menú desplegable (móvil) */}
      {menuAbierto && (
        <div className="lg:hidden fixed inset-0 z-50 flex animate-ayuda-fondo" role="dialog" aria-modal="true" aria-label="Menú de navegación">
          <div className="w-72 max-w-[85%] h-full shadow-2xl animate-deslizar-izq">
            <Navigation
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onNavegar={() => setMenuAbierto(false)}
            />
          </div>
          <button
            type="button"
            aria-label="Cerrar menú de navegación"
            onClick={() => setMenuAbierto(false)}
            className="flex-1 bg-slate-950/60 backdrop-blur-[1px] cursor-default"
          />
        </div>
      )}

      {/* Fondo del módulo: imagen difuminada que ocupa todo el espacio a la derecha de la barra lateral */}
      <div
        aria-hidden="true"
        className="fixed inset-y-0 right-0 left-0 lg:left-64 xl:left-72 z-0 pointer-events-none overflow-hidden"
      >
        <div
          key={activeTab}
          className="absolute inset-0 animate-ayuda-fondo bg-cover bg-center scale-105 blur-[6px]"
          style={{ backgroundImage: `url("${FONDOS[activeTab] || FONDOS.reservas}")` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#f4f6fa]/75 via-[#f4f6fa]/55 to-sky-100/50 dark:from-slate-950/90 dark:via-slate-950/80 dark:to-slate-950/90 transition-colors" />
      </div>

      <div className="lg:pl-64 xl:pl-72 flex flex-col min-h-screen">
        <Header
          ruta={obtenerRuta(activeTab, usuario?.rol)}
          onIrA={setActiveTab}
          onAbrirMenu={() => setMenuAbierto(true)}
          menuAbierto={menuAbierto}
        />

        <main
          id="contenido-principal"
          tabIndex={-1}
          className="relative z-10 flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 focus:outline-none"
        >
          {children}
        </main>

        <footer className="relative z-10 border-t border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
          <div className="px-4">
            <p>© {anioActual} Universidad Peruana Los Andes — Sistema de Reserva de Ambientes Institucionales</p>
            <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
              Facultad de Ingeniería · Huancayo, Perú
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
