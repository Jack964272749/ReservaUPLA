import React from 'react';

export default function CardIndicador({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'blue', // blue, green, amber, red, purple
}) {
  const styles = {
    blue: {
      border: 'border-sky-100 hover:border-sky-300',
      bg: 'bg-white',
      iconBg: 'bg-sky-50 text-sky-600',
      valueColor: 'text-sky-950',
    },
    green: {
      border: 'border-emerald-100 hover:border-emerald-300',
      bg: 'bg-white',
      iconBg: 'bg-emerald-50 text-emerald-600',
      valueColor: 'text-emerald-950',
    },
    amber: {
      border: 'border-amber-100 hover:border-amber-300',
      bg: 'bg-white',
      iconBg: 'bg-amber-50 text-amber-600',
      valueColor: 'text-amber-950',
    },
    red: {
      border: 'border-rose-100 hover:border-rose-300',
      bg: 'bg-white',
      iconBg: 'bg-rose-50 text-rose-600',
      valueColor: 'text-rose-950',
    },
    purple: {
      border: 'border-indigo-100 hover:border-indigo-300',
      bg: 'bg-white',
      iconBg: 'bg-indigo-50 text-indigo-600',
      valueColor: 'text-indigo-950',
    },
  }[variant];

  return (
    <div
      className={`p-5 rounded-xl border ${styles.border} ${styles.bg} shadow-sm transition-all hover:shadow-md flex items-center justify-between gap-4`}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">{title}</p>
        <h3 className={`text-2xl font-bold ${styles.valueColor}`}>{value}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {Icon && (
        <div className={`p-3.5 rounded-xl ${styles.iconBg} flex-shrink-0 shadow-sm`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
}
