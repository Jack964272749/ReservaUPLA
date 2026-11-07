import React, { useEffect, useRef } from 'react';

// Trazabilidad: Nielsen H8 (Estética y diseño) · ISO 9241-110 · Experiencia interactiva inspirada en igloo.inc
// Simulación de partículas cristalinas y filamentos luminosos en Canvas 2D a 60 FPS con física reactiva al cursor.
export default function LienzoIgloo({ className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Detectar si el usuario prefiere movimiento reducido (accesibilidad)
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    let animId;
    let ancho = 0;
    let alto = 0;
    let dpr = 1;

    // Posición del mouse en coordenadas locales
    const mouse = {
      x: -1000,
      y: -1000,
      radio: 140,
      activo: false,
    };

    // Colección de partículas
    let particulas = [];
    const MAX_PARTICULAS = 75;
    const DISTANCIA_CONEXION = 110;

    const paleta = [
      { r: 56, g: 189, b: 248 },  // Sky 400 (celeste hielo)
      { r: 14, g: 165, b: 233 },  // Sky 500 (azul institucional UPLA)
      { r: 255, g: 255, b: 255 }, // Blanco escarcha
      { r: 99, g: 102, b: 241 },  // Indigo cristalino
    ];

    class Particula {
      constructor(w, h) {
        this.reset(w, h, true);
      }

      reset(w, h, aleatorio = false) {
        this.x = aleatorio ? Math.random() * w : (Math.random() > 0.5 ? 0 : w);
        this.y = aleatorio ? Math.random() * h : Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.radioBase = Math.random() * 2 + 1;
        this.radio = this.radioBase;
        this.color = paleta[Math.floor(Math.random() * paleta.length)];
        this.alfaBase = Math.random() * 0.5 + 0.35;
        this.alfa = this.alfaBase;
        this.pulso = Math.random() * Math.PI * 2;
        this.velocidadPulso = Math.random() * 0.02 + 0.01;
      }

      actualizar(w, h) {
        // Movimiento ambiental
        this.x += this.vx;
        this.y += this.vy;

        // Rebote en bordes suaves
        if (this.x < 0 || this.x > w) this.vx *= -1;
        if (this.y < 0 || this.y > h) this.vy *= -1;

        // Pulso suave de brillo
        this.pulso += this.velocidadPulso;
        this.alfa = this.alfaBase + Math.sin(this.pulso) * 0.15;

        // Física interactiva tipo igloo.inc al acercar el cursor
        if (mouse.activo) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.hypot(dx, dy);

          if (dist < mouse.radio && dist > 0) {
            const fuerza = (1 - dist / mouse.radio) * 2.2;
            const angulo = Math.atan2(dy, dx);
            this.x += Math.cos(angulo) * fuerza;
            this.y += Math.sin(angulo) * fuerza;
            this.radio = this.radioBase * (1 + fuerza * 0.5);
          } else {
            this.radio = this.radioBase;
          }
        } else {
          this.radio = this.radioBase;
        }
      }

      dibujar(context) {
        const { r, g, b } = this.color;
        context.beginPath();
        context.arc(this.x, this.y, this.radio, 0, Math.PI * 2);
        context.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.max(0.1, this.alfa)})`;
        context.shadowColor = `rgba(${r}, ${g}, ${b}, 0.8)`;
        context.shadowBlur = this.radio * 3;
        context.fill();
        context.shadowBlur = 0;
      }
    }

    const inicializar = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = window.devicePixelRatio || 1;
      ancho = rect.width;
      alto = rect.height;

      canvas.width = Math.floor(ancho * dpr);
      canvas.height = Math.floor(alto * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      particulas = [];
      const cantidad = Math.min(MAX_PARTICULAS, Math.floor((ancho * alto) / 9000));
      for (let i = 0; i < cantidad; i++) {
        particulas.push(new Particula(ancho, alto));
      }
    };

    const animar = () => {
      ctx.clearRect(0, 0, ancho, alto);

      // Efecto de aura de luz difusa donde está el cursor (estilo igloo iceberg glow)
      if (mouse.activo) {
        const resplandor = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          mouse.radio * 1.3
        );
        resplandor.addColorStop(0, 'rgba(56, 189, 248, 0.12)');
        resplandor.addColorStop(0.5, 'rgba(14, 165, 233, 0.05)');
        resplandor.addColorStop(1, 'rgba(6, 20, 38, 0)');

        ctx.fillStyle = resplandor;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouse.radio * 1.3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Dibujar filamentos cristalinos entre partículas cercanas
      for (let i = 0; i < particulas.length; i++) {
        const p1 = particulas[i];
        for (let j = i + 1; j < particulas.length; j++) {
          const p2 = particulas[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < DISTANCIA_CONEXION) {
            const opacidad = (1 - dist / DISTANCIA_CONEXION) * 0.28;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${opacidad})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Actualizar y dibujar cada cristal
      for (let i = 0; i < particulas.length; i++) {
        particulas[i].actualizar(ancho, alto);
        particulas[i].dibujar(ctx);
      }

      animId = requestAnimationFrame(animar);
    };

    inicializar();
    animId = requestAnimationFrame(animar);

    // Eventos de mouse interactivo (escuchados sobre el contenedor o ventana)
    const manejarMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        mouse.x = x;
        mouse.y = y;
        mouse.activo = true;
      } else {
        mouse.activo = false;
      }
    };

    const manejarMouseLeave = () => {
      mouse.activo = false;
    };

    const manejarResize = () => {
      inicializar();
    };

    window.addEventListener('mousemove', manejarMouseMove);
    window.addEventListener('resize', manejarResize);
    canvas.addEventListener('mouseleave', manejarMouseLeave);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', manejarMouseMove);
      window.removeEventListener('resize', manejarResize);
      canvas.removeEventListener('mouseleave', manejarMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`w-full h-full pointer-events-none ${className}`}
    />
  );
}
