import React from 'react';
import Header from './Header';
import Navigation from './Navigation';

const anioActual = new Date().getFullYear();

// Trazabilidad: Nielsen H4 (Consistencia), H8 (Estética y minimalismo) · Shneiderman S1, S2 · WCAG 2.1 AA
export default function Shell({ activeTab, setActiveTab, children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      {/* Enlace de salto accesible para lectores de pantalla y navegación por teclado (WCAG 2.4.1) */}
      <a
        href="#contenido-principal"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-sky-700 focus:text-white focus:rounded-lg focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 font-semibold text-sm"
      >
        Saltar al contenido principal
      </a>

      <Header />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <main
        id="contenido-principal"
        tabIndex={-1}
        className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 focus:outline-none"
      >
        {children}
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {anioActual} Universidad Peruana Los Andes — Sistema de Reserva de Ambientes Institucionales</p>
          <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
            Facultad de Ingeniería · Huancayo, Perú
          </p>
        </div>
      </footer>
    </div>
  );
}
