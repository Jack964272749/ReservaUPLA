import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  CalendarPlus,
  DoorOpen,
  Users,
} from 'lucide-react';

export default function Navigation({ activeTab, setActiveTab }) {
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'reservas', label: 'Reservas', icon: CalendarDays },
    { id: 'nueva-reserva', label: 'Nueva Reserva', icon: CalendarPlus },
    { id: 'ambientes', label: 'Ambientes', icon: DoorOpen },
    { id: 'usuarios', label: 'Usuarios', icon: Users },
  ];

  return (
    <nav className="flex space-x-1 sm:space-x-2 border-b border-slate-200 bg-white px-4 sm:px-8 overflow-x-auto shadow-sm">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              isActive
                ? 'border-sky-600 text-sky-700 bg-sky-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
