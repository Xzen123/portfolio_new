import { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    // Simulate send (replace with actual API call)
    await new Promise((r) => setTimeout(r, 1200));
    setStatus('sent');
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setStatus('idle'), 4000);
  };

  const inputStyle = {
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid var(--color-border)',
    color: 'var(--color-primary)',
    fontFamily: "'Roboto Mono', monospace",
    fontSize: 13,
    padding: '8px 0',
    flex: 1,
    outline: 'none',
    caretColor: 'var(--color-primary)',
    transition: 'border-color 0.2s',
  };

  return (
    <section id="contact" style={{ padding: '80px 24px', maxWidth: 720, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40 }}>
        <span style={{ fontFamily: "'Roboto Mono', monospace", color: 'var(--color-secondary)', fontWeight: 700, fontSize: 18 }}>$</span>
        <h2 style={{ fontFamily: "'Roboto Mono', monospace", color: 'var(--color-primary)', fontSize: 20, fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.1em', textShadow: '0 0 15px var(--color-glow)', margin: 0 }}>./contact.sh</h2>
      </div>

      <div style={{
        background: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        padding: 32,
        boxShadow: '0 0 30px var(--color-glow)',
      }}>
        {status === 'sent' ? (
          <div style={{
            fontFamily: "'Roboto Mono', monospace",
            color: 'var(--color-primary)',
            fontSize: 14,
            textAlign: 'center',
            padding: '40px 0',
            textShadow: '0 0 15px var(--color-glow)',
          }}>
            <div style={{ fontSize: 24, marginBottom: 12 }}>✓</div>
            <div>PACKET_SENT successfully</div>
            <div style={{ color: 'var(--color-text-dim)', fontSize: 12, marginTop: 8 }}>I'll respond within 24 hours.</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {[
              { label: 'ID_NAME:', key: 'name', type: 'text', placeholder: 'Type name...' },
              { label: 'ID_EMAIL:', key: 'email', type: 'email', placeholder: 'Type email...' },
            ].map((field) => (
              <div key={field.key} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, fontFamily: "'Roboto Mono', monospace" }}>
                <span style={{ color: 'var(--color-secondary)', fontSize: 13, flexShrink: 0 }}>{field.label}</span>
                <input
                  type={field.type}
                  value={form[field.key]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  required
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderBottomColor = 'var(--color-primary)'; }}
                  onBlur={e => { e.target.style.borderBottomColor = 'var(--color-border)'; }}
                />
              </div>
            ))}

            <div style={{ marginBottom: 28 }}>
              <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 12, color: 'var(--color-secondary)', marginBottom: 8, letterSpacing: '0.1em' }}>MESSAGE_BODY:</div>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Write transmission..."
                required
                rows={5}
                style={{
                  ...inputStyle,
                  display: 'block',
                  width: '100%',
                  resize: 'vertical',
                  borderBottom: 'none',
                  border: '1px solid var(--color-border)',
                  padding: '12px',
                  boxSizing: 'border-box',
                }}
                onFocus={e => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.boxShadow = '0 0 10px var(--color-glow)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--color-border)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 10, color: 'var(--color-text-dim)', display: 'flex', gap: 6, alignItems: 'center' }}>
                <span>🔒</span> ENCRYPTED_LINK_ACTIVE
              </div>
              <button
                type="submit"
                disabled={status === 'sending'}
                style={{
                  fontFamily: "'Roboto Mono', monospace",
                  background: status === 'sending' ? 'var(--color-text-dim)' : 'var(--color-primary)',
                  color: 'var(--color-bg)',
                  border: 'none',
                  padding: '12px 28px',
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                  boxShadow: '0 0 20px var(--color-glow)',
                  transition: 'all 0.2s ease',
                }}
              >
                {status === 'sending' ? 'SENDING...' : 'SEND_PACKET'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Social Links */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 32 }}>
        {[
          { label: '[ GITHUB ]', href: 'https://github.com/Xzen123' },
          { label: '[ LINKEDIN ]', href: 'https://linkedin.com/in/alok-kumar-chaudhary' },
          { label: '[ EMAIL ]', href: 'mailto:alok@nitpatna.ac.in' },
        ].map((link) => (
          <a key={link.label} href={link.href} style={{
            fontFamily: "'Roboto Mono', monospace",
            fontSize: 12,
            color: 'var(--color-primary)',
            textDecoration: 'none',
            letterSpacing: '0.05em',
            transition: 'all 0.2s ease',
          }}
            onMouseEnter={e => { e.target.style.textShadow = '0 0 12px var(--color-glow)'; }}
            onMouseLeave={e => { e.target.style.textShadow = 'none'; }}
          >{link.label}</a>
        ))}
      </div>
    </section>
  );
}
