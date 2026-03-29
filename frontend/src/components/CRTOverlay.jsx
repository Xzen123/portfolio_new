import { useWindow } from '../context/WindowContext';
import { useTheme } from '../context/ThemeContext';
import './CRTOverlay.css';

export default function CRTOverlay() {
  const { crtEnabled } = useWindow();
  const { currentTheme } = useTheme();

  // Auto-disable CRT for minimal theme
  const showCRT = crtEnabled && !currentTheme?.minimal;

  if (!showCRT) return null;

  return (
    <>
      <div className="crt-static" aria-hidden="true" />
      <div className="crt-scanline" aria-hidden="true" />
    </>
  );
}
