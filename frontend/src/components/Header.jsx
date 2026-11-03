import React from 'react';
import { Building2, Bell, User } from 'lucide-react';

export default function Header({ activeTab, setActiveTab }) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-sky-700 to-sky-500 text-white p-2.5 rounded-xl shadow-md shadow-sky-600/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-sky-800 to-sky-600 bg-clip-text text-transparent">
                ReservaUPLA
              </span>
              <p className="text-[11px] text-slate-500 font-medium leading-none">
                Gestión de Ambientes Universitarios
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-100 text-xs font-semibold text-sky-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Semestre 2026-II
            </div>

            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200">
                <User className="w-4 h-4" />
              </div>
              <div className="hidden md:block text-left text-xs">
                <p className="font-semibold text-slate-700">Administrador</p>
                <p className="text-slate-400">admin@upla.edu.pe</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
