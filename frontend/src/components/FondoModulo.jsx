import React from 'react';

// Trazabilidad: Nielsen H8 (Estética y diseño minimalista) · WCAG 2.1 AA (Contraste de color >= 4.5:1)
export default function FondoModulo({
  imagen,
  children,
  className = '',
  overlayClassName = '',
}) {
  return (
    <div
      className={`relative overflow-hidden bg-[#EDF3F9] dark:bg-slate-950 transition-colors ${className}`}
    >
      {/* Capa de imagen con difuminado suave (blur) y scale para evitar bordes duros */}
      {imagen && (
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 pointer-events-none bg-cover bg-center scale-105 blur-[3px]"
          style={{ backgroundImage: `url("${imagen}")` }}
        />
      )}

      {/* Capa de contraste difuminada: degradado oscuro en modo oscuro y claro en modo claro */}
      {imagen && (
        <div
          aria-hidden="true"
          className={`absolute inset-0 z-0 pointer-events-none transition-colors ${
            overlayClassName ||
            'bg-slate-50/85 dark:bg-slate-950/85 bg-gradient-to-b from-slate-50/90 via-slate-50/80 to-sky-100/70 dark:from-slate-950/90 dark:via-slate-950/85 dark:to-slate-950/90'
          }`}
        />
      )}

      {/* Contenido en primer plano con interactividad y legibilidad */}
      {children}
    </div>
  );
}
