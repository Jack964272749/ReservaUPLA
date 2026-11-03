import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  CalendarPlus,
  DoorOpen,
  Users,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

// Trazabilidad: Nielsen H4 (Consistencia), H7 (Flexibilidad) · Shneiderman S1, S2
export default function Navigation({ activeTab, setActiveTab }) {
  const { usuario } = useAuth();
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
      roles: ['Administrador', 'Solicitante'],
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

  return (
    <nav
      aria-label="Navegación principal del sistema"
      className="flex space-x-1 sm:space-x-2 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-8 overflow-x-auto shadow-sm"
    >
      {itemsVisibles.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveTab(item.id)}
            aria-current={isActive ? 'page' : undefined}
            className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-sm font-semibold border-b-2 transition-all whitespace-nowrap min-h-[44px] ${
              isActive
                ? 'border-sky-600 dark:border-sky-400 text-sky-700 dark:text-sky-300 bg-sky-50/60 dark:bg-sky-950/30'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <Icon
              className={`w-4 h-4 flex-shrink-0 ${
                isActive ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400 dark:text-slate-500'
              }`}
              aria-hidden="true"
            />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
