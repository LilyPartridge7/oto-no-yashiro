import React, { useEffect, useRef } from 'react';
import { MoodDef } from '../data/moods';

interface ParticleLayerProps {
  mood: MoodDef;
  reducedMotion: boolean;
  windForce: number; // -1 to 1 based on mouse movement
}

interface Leaf {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotSpeed: number;
  color: string;
  opacity: number;
}

interface MistParticle {
  x: number;
  y: number;
  radius: number;
  speedX: number;
  opacity: number;
}

interface Ember {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  speedX: number;
  alpha: number;
}

export const ParticleLayer: React.FC<ParticleLayerProps> = ({ mood, reducedMotion, windForce }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Create Leaf Particles
    const leafColors = ['#991b1b', '#b91c1c', '#c2410c', '#d97706', '#7c2d12'];
    const leafCount = reducedMotion ? 4 : 22;
    const leaves: Leaf[] = Array.from({ length: leafCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 8 + Math.random() * 10,
      speedY: 0.6 + Math.random() * 1.2,
      speedX: -0.5 + Math.random() * 1.0,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (-0.02 + Math.random() * 0.04),
      color: leafColors[Math.floor(Math.random() * leafColors.length)],
      opacity: 0.6 + Math.random() * 0.4,
    }));

    // Create Mist Particles
    const mistCount = reducedMotion ? 2 : Math.floor(12 * mood.mistDensity);
    const mistParticles: MistParticle[] = Array.from({ length: mistCount }, () => ({
      x: Math.random() * width,
      y: height * 0.4 + Math.random() * (height * 0.5),
      radius: 120 + Math.random() * 180,
      speedX: 0.2 + Math.random() * 0.4,
      opacity: 0.05 + Math.random() * 0.12,
    }));

    // Create Lantern Ember Motes
    const emberCount = reducedMotion ? 0 : Math.floor(25 * mood.lanternIntensity);
    const embers: Ember[] = Array.from({ length: emberCount }, () => ({
      x: Math.random() * width,
      y: height * 0.4 + Math.random() * (height * 0.5),
      radius: 1 + Math.random() * 2.5,
      speedY: -0.3 - Math.random() * 0.5,
      speedX: (Math.random() - 0.5) * 0.4,
      alpha: 0.3 + Math.random() * 0.7,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render Mist
      mistParticles.forEach(m => {
        if (!reducedMotion) {
          m.x += m.speedX + windForce * 2;
          if (m.x - m.radius > width) m.x = -m.radius;
        }

        const grad = ctx.createRadialGradient(m.x, m.y, 10, m.x, m.y, m.radius);
        grad.addColorStop(0, mood.mistColor);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Render Embers
      embers.forEach(e => {
        if (!reducedMotion) {
          e.y += e.speedY;
          e.x += e.speedX + windForce * 0.5;
          if (e.y < height * 0.3) {
            e.y = height * 0.85;
            e.x = Math.random() * width;
          }
        }

        ctx.fillStyle = `rgba(251, 191, 36, ${e.alpha})`;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Render Japanese Momiji Leaves
      leaves.forEach(l => {
        if (!reducedMotion) {
          l.y += l.speedY;
          l.x += l.speedX + windForce * 3;
          l.rotation += l.rotSpeed;

          if (l.y > height + 20) {
            l.y = -20;
            l.x = Math.random() * width;
          }
          if (l.x > width + 20) l.x = -20;
          if (l.x < -20) l.x = width + 20;
        }

        ctx.save();
        ctx.translate(l.x, l.y);
        ctx.rotate(l.rotation);
        ctx.fillStyle = l.color;
        ctx.globalAlpha = l.opacity;

        // Draw 5-pointed maple leaf shape silhouette
        ctx.beginPath();
        const s = l.size;
        ctx.moveTo(0, -s);
        ctx.lineTo(s * 0.3, -s * 0.4);
        ctx.lineTo(s * 0.8, -s * 0.7);
        ctx.lineTo(s * 0.5, -s * 0.1);
        ctx.lineTo(s * 0.9, s * 0.3);
        ctx.lineTo(s * 0.3, s * 0.2);
        ctx.lineTo(0, s * 0.7);
        ctx.lineTo(-s * 0.3, s * 0.2);
        ctx.lineTo(-s * 0.9, s * 0.3);
        ctx.lineTo(-s * 0.5, -s * 0.1);
        ctx.lineTo(-s * 0.8, -s * 0.7);
        ctx.lineTo(-s * 0.3, -s * 0.4);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [mood, reducedMotion, windForce]);

  return <canvas ref={canvasRef} class="absolute inset-0 pointer-events-none z-10" />;
};
