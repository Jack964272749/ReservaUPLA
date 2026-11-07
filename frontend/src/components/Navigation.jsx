import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  CalendarPlus,
  DoorOpen,
  Users,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Logo from './Logo';

// Trazabilidad: Nielsen H4 (Consistencia), H7 (Flexibilidad) · Shneiderman S1, S2
// Barra de navegación vertical (lateral izquierda) con la marca, el menú por rol y los datos de la sesión.
export default function Navigation({ activeTab, setActiveTab, onNavegar }) {
  const { usuario, logout } = useAuth();
  const rol = usuario?.rol || 'Solicitante';

  const todosLosItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      roles: ['Administrador'],
    },
    {
      id: 'reservas',
      label:
        rol === 'Solicitante'
          ? 'Mis Reservas'
          : rol === 'Responsable'
          ? 'Reservas Asignadas'
          : 'Listado de Reservas',
      icon: CalendarDays,
      roles: ['Administrador', 'Responsable', 'Solicitante'],
    },
    {
      id: 'nueva-reserva',
      label: 'Nueva Reserva',
      icon: CalendarPlus,
      roles: ['Solicitante'],
    },
    {
      id: 'ambientes',
      label: 'Ambientes',
      icon: DoorOpen,
      roles: ['Administrador', 'Responsable', 'Solicitante'],
    },
    {
      id: 'usuarios',
      label: 'Usuarios',
      icon: Users,
      roles: ['Administrador'],
    },
  ];

  const itemsVisibles = todosLosItems.filter((item) => item.roles.includes(rol));
  const inicial = (usuario?.nombreCompleto || '?').trim().charAt(0).toUpperCase();

  const irA = (id) => {
    setActiveTab(id);
    if (onNavegar) onNavegar();
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#061426] text-slate-300 border-r border-white/5">
      {/* Marca */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-5 border-b border-white/10">
        <Logo className="h-10 w-auto" />
        <div className="min-w-0">
          <p className="text-lg font-extrabold leading-none text-white tracking-tight">
            Reserva<span className="text-sky-400">UPLA</span>
          </p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 leading-tight">
            Universidad Peruana
            <br />
            Los Andes
          </p>
        </div>
      </div>

      {/* Menú */}
      <nav
        aria-label="Navegación principal del sistema"
        className="flex-1 overflow-y-auto px-3 py-5 space-y-1"
      >
        <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-widest text-slate-500">
          Menú
        </p>
        {itemsVisibles.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => irA(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-left transition-all duration-200 min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                isActive
                  ? 'bg-sky-500/15 text-sky-300 ring-1 ring-sky-400/30'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white hover:translate-x-0.5'
              }`}
            >
              <Icon
                className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-sky-400' : 'text-slate-400'}`}
                aria-hidden="true"
              />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Sesión */}
      {usuario && (
        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 flex-shrink-0 rounded-full bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sm font-bold text-sky-300"
              aria-hidden="true"
            >
              {inicial}
            </div>
            <div className="min-w-0 text-xs leading-tight">
              <p className="font-semibold text-white truncate">{usuario.nombreCompleto}</p>
              <p className="mt-0.5 font-medium text-sky-400">{usuario.rol}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 border border-rose-400/30 hover:bg-rose-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 min-h-[44px] transition-colors"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
