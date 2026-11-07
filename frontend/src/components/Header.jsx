import React, { useState } from 'react';
import { Sun, Moon, HelpCircle, Menu, ChevronRight } from 'lucide-react';
import { useTema } from '../hooks/useTema';
import PanelAyuda from './PanelAyuda';
import MenuUsuario from './MenuUsuario';

// Trazabilidad: Nielsen H2 (Correspondencia), H3 (Control del usuario), H10 (Ayuda) · Shneiderman S1, S4 · ISO 9241-11
// Barra superior: botón de menú (móvil), título de la sección, ayuda y modo claro/oscuro.
export default function Header({ ruta = [], onIrA, onAbrirMenu, menuAbierto }) {
  const { tema, alternarTema } = useTema();
  const [ayudaAbierta, setAyudaAbierta] = useState(false);

  const botonIcono =
    'p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 min-h-[44px] min-w-[44px] flex items-center justify-center transition-all duration-200';

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-all duration-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onAbrirMenu}
            aria-label="Abrir menú de navegación"
            aria-expanded={!!menuAbierto}
            aria-controls="menu-lateral"
            className={`lg:hidden ${botonIcono}`}
          >
            <Menu className="w-5 h-5" />
          </button>
          <nav aria-label="Ruta de navegación" className="min-w-0">
            <ol className="flex items-center gap-1.5 text-sm min-w-0">
              {ruta.map((item, i) => {
                const esUltimo = i === ruta.length - 1;
                return (
                  <li key={`${item.label}-${i}`} className="flex items-center gap-1.5 min-w-0">
                    {i > 0 && (
                      <ChevronRight
                        className="w-4 h-4 flex-shrink-0 text-slate-400 dark:text-slate-500"
                        aria-hidden="true"
                      />
                    )}
                    {esUltimo ? (
                      <span
                        aria-current="page"
                        className="font-bold text-slate-900 dark:text-slate-100 truncate"
                      >
                        {item.label}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onIrA && item.tab && onIrA(item.tab)}
                        className="font-medium text-sky-700 dark:text-sky-400 hover:text-sky-900 dark:hover:text-sky-200 hover:underline truncate rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                      >
                        {item.label}
                      </button>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Botón de Ayuda (Nielsen H10) */}
          <button
            type="button"
            onClick={() => setAyudaAbierta(true)}
            aria-label="Abrir panel de ayuda y normativas"
            aria-expanded={ayudaAbierta}
            aria-controls="panel-ayuda-contenido"
            className={botonIcono}
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Alternar modo oscuro / claro */}
          <button
            type="button"
            onClick={alternarTema}
            aria-label={tema === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            className="inline-flex items-center gap-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 min-h-[44px] text-xs font-semibold transition-all duration-200"
          >
            {tema === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
            ) : (
              <Moon className="w-4 h-4" aria-hidden="true" />
            )}
            <span className="hidden sm:inline">{tema === 'dark' ? 'Modo claro' : 'Modo oscuro'}</span>
          </button>

          <span className="hidden sm:block h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1" aria-hidden="true" />
          <MenuUsuario />
        </div>
      </div>

      <PanelAyuda isOpen={ayudaAbierta} onClose={() => setAyudaAbierta(false)} />
    </header>
  );
}
