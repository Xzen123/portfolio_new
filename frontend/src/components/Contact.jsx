import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { API_ENDPOINTS } from '../config/api';

const CONTACT_LINKS = [
  { label: 'GITHUB', href: 'https://github.com/Xzen123' },
  { label: 'LINKEDIN', href: 'https://www.linkedin.com/in/alok-kumar-9958b1266/' },
  { label: 'PHONE', href: 'tel:9508397337' },
  { label: 'WHATSAPP', href: 'https://wa.me/919508397337' },
  { label: 'EMAIL', href: 'mailto:alokcse03@gmail.com' },
];

export default function Contact() {
  const { currentTheme } = useTheme();
  const isLiquidGlass = currentTheme?.name === 'liquidglass';

  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const onChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch(API_ENDPOINTS.contact, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send message.');
      }

      setStatus('sent');
      setForm({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 3500);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Failed to send message.');
    }
  };

  const inputStyle = {
    width: '100%',
    border: `1px solid ${isLiquidGlass ? 'rgba(223, 246, 255, 0.34)' : 'var(--color-border)'}`,
    background: isLiquidGlass
      ? 'linear-gradient(155deg, rgba(255, 255, 255, 0.2) 0%, rgba(203, 226, 255, 0.08) 100%)'
      : 'var(--color-surface)',
    color: 'var(--color-text)',
    fontFamily: "'Roboto Mono', monospace",
    fontSize: 12,
    padding: '11px 12px',
    borderRadius: isLiquidGlass ? 10 : 0,
    outline: 'none',
    boxShadow: isLiquidGlass ? 'inset 0 1px 0 rgba(255,255,255,0.28)' : 'none',
  };

  return (
    <section id="contact" style={{ padding: '80px 24px', maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <span style={{ fontFamily: "'Roboto Mono', monospace", color: 'var(--color-secondary)', fontWeight: 700, fontSize: 18 }}>$</span>
        <h2 style={{
          fontFamily: "'Roboto Mono', monospace",
          color: 'var(--color-primary)',
          fontSize: 20,
          fontWeight: 400,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          textShadow: isLiquidGlass ? 'none' : '0 0 15px var(--color-glow)',
          margin: 0,
        }}>
          ./contact
        </h2>
      </div>

      <p style={{
        fontFamily: "'Roboto Mono', monospace",
        color: 'var(--color-text-dim)',
        fontSize: 12,
        marginBottom: 28,
        lineHeight: 1.7,
      }}>
        Send a message and I will respond by email.
      </p>

      <div style={{
        background: isLiquidGlass
          ? 'linear-gradient(155deg, rgba(255,255,255,0.2) 0%, rgba(204,226,255,0.09) 40%, rgba(162,188,233,0.08) 100%)'
          : 'var(--color-card)',
        border: `1px solid ${isLiquidGlass ? 'rgba(223, 246, 255, 0.36)' : 'var(--color-border)'}`,
        borderRadius: isLiquidGlass ? 16 : 0,
        boxShadow: isLiquidGlass
          ? '0 20px 44px rgba(2, 12, 30, 0.42), inset 0 1px 0 rgba(255,255,255,0.32), inset 0 -1px 0 rgba(164,188,236,0.24)'
          : '0 0 24px var(--color-glow)',
        backdropFilter: isLiquidGlass ? 'blur(26px) saturate(185%)' : 'none',
        WebkitBackdropFilter: isLiquidGlass ? 'blur(26px) saturate(185%)' : 'none',
        padding: 22,
      }}>
        {status === 'sent' ? (
          <div style={{
            fontFamily: "'Roboto Mono', monospace",
            color: 'var(--color-primary)',
            textAlign: 'center',
            padding: '40px 16px',
            lineHeight: 1.8,
          }}>
            <div style={{ fontSize: 24, marginBottom: 10 }}>✓</div>
            <div>MESSAGE SENT</div>
            <div style={{ color: 'var(--color-text-dim)', fontSize: 11 }}>Thanks for reaching out.</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 12, marginBottom: 12 }}>
              <input
                aria-label="Your name"
                placeholder="Your name"
                required
                value={form.name}
                onChange={onChange('name')}
                style={inputStyle}
              />
              <input
                aria-label="Your email"
                placeholder="your@email.com"
                type="email"
                required
                value={form.email}
                onChange={onChange('email')}
                style={inputStyle}
              />
            </div>

            <textarea
              aria-label="Your message"
              placeholder="Write your message..."
              required
              rows={6}
              value={form.message}
              onChange={onChange('message')}
              style={{ ...inputStyle, resize: 'vertical', marginBottom: 12 }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 11, color: 'var(--color-text-dim)' }}>
                Endpoint: {API_ENDPOINTS.contact}
              </div>
              <button
                type="submit"
                disabled={status === 'sending'}
                style={{
                  fontFamily: "'Roboto Mono', monospace",
                  background: 'var(--color-primary)',
                  color: 'var(--color-bg)',
                  border: '1px solid var(--color-primary)',
                  borderRadius: isLiquidGlass ? 10 : 0,
                  boxShadow: isLiquidGlass
                    ? '0 10px 24px rgba(3, 12, 28, 0.34), inset 0 1px 0 rgba(255,255,255,0.42)'
                    : 'none',
                  padding: '10px 18px',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                  opacity: status === 'sending' ? 0.7 : 1,
                }}
              >
                {status === 'sending' ? 'SENDING...' : 'SEND MESSAGE'}
              </button>
            </div>

            {status === 'error' && (
              <div style={{
                marginTop: 12,
                fontFamily: "'Roboto Mono', monospace",
                fontSize: 11,
                color: 'var(--color-secondary)',
              }}>
                ERROR: {errorMsg}
              </div>
            )}
          </form>
        )}
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 20 }}>
        {CONTACT_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith('http') ? '_blank' : undefined}
            rel={link.href.startsWith('http') ? 'noreferrer noopener' : undefined}
            style={{
              fontFamily: "'Roboto Mono', monospace",
              fontSize: 11,
              color: 'var(--color-primary)',
              textDecoration: 'none',
              border: '1px solid var(--color-border)',
              background: isLiquidGlass
                ? 'linear-gradient(155deg, rgba(255,255,255,0.18), rgba(190,216,255,0.08))'
                : 'var(--color-card)',
              borderRadius: isLiquidGlass ? 999 : 0,
              padding: '7px 11px',
              letterSpacing: '0.06em',
            }}
          >
            {link.label}
          </a>
        ))}
      </div>
    </section>
  );
}
