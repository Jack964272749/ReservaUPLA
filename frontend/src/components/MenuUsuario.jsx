import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, LogOut, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

// Trazabilidad: Nielsen H3 (Control del usuario), H6 (Reconocer antes que recordar) · Shneiderman S7 · ISO 9241-110
// Menú desplegable con los datos de la sesión y sus opciones (visible para todos los roles).
export default function MenuUsuario() {
  const { usuario, logout } = useAuth();
  const [abierto, setAbierto] = useState(false);
  const contenedorRef = useRef(null);

  useEffect(() => {
    if (!abierto) return undefined;
    const alClicFuera = (e) => {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target)) setAbierto(false);
    };
    const alTeclear = (e) => {
      if (e.key === 'Escape') setAbierto(false);
    };
    document.addEventListener('mousedown', alClicFuera);
    document.addEventListener('keydown', alTeclear);
    return () => {
      document.removeEventListener('mousedown', alClicFuera);
      document.removeEventListener('keydown', alTeclear);
    };
  }, [abierto]);

  if (!usuario) return null;

  const iniciales = (usuario.nombreCompleto || '?')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join('');

  return (
    <div ref={contenedorRef} className="relative">
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={abierto}
        aria-label="Abrir menú de usuario"
        className="flex items-center gap-2.5 pl-2 pr-2.5 sm:pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 min-h-[44px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
      >
        <span
          className="w-8 h-8 flex-shrink-0 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 text-xs font-bold flex items-center justify-center"
          aria-hidden="true"
        >
          {iniciales}
        </span>
        <span className="hidden md:block text-left leading-tight">
          <span className="block text-sm font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[170px]">
            {usuario.nombreCompleto}
          </span>
          <span className="block text-xs text-slate-500 dark:text-slate-400">{usuario.rol}</span>
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-500 transition-transform ${abierto ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {abierto && (
        <div
          role="menu"
          aria-label="Opciones de usuario"
          className="animate-menu-entrar absolute right-0 mt-2 w-72 z-50 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl p-2"
        >
          <div className="px-3 py-3 border-b border-slate-100 dark:border-slate-800">
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100 break-words">
              {usuario.nombreCompleto}
            </p>
            {usuario.correo && (
              <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 break-all">
                <Mail className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                {usuario.correo}
              </p>
            )}
            <p className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
              <ShieldCheck className="w-3 h-3" aria-hidden="true" />
              {usuario.rol}
            </p>
          </div>

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setAbierto(false);
              logout();
            }}
            className="mt-1 w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 transition-colors"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
