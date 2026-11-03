import React from 'react';
import logoUpla from '../assets/logo-upla.svg';

// Trazabilidad: Nielsen H4 - Consistencia · Recurso único reemplazable con ancho mínimo >= 25px
export default function Logo({ className = 'h-10 min-w-[25px]', alt = 'Logo Universidad Peruana Los Andes' }) {
  return (
    <img
      src={logoUpla}
      alt={alt}
      className={`object-contain ${className}`}
      width="120"
      height="40"
    />
  );
}
