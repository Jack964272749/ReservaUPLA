import React, { useState } from 'react';
import { Sun, Moon, LogOut, HelpCircle, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTema } from '../hooks/useTema';
import PanelAyuda from './PanelAyuda';
import Logo from './Logo';

// Trazabilidad: Nielsen H2 (Correspondencia), H3 (Control del usuario), H10 (Ayuda) · Shneiderman S1, S4 · ISO 9241-11
export default function Header() {
  const { usuario, logout } = useAuth();
  const { tema, alternarTema } = useTema();
  const [ayudaAbierta, setAyudaAbierta] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Logo className="h-9 w-auto" />
            <div className="hidden sm:block border-l border-slate-300 dark:border-slate-700 pl-3">
              <span className="text-lg font-bold bg-gradient-to-r from-sky-800 to-sky-600 dark:from-sky-400 dark:to-sky-200 bg-clip-text text-transparent">
                ReservaUPLA
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-none">
                Universidad Peruana Los Andes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Botón de Ayuda (Nielsen H10) */}
            <button
              type="button"
              onClick={() => setAyudaAbierta(true)}
              aria-label="Abrir panel de ayuda y normativas"
              aria-expanded={ayudaAbierta}
              aria-controls="panel-ayuda-contenido"
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            {/* Alternar modo oscuro / claro */}
            <button
              type="button"
              onClick={alternarTema}
              aria-label={tema === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
            >
              {tema === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            {/* Datos del usuario autenticado */}
            {usuario && (
              <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200 dark:border-slate-700">
                <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-950/50 flex items-center justify-center text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800 text-xs font-semibold">
                  <User className="w-4 h-4" />
                </div>
                <div className="hidden md:block text-left text-xs leading-tight">
                  <p className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[150px]">
                    {usuario.nombreCompleto}
                  </p>
                  <p className="text-[11px] text-sky-700 dark:text-sky-400 font-medium">
                    {usuario.rol}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={logout}
                  aria-label="Cerrar sesión"
                  title="Cerrar sesión"
                  className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <PanelAyuda isOpen={ayudaAbierta} onClose={() => setAyudaAbierta(false)} />
    </header>
  );
}
