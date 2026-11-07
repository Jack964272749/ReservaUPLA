import React, { useEffect, useRef } from 'react';
import { useAnimacionFondo } from '../hooks/useAnimacionFondo';

// Trazabilidad: Nielsen H8 (Estética y diseño) · ISO 9241-110 · WCAG 2.2.2 (Control de movimiento)
// Simulación de partículas cristalinas con control de accesibilidad, pausa en background y escala eficiente.
export default function LienzoIgloo({ className = '' }) {
  const canvasRef = useRef(null);
  const { animacionActiva } = useAnimacionFondo();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = null;
    let ancho = 0;
    let alto = 0;
    let dpr = 1;

    // WCAG 2.2.2: Verificar preferencia de movimiento reducido del sistema operativo
    const mediaQueryMotion = typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : { matches: false };
    const prefiereReduccion = mediaQueryMotion.matches;

    // Posición del cursor en coordenadas locales del canvas
    const mouse = {
      x: -1000,
      y: -1000,
      radio: 180,
      activo: false,
    };

    let particulas = [];
    const MAX_PARTICULAS = 145;
    const DISTANCIA_CONEXION = 145;

    // Paletas adaptativas según modo claro / oscuro
    const paletaOscura = [
      { r: 56, g: 189, b: 248 },   // Cyan / Sky 400
      { r: 14, g: 165, b: 233 },   // Sky 500
      { r: 255, g: 255, b: 255 },  // Blanco diamante
      { r: 129, g: 140, b: 248 },  // Indigo cristalino
      { r: 165, g: 243, b: 252 },  // Cyan glacial claro
    ];

    const paletaClara = [
      { r: 2, g: 132, b: 199 },   // Sky 600
      { r: 14, g: 165, b: 233 },  // Sky 500
      { r: 3, g: 105, b: 161 },   // Sky 700
      { r: 79, g: 70, b: 229 },   // Indigo 600
      { r: 14, g: 116, b: 144 },  // Cyan 700
    ];

    class Particula {
      constructor(w, h) {
        this.reset(w, h, true);
      }

      reset(w, h, aleatorio = false) {
        this.x = aleatorio ? Math.random() * w : (Math.random() > 0.5 ? 0 : w);
        this.y = aleatorio ? Math.random() * h : Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.65;
        this.vy = (Math.random() - 0.5) * 0.65;
        this.radioBase = Math.random() * 3.2 + 3.0;
        this.radio = this.radioBase;
        this.esEstrella = Math.random() > 0.58;
        this.colorIndex = Math.floor(Math.random() * paletaOscura.length);
        this.alfaBase = Math.random() * 0.40 + 0.55;
        this.alfa = this.alfaBase;
        this.pulso = Math.random() * Math.PI * 2;
        this.velocidadPulso = Math.random() * 0.03 + 0.015;
        this.rotacion = Math.random() * Math.PI;
        this.velocidadRotacion = (Math.random() - 0.5) * 0.025;
      }

      actualizar(w, h) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) { this.x = 0; this.vx *= -1; }
        if (this.x > w) { this.x = w; this.vx *= -1; }
        if (this.y < 0) { this.y = 0; this.vy *= -1; }
        if (this.y > h) { this.y = h; this.vy *= -1; }

        this.pulso += this.velocidadPulso;
        this.alfa = this.alfaBase + Math.sin(this.pulso) * 0.22;
        this.rotacion += this.velocidadRotacion;

        if (mouse.activo) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.hypot(dx, dy);

          if (dist < mouse.radio && dist > 0) {
            const factor = (1 - dist / mouse.radio);
            const fuerza = factor * 3.2;
            const angulo = Math.atan2(dy, dx);
            this.x += Math.cos(angulo) * fuerza;
            this.y += Math.sin(angulo) * fuerza;
            this.radio = this.radioBase * (1 + factor * 0.9);
            this.alfa = Math.min(1, this.alfa + factor * 0.45);
          } else {
            this.radio = this.radioBase;
          }
        } else {
          this.radio = this.radioBase;
        }
      }

      dibujar(context, esOscuro) {
        const paleta = esOscuro ? paletaOscura : paletaClara;
        const { r, g, b } = paleta[this.colorIndex];
        const opacidad = Math.min(1, Math.max(0.28, this.alfa * (esOscuro ? 1 : 0.98)));

        context.save();
        context.translate(this.x, this.y);

        if (this.esEstrella) {
          context.rotate(this.rotacion);
          context.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacidad})`;
          context.shadowColor = `rgba(${r}, ${g}, ${b}, ${esOscuro ? 0.95 : 0.75})`;
          context.shadowBlur = this.radio * (esOscuro ? 5 : 3.5);

          const tam = this.radio * 2.8;
          context.beginPath();
          context.moveTo(0, -tam);
          context.lineTo(tam * 0.28, -tam * 0.28);
          context.lineTo(tam, 0);
          context.lineTo(tam * 0.28, tam * 0.28);
          context.lineTo(0, tam);
          context.lineTo(-tam * 0.28, tam * 0.28);
          context.lineTo(-tam, 0);
          context.lineTo(-tam * 0.28, -tam * 0.28);
          context.closePath();
          context.fill();

          context.beginPath();
          context.arc(0, 0, this.radio * 0.5, 0, Math.PI * 2);
          context.fillStyle = esOscuro ? 'rgba(255, 255, 255, 0.95)' : 'rgba(240, 249, 255, 0.95)';
          context.fill();
        } else {
          context.beginPath();
          context.arc(0, 0, this.radio, 0, Math.PI * 2);
          context.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacidad})`;
          context.shadowColor = `rgba(${r}, ${g}, ${b}, ${esOscuro ? 0.9 : 0.7})`;
          context.shadowBlur = this.radio * (esOscuro ? 4 : 2.5);
          context.fill();

          context.beginPath();
          context.arc(0, 0, this.radio * 0.45, 0, Math.PI * 2);
          context.fillStyle = esOscuro ? 'rgba(255, 255, 255, 0.9)' : 'rgba(224, 242, 254, 0.95)';
          context.fill();
        }

        context.restore();
      }
    }

    const inicializar = (w, h) => {
      if (!w || !h) return;
      // Limitar devicePixelRatio a máximo 2 para optimizar rendimiento GPU/batería
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      ancho = w;
      alto = h;

      canvas.width = Math.floor(ancho * dpr);
      canvas.height = Math.floor(alto * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      particulas = [];
      // Reducir la cantidad de partículas cuando el ancho sea menor a 768px (móviles/tablets)
      const esPantallaPequena = ancho < 768;
      const limite = esPantallaPequena ? 40 : MAX_PARTICULAS;
      const divisor = esPantallaPequena ? 12000 : 5000;
      const cantidad = Math.min(limite, Math.max(esPantallaPequena ? 18 : 45, Math.floor((ancho * alto) / divisor)));

      for (let i = 0; i < cantidad; i++) {
        particulas.push(new Particula(ancho, alto));
      }
    };

    const renderizarCuadro = () => {
      if (ancho <= 0 || alto <= 0) return;
      const esOscuro = document.documentElement.classList.contains('dark');
      ctx.clearRect(0, 0, ancho, alto);

      // Aura interactiva con el cursor
      if (mouse.activo && !prefiereReduccion && animacionActiva) {
        const gradiente = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          mouse.radio * 1.3
        );
        if (esOscuro) {
          gradiente.addColorStop(0, 'rgba(56, 189, 248, 0.32)');
          gradiente.addColorStop(0.35, 'rgba(14, 165, 233, 0.15)');
          gradiente.addColorStop(0.7, 'rgba(2, 132, 199, 0.05)');
          gradiente.addColorStop(1, 'rgba(6, 20, 38, 0)');
        } else {
          gradiente.addColorStop(0, 'rgba(14, 165, 233, 0.28)');
          gradiente.addColorStop(0.35, 'rgba(2, 132, 199, 0.13)');
          gradiente.addColorStop(0.7, 'rgba(3, 105, 161, 0.04)');
          gradiente.addColorStop(1, 'rgba(240, 249, 255, 0)');
        }

        ctx.fillStyle = gradiente;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouse.radio * 1.3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Filamentos cristalinos
      for (let i = 0; i < particulas.length; i++) {
        const p1 = particulas[i];
        for (let j = i + 1; j < particulas.length; j++) {
          const p2 = particulas[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < DISTANCIA_CONEXION) {
            const factor = 1 - dist / DISTANCIA_CONEXION;
            const opacidad = factor * (esOscuro ? 0.44 : 0.38);

            const cercaCursor = mouse.activo &&
              (Math.hypot(p1.x - mouse.x, p1.y - mouse.y) < mouse.radio ||
               Math.hypot(p2.x - mouse.x, p2.y - mouse.y) < mouse.radio);

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            if (esOscuro) {
              ctx.strokeStyle = cercaCursor
                ? `rgba(165, 243, 252, ${Math.min(0.85, opacidad * 2.0)})`
                : `rgba(56, 189, 248, ${opacidad})`;
            } else {
              ctx.strokeStyle = cercaCursor
                ? `rgba(3, 105, 161, ${Math.min(0.80, opacidad * 2.0)})`
                : `rgba(14, 165, 233, ${opacidad})`;
            }
            ctx.lineWidth = cercaCursor ? 1.6 : 1.1;
            ctx.stroke();
          }
        }
      }

      // Dibujar cada cristal
      for (let i = 0; i < particulas.length; i++) {
        if (animacionActiva && !prefiereReduccion) {
          particulas[i].actualizar(ancho, alto);
        }
        particulas[i].dibujar(ctx, esOscuro);
      }
    };

    const animar = () => {
      renderizarCuadro();
      if (animacionActiva && !prefiereReduccion && !document.hidden) {
        animId = requestAnimationFrame(animar);
      }
    };

    const iniciarOParar = () => {
      if (animId) {
        cancelAnimationFrame(animId);
        animId = null;
      }

      if (!animacionActiva || prefiereReduccion) {
        // Dibuja un único cuadro estático si la animación está desactivada o prefers-reduced-motion
        renderizarCuadro();
        return;
      }

      if (!document.hidden) {
        animId = requestAnimationFrame(animar);
      }
    };

    // Usar ResizeObserver para medir tamaño y redibujar
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const cr = entry.contentRect;
        if (cr.width > 0 && cr.height > 0) {
          inicializar(cr.width, cr.height);
          iniciarOParar();
        }
      }
    });

    const rectInicial = canvas.getBoundingClientRect();
    if (rectInicial.width > 0 && rectInicial.height > 0) {
      inicializar(rectInicial.width, rectInicial.height);
      iniciarOParar();
    }
    resizeObserver.observe(canvas);

    // Pausar animación cuando la pestaña o documento esté oculto (visibilitychange)
    const manejarVisibilidad = () => {
      if (document.hidden) {
        if (animId) {
          cancelAnimationFrame(animId);
          animId = null;
        }
      } else {
        iniciarOParar();
      }
    };

    // Detección del cursor
    const manejarMouseMove = (e) => {
      if (!animacionActiva || prefiereReduccion) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x >= -50 && x <= rect.width + 50 && y >= -50 && y <= rect.height + 50) {
        mouse.x = Math.max(0, Math.min(rect.width, x));
        mouse.y = Math.max(0, Math.min(rect.height, y));
        mouse.activo = true;
      } else {
        mouse.activo = false;
      }
    };

    const manejarMouseLeave = () => {
      mouse.activo = false;
    };

    window.addEventListener('mousemove', manejarMouseMove);
    window.addEventListener('blur', manejarMouseLeave);
    document.addEventListener('visibilitychange', manejarVisibilidad);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      window.removeEventListener('mousemove', manejarMouseMove);
      window.removeEventListener('blur', manejarMouseLeave);
      document.removeEventListener('visibilitychange', manejarVisibilidad);
    };
  }, [animacionActiva]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
      className={className}
    />
  );
}
