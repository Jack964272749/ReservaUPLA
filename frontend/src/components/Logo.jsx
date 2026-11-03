import React from 'react';
import logoUpla from '../assets/logo-upla.png';

// Trazabilidad: Nielsen H4 - Consistencia · Logo oficial institucional UPLA
export default function Logo({ className = 'h-10 min-w-[25px]', alt = 'Logo Universidad Peruana Los Andes' }) {
  return (
    <img
      src={logoUpla}
      alt={alt}
      className={`object-contain ${className}`}
      width="140"
      height="44"
    />
  );
}
