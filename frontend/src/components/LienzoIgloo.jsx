import React, { useEffect, useRef } from 'react';
import { useAnimacionFondo } from '../hooks/useAnimacionFondo';

// Trazabilidad: Inspirado en estética de igloo.inc (cristales de hielo, filamentos glaciares, aura etérea)
// Optimizado para consumo mínimo de CPU y GPU: sin shadowBlur costoso, renderizado por lotes y física fluida.
// Cumple con WCAG 2.2.2 (Control de movimiento) adaptando la velocidad ante prefers-reduced-motion sin congelar la experiencia.
export default function LienzoIgloo({ className = '' }) {
  const canvasRef = useRef(null);
  const { animacionActiva } = useAnimacionFondo();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId = null;
    let ancho = 0;
    let alto = 0;
    let dpr = 1;

    // WCAG 2.2.2: Detección de preferencia de movimiento reducido (atenúa velocidad en lugar de congelar)
    const mediaQueryMotion =
      typeof window !== 'undefined'
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : { matches: false };
    let prefiereReduccion = mediaQueryMotion.matches;

    // Interpolación suave del cursor (física inercial fluida estilo igloo.inc)
    const targetMouse = { x: -1000, y: -1000, activo: false };
    const mouse = { x: -1000, y: -1000, radio: 220, activo: false };

    let cristales = [];
    let motasHielo = [];

    // Paletas glaciares árticas (Cyan luminoso, blanco diamante, índigo escarcha)
    const coloresOscuro = [
      { r: 56, g: 189, b: 248 },  // Sky 400
      { r: 125, g: 211, b: 252 }, // Sky 300
      { r: 240, g: 249, b: 255 }, // Escarcha diamante
      { r: 165, g: 243, b: 252 }, // Cyan 200
      { r: 129, g: 140, b: 248 }, // Índigo glacial
    ];

    const coloresClaro = [
      { r: 2, g: 132, b: 199 },   // Sky 600
      { r: 14, g: 165, b: 233 },  // Sky 500
      { r: 3, g: 105, b: 161 },   // Sky 700
      { r: 79, g: 70, b: 229 },   // Indigo 600
      { r: 12, g: 74, b: 110 },   // Cyan profundo
    ];

    class Cristal {
      constructor(w, h) {
        this.reset(w, h, true);
      }

      reset(w, h, aleatorio = false) {
        this.x = aleatorio ? Math.random() * w : Math.random() * w;
        this.y = aleatorio ? Math.random() * h : (Math.random() > 0.5 ? 0 : h);
        // Velocidad perceptible y orgánica para flotación serena
        this.vx = (Math.random() - 0.5) * 0.85;
        this.vy = (Math.random() - 0.5) * 0.85;
        this.tamBase = Math.random() * 3.6 + 2.8;
        this.tam = this.tamBase;
        this.esRombo = Math.random() > 0.35;
        this.colorIdx = Math.floor(Math.random() * coloresOscuro.length);
        this.alfaBase = Math.random() * 0.35 + 0.50;
        this.alfa = this.alfaBase;
        this.angulo = Math.random() * Math.PI * 2;
        this.velRotacion = (Math.random() - 0.5) * 0.02;
        this.fase = Math.random() * Math.PI * 2;
        this.velPulso = Math.random() * 0.025 + 0.012;
        // Efecto pseudo-3D de rotación cristalina
        this.factorVolteo = 1;
        this.faseVolteo = Math.random() * Math.PI * 2;
        this.velVolteo = Math.random() * 0.02 + 0.01;
      }

      actualizar(w, h, tiempo, factorVel) {
        // Ondulación senoidal orgánica
        const ondaX = Math.sin(tiempo * 0.0015 + this.fase) * 0.5;
        const ondaY = Math.cos(tiempo * 0.0012 + this.fase) * 0.5;

        this.x += (this.vx + ondaX) * factorVel;
        this.y += (this.vy + ondaY) * factorVel;

        // Rebote elástico en los límites
        if (this.x < 0) { this.x = 0; this.vx = Math.abs(this.vx); }
        if (this.x > w) { this.x = w; this.vx = -Math.abs(this.vx); }
        if (this.y < 0) { this.y = 0; this.vy = Math.abs(this.vy); }
        if (this.y > h) { this.y = h; this.vy = -Math.abs(this.vy); }

        this.angulo += this.velRotacion * factorVel;
        this.alfa = this.alfaBase + Math.sin(tiempo * 0.002 + this.fase) * 0.20;

        this.faseVolteo += this.velVolteo * factorVel;
        this.factorVolteo = Math.cos(this.faseVolteo);

        // Interacción magnética con el cursor
        if (mouse.activo) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const distSq = dx * dx + dy * dy;
          const radioSq = mouse.radio * mouse.radio;

          if (distSq < radioSq && distSq > 0) {
            const dist = Math.sqrt(distSq);
            const factor = 1 - dist / mouse.radio;
            const fuerza = factor * 2.8 * factorVel;
            this.x += (dx / dist) * fuerza;
            this.y += (dy / dist) * fuerza;
            this.tam = this.tamBase * (1 + factor * 0.8);
            this.alfa = Math.min(1, this.alfa + factor * 0.40);
          } else {
            this.tam = this.tamBase;
          }
        } else {
          this.tam = this.tamBase;
        }
      }

      dibujar(context, esOscuro) {
        const paleta = esOscuro ? coloresOscuro : coloresClaro;
        const { r, g, b } = paleta[this.colorIdx];
        const a = Math.max(0.18, Math.min(1, this.alfa));

        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.angulo);
        // Volteo en eje X simula rotación tridimensional del cristal
        context.scale(Math.abs(this.factorVolteo) * 0.75 + 0.25, 1);

        if (this.esRombo) {
          // Cristal facetado estilo igloo.inc
          const t = this.tam * 2.5;

          // Halo exterior cristalino
          context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a * 0.25})`;
          context.beginPath();
          context.moveTo(0, -t * 1.6);
          context.lineTo(t * 1.1, 0);
          context.lineTo(0, t * 1.6);
          context.lineTo(-t * 1.1, 0);
          context.closePath();
          context.fill();

          // Núcleo denso
          context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
          context.beginPath();
          context.moveTo(0, -t);
          context.lineTo(t * 0.7, 0);
          context.lineTo(0, t);
          context.lineTo(-t * 0.7, 0);
          context.closePath();
          context.fill();

          // Destello central escarcha
          context.fillStyle = esOscuro ? 'rgba(255, 255, 255, 0.92)' : 'rgba(255, 255, 255, 0.95)';
          context.beginPath();
          context.arc(0, 0, this.tam * 0.38, 0, Math.PI * 2);
          context.fill();
        } else {
          // Partícula nodal con doble anillo ártico
          context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a * 0.28})`;
          context.beginPath();
          context.arc(0, 0, this.tam * 2.0, 0, Math.PI * 2);
          context.fill();

          context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
          context.beginPath();
          context.arc(0, 0, this.tam, 0, Math.PI * 2);
          context.fill();

          context.fillStyle = esOscuro ? 'rgba(255, 255, 255, 0.92)' : 'rgba(255, 255, 255, 0.95)';
          context.beginPath();
          context.arc(0, 0, this.tam * 0.45, 0, Math.PI * 2);
          context.fill();
        }

        context.restore();
      }
    }

    class MotaHielo {
      constructor(w, h) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.radio = Math.random() * 1.3 + 0.6;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = -Math.random() * 0.40 - 0.10; // Flotación ascendente continua
        this.alfaBase = Math.random() * 0.45 + 0.20;
        this.fase = Math.random() * Math.PI * 2;
      }

      actualizar(w, h, tiempo, factorVel) {
        this.x += this.vx * factorVel;
        this.y += this.vy * factorVel;
        if (this.y < 0) this.y = h;
        if (this.x < 0) this.x = w;
        if (this.x > w) this.x = 0;
        this.alfa = this.alfaBase + Math.sin(tiempo * 0.003 + this.fase) * 0.15;
      }

      dibujar(context, esOscuro) {
        context.fillStyle = esOscuro
          ? `rgba(224, 242, 254, ${Math.max(0.1, this.alfa)})`
          : `rgba(2, 132, 199, ${Math.max(0.1, this.alfa * 0.75)})`;
        context.beginPath();
        context.arc(this.x, this.y, this.radio, 0, Math.PI * 2);
        context.fill();
      }
    }

    const inicializar = (w, h) => {
      if (!w || !h) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      ancho = w;
      alto = h;

      canvas.width = Math.floor(ancho * dpr);
      canvas.height = Math.floor(alto * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const esPantallaPequena = ancho < 768;
      // Cantidad balanceada para mantener 60 FPS estables con mínimo consumo
      const maxCristales = esPantallaPequena ? 22 : 46;
      const divisor = esPantallaPequena ? 14000 : 8500;
      const cantCristales = Math.min(
        maxCristales,
        Math.max(esPantallaPequena ? 16 : 28, Math.floor((ancho * alto) / divisor))
      );

      cristales = [];
      for (let i = 0; i < cantCristales; i++) {
        cristales.push(new Cristal(ancho, alto));
      }

      const cantMotas = esPantallaPequena ? 18 : 38;
      motasHielo = [];
      for (let i = 0; i < cantMotas; i++) {
        motasHielo.push(new MotaHielo(ancho, alto));
      }
    };

    const renderizarCuadro = (tiempo) => {
      if (ancho <= 0 || alto <= 0) return;
      const esOscuro = document.documentElement.classList.contains('dark');
      ctx.clearRect(0, 0, ancho, alto);

      // Factor de velocidad: atenuado suave si el sistema pide reduced motion
      const factorVel = prefiereReduccion ? 0.38 : 1.0;

      // Inercia suave del cursor
      if (targetMouse.activo) {
        mouse.x += (targetMouse.x - mouse.x) * 0.12;
        mouse.y += (targetMouse.y - mouse.y) * 0.12;
        mouse.activo = true;
      } else {
        mouse.activo = false;
      }

      // Aura glacial etérea alrededor del cursor (estilo igloo.inc)
      if (mouse.activo && animacionActiva) {
        const aura = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          mouse.radio * 1.5
        );
        if (esOscuro) {
          aura.addColorStop(0, 'rgba(56, 189, 248, 0.25)');
          aura.addColorStop(0.35, 'rgba(129, 140, 248, 0.12)');
          aura.addColorStop(0.7, 'rgba(14, 165, 233, 0.04)');
          aura.addColorStop(1, 'rgba(2, 6, 23, 0)');
        } else {
          aura.addColorStop(0, 'rgba(14, 165, 233, 0.20)');
          aura.addColorStop(0.35, 'rgba(79, 70, 229, 0.09)');
          aura.addColorStop(0.7, 'rgba(2, 132, 199, 0.03)');
          aura.addColorStop(1, 'rgba(255, 255, 255, 0)');
        }

        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouse.radio * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Dibujar motas de nieve ascendentes
      for (let i = 0; i < motasHielo.length; i++) {
        if (animacionActiva) {
          motasHielo[i].actualizar(ancho, alto, tiempo, factorVel);
        }
        motasHielo[i].dibujar(ctx, esOscuro);
      }

      // Conexiones de filamentos cristalinos
      const distConexion = ancho < 768 ? 125 : 160;
      const distConexionSq = distConexion * distConexion;

      ctx.save();
      // Filamentos estándar por lotes
      ctx.beginPath();
      for (let i = 0; i < cristales.length; i++) {
        const c1 = cristales[i];
        for (let j = i + 1; j < cristales.length; j++) {
          const c2 = cristales[j];
          const dx = c1.x - c2.x;
          const dy = c1.y - c2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < distConexionSq) {
            ctx.moveTo(c1.x, c1.y);
            ctx.lineTo(c2.x, c2.y);
          }
        }
      }
      ctx.strokeStyle = esOscuro
        ? 'rgba(56, 189, 248, 0.24)'
        : 'rgba(14, 165, 233, 0.22)';
      ctx.lineWidth = 1.0;
      ctx.stroke();

      // Iluminación intensa en filamentos cercanos al cursor
      if (mouse.activo) {
        ctx.beginPath();
        for (let i = 0; i < cristales.length; i++) {
          const c1 = cristales[i];
          const dCursor1Sq = (c1.x - mouse.x) ** 2 + (c1.y - mouse.y) ** 2;
          if (dCursor1Sq < mouse.radio ** 2) {
            for (let j = i + 1; j < cristales.length; j++) {
              const c2 = cristales[j];
              const dx = c1.x - c2.x;
              const dy = c1.y - c2.y;
              if (dx * dx + dy * dy < distConexionSq) {
                ctx.moveTo(c1.x, c1.y);
                ctx.lineTo(c2.x, c2.y);
              }
            }
          }
        }
        ctx.strokeStyle = esOscuro
          ? 'rgba(165, 243, 252, 0.70)'
          : 'rgba(2, 132, 199, 0.60)';
        ctx.lineWidth = 1.6;
        ctx.stroke();
      }
      ctx.restore();

      // Dibujar cada cristal
      for (let i = 0; i < cristales.length; i++) {
        if (animacionActiva) {
          cristales[i].actualizar(ancho, alto, tiempo, factorVel);
        }
        cristales[i].dibujar(ctx, esOscuro);
      }
    };

    const animar = (tiempo) => {
      renderizarCuadro(tiempo || performance.now());
      if (animacionActiva && !document.hidden) {
        animId = requestAnimationFrame(animar);
      }
    };

    const iniciarOParar = () => {
      if (animId) {
        cancelAnimationFrame(animId);
        animId = null;
      }

      if (!animacionActiva) {
        renderizarCuadro(performance.now());
        return;
      }

      if (!document.hidden) {
        animId = requestAnimationFrame(animar);
      }
    };

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

    const manejarMouseMove = (e) => {
      if (!animacionActiva) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Detectar movimiento en todo el viewport o ventana
      if (x >= -120 && x <= rect.width + 120 && y >= -120 && y <= rect.height + 120) {
        targetMouse.x = Math.max(0, Math.min(rect.width, x));
        targetMouse.y = Math.max(0, Math.min(rect.height, y));
        targetMouse.activo = true;
      } else {
        targetMouse.activo = false;
      }
    };

    const manejarMouseLeave = () => {
      targetMouse.activo = false;
    };

    window.addEventListener('mousemove', manejarMouseMove, { passive: true });
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
