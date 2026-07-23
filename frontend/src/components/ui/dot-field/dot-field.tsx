import { useEffect, useRef } from 'react';

export interface DotFieldProps {
  dotRadius?: number;
  dotSpacing?: number;
  gradientFrom?: string;
  gradientTo?: string;
  className?: string;
}

/** A lightweight static canvas dot field used as a non-interactive background layer. */
export function DotField({
  dotRadius = 1,
  dotSpacing = 11,
  gradientFrom = 'rgba(0, 47, 178, 1)',
  gradientTo = 'rgba(242, 0, 255, 0.25)',
  className,
}: DotFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const draw = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);
      
      const gradient = context.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, gradientFrom);
      gradient.addColorStop(1, gradientTo);
      context.fillStyle = gradient;

      // Draw all dots in a single path for maximum performance
      context.beginPath();
      for (let y = dotSpacing / 2; y < height; y += dotSpacing) {
        for (let x = dotSpacing / 2; x < width; x += dotSpacing) {
          context.moveTo(x, y);
          context.arc(x, y, dotRadius, 0, Math.PI * 2);
        }
      }
      context.fill();
    };

    draw();
    window.addEventListener('resize', draw);
    
    return () => {
      window.removeEventListener('resize', draw);
    };
  }, [dotRadius, dotSpacing, gradientFrom, gradientTo]);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
