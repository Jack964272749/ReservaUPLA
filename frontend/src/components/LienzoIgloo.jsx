import React, { useEffect, useRef } from 'react';
import { useAnimacionFondo } from '../hooks/useAnimacionFondo';

// Trazabilidad: Inspirado en estética de igloo.inc (cristales de hielo, filamentos glaciares, aura etérea)
// Optimizado para consumo mínimo de CPU y GPU: sin shadowBlur costoso, renderizado por lotes y física fluida.
// Cumple con WCAG 2.2.2 (Control de movimiento) y compatibilidad móvil/batería.
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

    // WCAG 2.2.2: Verificar preferencia de movimiento reducido
    const mediaQueryMotion =
      typeof window !== 'undefined'
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : { matches: false };
    const prefiereReduccion = mediaQueryMotion.matches;

    // Interpolación suave del cursor (física inercial estilo igloo.inc)
    const targetMouse = { x: -1000, y: -1000, activo: false };
    const mouse = { x: -1000, y: -1000, radio: 190, activo: false };

    let cristales = [];
    let motasHielo = [];

    // Paletas glaciares (Cyan ártico, blanco diamante, índigo escarcha)
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
        // Movimiento flotante y suave (baja velocidad para serenidad y rendimiento)
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.tamBase = Math.random() * 3.5 + 2.5;
        this.tam = this.tamBase;
        this.esRombo = Math.random() > 0.40;
        this.colorIdx = Math.floor(Math.random() * coloresOscuro.length);
        this.alfaBase = Math.random() * 0.35 + 0.45;
        this.alfa = this.alfaBase;
        this.angulo = Math.random() * Math.PI * 2;
        this.velRotacion = (Math.random() - 0.5) * 0.015;
        this.fasePulso = Math.random() * Math.PI * 2;
        this.velPulso = Math.random() * 0.02 + 0.01;
        // Efecto pseudo-3D de volteo cristalino
        this.factorVolteo = 1;
        this.faseVolteo = Math.random() * Math.PI * 2;
        this.velVolteo = Math.random() * 0.018 + 0.008;
      }

      actualizar(w, h) {
        this.x += this.vx;
        this.y += this.vy;

        // Rebote suave en los bordes
        if (this.x < 0) { this.x = 0; this.vx *= -1; }
        if (this.x > w) { this.x = w; this.vx *= -1; }
        if (this.y < 0) { this.y = 0; this.vy *= -1; }
        if (this.y > h) { this.y = h; this.vy *= -1; }

        this.angulo += this.velRotacion;
        this.fasePulso += this.velPulso;
        this.alfa = this.alfaBase + Math.sin(this.fasePulso) * 0.18;

        this.faseVolteo += this.velVolteo;
        this.factorVolteo = Math.cos(this.faseVolteo);

        // Interacción fluida con el cursor (repulsión magnética ligera)
        if (mouse.activo) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const distSq = dx * dx + dy * dy;
          const radioSq = mouse.radio * mouse.radio;

          if (distSq < radioSq && distSq > 0) {
            const dist = Math.sqrt(distSq);
            const factor = 1 - dist / mouse.radio;
            const fuerza = factor * 2.2;
            this.x += (dx / dist) * fuerza;
            this.y += (dy / dist) * fuerza;
            this.tam = this.tamBase * (1 + factor * 0.7);
            this.alfa = Math.min(1, this.alfa + factor * 0.35);
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
        const a = Math.max(0.15, Math.min(1, this.alfa));

        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.angulo);
        // Escala X simula rotación tridimensional del cristal
        context.scale(Math.abs(this.factorVolteo) * 0.7 + 0.3, 1);

        if (this.esRombo) {
          // Cristal en forma de romboide / shard ártico
          const t = this.tam * 2.4;
          // Halo exterior sutil sin usar shadowBlur costoso
          context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a * 0.22})`;
          context.beginPath();
          context.moveTo(0, -t * 1.5);
          context.lineTo(t, 0);
          context.lineTo(0, t * 1.5);
          context.lineTo(-t, 0);
          context.closePath();
          context.fill();

          // Núcleo cristalino denso
          context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
          context.beginPath();
          context.moveTo(0, -t);
          context.lineTo(t * 0.65, 0);
          context.lineTo(0, t);
          context.lineTo(-t * 0.65, 0);
          context.closePath();
          context.fill();

          // Destello central blanco escarcha
          context.fillStyle = esOscuro ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.95)';
          context.beginPath();
          context.arc(0, 0, this.tam * 0.35, 0, Math.PI * 2);
          context.fill();
        } else {
          // Partícula nodal circular con doble anillo
          context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a * 0.25})`;
          context.beginPath();
          context.arc(0, 0, this.tam * 1.8, 0, Math.PI * 2);
          context.fill();

          context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
          context.beginPath();
          context.arc(0, 0, this.tam, 0, Math.PI * 2);
          context.fill();

          context.fillStyle = esOscuro ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.95)';
          context.beginPath();
          context.arc(0, 0, this.tam * 0.4, 0, Math.PI * 2);
          context.fill();
        }

        context.restore();
      }
    }

    class MotaHielo {
      constructor(w, h) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.radio = Math.random() * 1.2 + 0.6;
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = -Math.random() * 0.25 - 0.05; // Leve flotación ascendente
        this.alfa = Math.random() * 0.4 + 0.15;
      }

      actualizar(w, h) {
        this.x += this.vx;
        this.y += this.vy;
        if (this.y < 0) this.y = h;
        if (this.x < 0) this.x = w;
        if (this.x > w) this.x = 0;
      }

      dibujar(context, esOscuro) {
        context.fillStyle = esOscuro
          ? `rgba(224, 242, 254, ${this.alfa})`
          : `rgba(2, 132, 199, ${this.alfa * 0.7})`;
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
      // Densidad controlada: 40 en desktop, 20 en móvil (rendimiento óptimo O(N^2))
      const maxCristales = esPantallaPequena ? 20 : 42;
      const divisor = esPantallaPequena ? 16000 : 9000;
      const cantCristales = Math.min(maxCristales, Math.max(esPantallaPequena ? 14 : 26, Math.floor((ancho * alto) / divisor)));

      cristales = [];
      for (let i = 0; i < cantCristales; i++) {
        cristales.push(new Cristal(ancho, alto));
      }

      const cantMotas = esPantallaPequena ? 15 : 35;
      motasHielo = [];
      for (let i = 0; i < cantMotas; i++) {
        motasHielo.push(new MotaHielo(ancho, alto));
      }
    };

    const renderizarCuadro = () => {
      if (ancho <= 0 || alto <= 0) return;
      const esOscuro = document.documentElement.classList.contains('dark');
      ctx.clearRect(0, 0, ancho, alto);

      // Suavizar la posición del cursor (física inercial)
      if (targetMouse.activo) {
        mouse.x += (targetMouse.x - mouse.x) * 0.12;
        mouse.y += (targetMouse.y - mouse.y) * 0.12;
        mouse.activo = true;
      } else {
        mouse.activo = false;
      }

      // Aura glacial etérea alrededor del cursor (estilo igloo.inc)
      if (mouse.activo && !prefiereReduccion && animacionActiva) {
        const aura = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          mouse.radio * 1.4
        );
        if (esOscuro) {
          aura.addColorStop(0, 'rgba(56, 189, 248, 0.22)');
          aura.addColorStop(0.35, 'rgba(129, 140, 248, 0.10)');
          aura.addColorStop(0.7, 'rgba(14, 165, 233, 0.03)');
          aura.addColorStop(1, 'rgba(2, 6, 23, 0)');
        } else {
          aura.addColorStop(0, 'rgba(14, 165, 233, 0.18)');
          aura.addColorStop(0.35, 'rgba(79, 70, 229, 0.08)');
          aura.addColorStop(0.7, 'rgba(2, 132, 199, 0.02)');
          aura.addColorStop(1, 'rgba(255, 255, 255, 0)');
        }

        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouse.radio * 1.4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Dibujar motas de escarcha sutiles
      for (let i = 0; i < motasHielo.length; i++) {
        if (animacionActiva && !prefiereReduccion) {
          motasHielo[i].actualizar(ancho, alto);
        }
        motasHielo[i].dibujar(ctx, esOscuro);
      }

      // Conexiones de filamentos cristalinos (renderizado optimizado por lotes)
      const distConexion = ancho < 768 ? 120 : 155;
      const distConexionSq = distConexion * distConexion;

      ctx.save();
      // Dibujar filamentos estándar en un solo trazo para minimizar cambios de contexto
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
        ? 'rgba(56, 189, 248, 0.22)'
        : 'rgba(14, 165, 233, 0.20)';
      ctx.lineWidth = 1.0;
      ctx.stroke();

      // Si el cursor está activo, resaltar filamentos cercanos con brillo glacial
      if (mouse.activo && !prefiereReduccion) {
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
          ? 'rgba(165, 243, 252, 0.65)'
          : 'rgba(2, 132, 199, 0.55)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      ctx.restore();

      // Dibujar cada cristal de hielo
      for (let i = 0; i < cristales.length; i++) {
        if (animacionActiva && !prefiereReduccion) {
          cristales[i].actualizar(ancho, alto);
        }
        cristales[i].dibujar(ctx, esOscuro);
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
        renderizarCuadro();
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
      if (!animacionActiva || prefiereReduccion) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x >= -60 && x <= rect.width + 60 && y >= -60 && y <= rect.height + 60) {
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
