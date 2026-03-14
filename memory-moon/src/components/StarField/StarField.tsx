import React, { useEffect, useRef } from 'react';
import './StarField.css';
import { useStore } from '../../store/useStore';

interface Star {
  x: number;
  y: number;
  r: number;
  opacity: number;
  speed: number;
  phase: number;
}

interface ShootingStar {
  x: number;
  y: number;
  angle: number;
  length: number;
  speed: number;
  life: number;
  maxLife: number;
  active: boolean;
}

const NUM_STARS = 280;
const NUM_SHOOTING = 3;

const StarField: React.FC = () => {
  const { theme } = useStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const starsRef = useRef<Star[]>([]);
  const shootingRef = useRef<ShootingStar[]>([]);
  const timeRef = useRef(0);

  const themeColors = React.useMemo(() => {
    switch (theme) {
      case 'sunset':
        return {
          star: 'rgba(255, 180, 120,',
          glow: 'rgba(255, 140, 80,',
          shooting: 'rgba(255, 200, 150,'
        };
      case 'dawn':
        return {
          star: 'rgba(180, 230, 255,',
          glow: 'rgba(120, 200, 255,',
          shooting: 'rgba(200, 240, 255,'
        };
      default: // night
        return {
          star: 'rgba(255, 230, 180,',
          glow: 'rgba(255, 220, 120,',
          shooting: 'rgba(255, 230, 150,'
        };
    }
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      starsRef.current = Array.from({ length: NUM_STARS }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.2,
        opacity: Math.random() * 0.6 + 0.3,
        speed: Math.random() * 0.02 + 0.005,
        phase: Math.random() * Math.PI * 2,
      }));

      shootingRef.current = Array.from({ length: NUM_SHOOTING }, () =>
        createShootingStar(canvas)
      );
    };

    const createShootingStar = (c: HTMLCanvasElement): ShootingStar => ({
      x: Math.random() * c.width * 0.7,
      y: Math.random() * c.height * 0.4,
      angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
      length: Math.random() * 80 + 60,
      speed: Math.random() * 3 + 2,
      life: 0,
      maxLife: Math.random() * 60 + 40,
      active: Math.random() > 0.7,
    });

    const draw = () => {
      timeRef.current += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw twinkling stars
      starsRef.current.forEach(star => {
        const twinkle = Math.sin(timeRef.current * star.speed * 60 + star.phase) * 0.35 + 0.65;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `${themeColors.star} ${star.opacity * twinkle})`;
        ctx.fill();

        // Occasional tiny glow
        if (star.r > 1.2) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.r * 2.5, 0, Math.PI * 2);
          const grad = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.r * 2.5);
          grad.addColorStop(0, `${themeColors.glow} ${0.12 * twinkle})`);
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.fill();
        }
      });

      // Draw shooting stars
      shootingRef.current.forEach((s, i) => {
        if (!s.active) {
          if (Math.random() < 0.003) { // Slightly increased from original 0.002
            shootingRef.current[i] = { ...createShootingStar(canvas), active: true };
          }
          return;
        }
        s.life++;
        const progress = s.life / s.maxLife;
        const alpha = Math.sin(progress * Math.PI);

        const x2 = s.x + Math.cos(s.angle) * s.length * progress * 4;
        const y2 = s.y + Math.sin(s.angle) * s.length * progress * 4;

        const grad = ctx.createLinearGradient(s.x, s.y, x2, y2);
        grad.addColorStop(0, `${themeColors.shooting} 0)`);
        grad.addColorStop(0.7, `${themeColors.shooting} ${alpha * 0.8})`);
        grad.addColorStop(1, `${themeColors.shooting} ${alpha})`);

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        if (s.life >= s.maxLife) {
          shootingRef.current[i] = { ...createShootingStar(canvas), active: false };
        }
      });

      animRef.current = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [theme, themeColors]);

  return <canvas ref={canvasRef} className={`star-field star-field--${theme}`} />;
};

export default StarField;
