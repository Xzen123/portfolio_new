import { useEffect, useRef } from 'react';
import { useWindow } from '../context/WindowContext';
import { useTheme } from '../context/ThemeContext';
import './MinimizedScreen.css';

// Matrix Rain Canvas
function MatrixRain({ color }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cols = Math.floor(canvas.width / 16);
    const drops = Array(cols).fill(1);
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ0123456789ABCDEF<>{}[]$#@!%^&*';

    const draw = () => {
      ctx.fillStyle = 'rgba(0,0,0,0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color || '#00FF41';
      ctx.font = '14px monospace';

      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * 16, y * 16);
        if (y * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
    };

    const interval = setInterval(draw, 50);
    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);
    return () => { clearInterval(interval); window.removeEventListener('resize', onResize); };
  }, [color]);

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
}

export default function MinimizedScreen() {
  const { restore } = useWindow();
  const { currentTheme, currentThemeName } = useTheme();
  const isMinimal = currentTheme?.minimal;
  const primary = currentTheme?.colors?.primary || '#00FF41';

  return (
    <div className="minimized-screen">
      {/* Wallpaper */}
      {!isMinimal ? (
        <MatrixRain color={primary} />
      ) : (
        <div className="minimal-wallpaper" />
      )}

      {/* Overlay */}
      <div className="minimized-overlay">
        {/* Clock */}
        <Clock primary={primary} />

        {/* Status */}
        <div className="minimized-status" style={{ color: primary }}>
          <span className="status-dot" style={{ background: primary }} />
          SYSTEM STANDBY — PORTFOLIO MINIMIZED
        </div>
      </div>

      {/* Dock */}
      <div className="dock">
        <button
          className="dock-icon"
          onClick={restore}
          title="Open Portfolio"
          style={{ borderColor: primary, boxShadow: `0 0 20px ${primary}40` }}
        >
          <span className="dock-icon-symbol" style={{ color: primary }}>◈</span>
          <span className="dock-icon-label" style={{ color: primary }}>portfolio</span>
          <div className="dock-bounce" />
        </button>
      </div>
    </div>
  );
}

function Clock({ primary }) {
  const ref = useRef(null);
  useEffect(() => {
    const update = () => {
      if (ref.current) {
        const now = new Date();
        ref.current.textContent = now.toLocaleTimeString('en-US', { hour12: false });
      }
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="minimized-clock" style={{ color: primary, textShadow: `0 0 30px ${primary}` }}>
      <div ref={ref} />
      <div className="minimized-date" style={{ color: `${primary}99` }}>
        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </div>
    </div>
  );
}
