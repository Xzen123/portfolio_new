import { useState, useEffect, useRef } from 'react';
import './LoadingScreen.css';

const BOOT_LINES = [
  { text: 'ALOK_PORTFOLIO_OS v3.0.0-MERN', delay: 0, color: 'primary', big: true },
  { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', delay: 300, color: 'dim' },
  { text: '> Initializing kernel...', delay: 500, suffix: ' [ OK ]', color: 'normal' },
  { text: '> Loading React modules...', delay: 750, suffix: ' [ OK ]', color: 'normal' },
  { text: '> Mounting theme engine...', delay: 1000, suffix: ' [ OK ]', color: 'normal' },
  { text: '> Connecting to MongoDB...', delay: 1250, suffix: ' [ SKIP — using localStorage ]', color: 'dim' },
  { text: '> Starting CRT renderer...', delay: 1500, suffix: ' [ OK ]', color: 'normal' },
  { text: '> Bootstrapping portfolio...', delay: 1750, suffix: ' [ OK ]', color: 'normal' },
];

export default function LoadingScreen({ onComplete }) {
  const [visibleLines, setVisibleLines] = useState([]);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [fading, setFading] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    // Show each line with delay
    BOOT_LINES.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, line]);
        setProgress(Math.round(((i + 1) / BOOT_LINES.length) * 100));
      }, line.delay);
    });

    // Show "SYSTEM READY" and start fade
    setTimeout(() => setDone(true), 2100);
    setTimeout(() => setFading(true), 2500);
    setTimeout(() => onCompleteRef.current(), 3000);
  }, []);

  return (
    <div className={`loading-screen ${fading ? 'fade-out' : ''}`}>
      <div className="loading-content">
        {/* ASCII Logo */}
        <pre className="loading-ascii">
{`  █████╗ ██╗      ██████╗ ██╗  ██╗
 ██╔══██╗██║     ██╔═══██╗██║ ██╔╝
 ███████║██║     ██║   ██║█████╔╝ 
 ██╔══██║██║     ██║   ██║██╔═██╗ 
 ██║  ██║███████╗╚██████╔╝██║  ██╗
 ╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝`}
        </pre>

        {/* Terminal lines */}
        <div className="loading-terminal">
          {visibleLines.map((line, i) => (
            <div key={i} className={`loading-line ${line.big ? 'big' : ''} line-${line.color}`}>
              {line.text}
              {line.suffix && <span className="loading-suffix">{line.suffix}</span>}
            </div>
          ))}
          {done && (
            <div className="loading-ready">
              <span>▶ SYSTEM READY — LAUNCHING PORTFOLIO</span>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="loading-progress-wrap">
          <div className="loading-progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <div className="loading-progress-label">
          {'█'.repeat(Math.round(progress / 5))}{'░'.repeat(20 - Math.round(progress / 5))} {progress}%
        </div>
      </div>
    </div>
  );
}
