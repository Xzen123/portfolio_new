import { useMemo } from 'react';

const S = {
  section: {
    padding: '80px 24px',
    maxWidth: 1200,
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 40,
  },
  prompt: {
    fontFamily: "'Roboto Mono', monospace",
    color: 'var(--color-secondary)',
    fontWeight: 700,
    fontSize: 18,
  },
  title: {
    fontFamily: "'Roboto Mono', monospace",
    color: 'var(--color-primary)',
    fontSize: 20,
    fontWeight: 400,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    textShadow: '0 0 15px var(--color-glow)',
    margin: 0,
  },
};

const PROFILE_STATS = {
  repos: '20+',
  stars: '10+',
  forks: '5+',
};

export default function About() {
  const stats = useMemo(() => [
    { label: 'REPOS_SHIPPED', value: PROFILE_STATS.repos },
    { label: 'GITHUB_STARS', value: PROFILE_STATS.stars },
    { label: 'COMMUNITY_FORKS', value: PROFILE_STATS.forks },
    { label: 'COFFEE_CONSUMED', value: '∞' },
  ], []);

  return (
    <section id="about" style={S.section}>
      <div style={S.header}>
        <span style={S.prompt}>$</span>
        <h2 style={S.title}>whoami</h2>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 32,
        alignItems: 'center',
      }}>
        {/* Bio Terminal */}
        <div style={{
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          padding: 28,
          boxShadow: '0 0 20px var(--color-glow)',
        }}>
          <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 13, lineHeight: 1.8 }}>
            <div><span style={{ color: 'var(--color-secondary)' }}>alok@nitp:~$</span><span style={{ color: 'var(--color-text-dim)' }}> cat biography.txt</span></div>
            <br />
            <p style={{ color: 'var(--color-text)', margin: 0 }}>
              I am <span style={{ color: 'var(--color-primary)' }}>Alok Kumar Chaudhary</span>, a CSE
              undergrad at <span style={{ color: 'var(--color-secondary)' }}>NIT Patna</span> — an institute
              of national importance under MHRDGovt of India. I have a passion for building
              robust full‑stack applications and tackling complex engineering problems.
            </p>
            <br />
            <p style={{ color: 'var(--color-text)', margin: 0 }}>
              From vanilla JavaScript tools to TypeScript + React apps, I love shipping
              real solutions — whether it's a smart <span style={{ color: 'var(--color-primary)' }}>attendance
              calculator</span>, a campus navigation system, or a citizen science platform.
            </p>
            <br />
            <div style={{ color: 'var(--color-text-dim)', fontSize: 12 }}>
              <div><span style={{ color: 'var(--color-primary)' }}>{'>'}</span> Name: Alok Kumar Chaudhary</div>
              <div><span style={{ color: 'var(--color-primary)' }}>{'>'}</span> Alias: Xzen123</div>
              <div><span style={{ color: 'var(--color-primary)' }}>{'>'}</span> Institute: NIT Patna (CSE Undergrad)</div>
              <div><span style={{ color: 'var(--color-primary)' }}>{'>'}</span> Location: Patna, Bihar, India</div>
              <div><span style={{ color: 'var(--color-primary)' }}>{'>'}</span> Status: <span style={{ color: 'var(--color-secondary)' }}>Open to Opportunities ●</span></div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {stats.map((s) => (
            <div key={s.label} style={{
              background: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              padding: '20px',
              textAlign: 'center',
              transition: 'all 0.2s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.boxShadow = '0 0 20px var(--color-glow)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{
                fontFamily: "'Roboto Mono', monospace",
                fontSize: 32,
                fontWeight: 700,
                color: 'var(--color-primary)',
                textShadow: '0 0 20px var(--color-glow)',
                lineHeight: 1,
                marginBottom: 8,
              }}>{s.value}</div>
              <div style={{
                fontFamily: "'Roboto Mono', monospace",
                fontSize: 10,
                color: 'var(--color-text-dim)',
                letterSpacing: '0.1em',
              }}>{s.label}</div>
            </div>
          ))}

          <div style={{
            gridColumn: '1 / -1',
            marginTop: 6,
            textAlign: 'center',
            fontFamily: "'Roboto Mono', monospace",
            fontSize: 10,
            color: 'var(--color-text-dim)',
            letterSpacing: '0.08em',
          }}>
            PROFILE SNAPSHOT: MANUALLY CURATED
          </div>
        </div>
      </div>
    </section>
  );
}
