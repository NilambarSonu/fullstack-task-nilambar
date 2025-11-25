"use client";
import { useEffect, useRef } from 'react';

const ParticleCanvas = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationFrameRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 1; 
        this.vy = (Math.random() - 0.5) * 1;
        this.size = Math.random() * 2 + 1; 
        this.opacity = Math.random() * 0.5 + 0.3; 
        this.hue = Math.random() * 60 + 280; 
        this.baseSize = this.size;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x <= 0 || this.x >= canvas.width) {
          this.vx *= -1;
          this.x = Math.max(0, Math.min(canvas.width, this.x));
        }
        if (this.y <= 0 || this.y >= canvas.height) {
          this.vy *= -1;
          this.y = Math.max(0, Math.min(canvas.height, this.y));
        }

        const parallaxOffset = window.pageYOffset * 0.5;
        this.displayY = this.y + parallaxOffset;

        const time = Date.now() * 0.001;
        this.size = this.baseSize * (1 + Math.sin(time + this.x * 0.01) * 0.1);
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = `hsl(${this.hue}, 100%, 60%)`;
        ctx.beginPath();
        ctx.arc(this.x, this.displayY || this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const initParticles = () => {
      particlesRef.current = Array.from({ length: 80 }, () => new Particle());
    };

    const drawConnections = () => {
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p1 = particlesRef.current[i];
          const p2 = particlesRef.current[j];

          const dx = p1.x - p2.x;
          const dy = (p1.displayY || p1.y) - (p2.displayY || p2.y);
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            const opacity = 0.15 * (1 - distance / 120);
            ctx.save();
            ctx.globalAlpha = opacity;
            ctx.strokeStyle = `hsl(${p1.hue}, 100%, 60%)`;
            ctx.lineWidth = 0.5;

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.displayY || p1.y);
            ctx.lineTo(p2.x, p2.displayY || p2.y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    };
    const animate = () => {
      ctx.fillStyle = 'rgba(10, 8, 15, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach(particle => {
        particle.update();
        particle.draw();
      });

      drawConnections();

      animationFrameRef.current = requestAnimationFrame(animate);
    };
    initParticles();
    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(10, 8, 15, 0.1) 50%, rgba(10, 8, 15, 0.3) 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
    </>
  );
};

export default ParticleCanvas;