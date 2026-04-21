'use client';

import { useEffect, useRef, useState } from 'react';

const badgeContent: Record<string, { color: string; items: string[] }> = {
  eng: {
    color: 'var(--green)',
    items: [
      'React · Next.js 14 (App Router) · TypeScript',
      'System architecture, API design & backend integration',
      'Tailwind CSS · shadcn-ui · performance optimisation',
      'CI/CD pipelines, Vercel deployments, database schema design',
      'Real-time data systems & state machine design',
    ],
  },
  gtm: {
    color: 'var(--violet)',
    items: [
      'Full GTM strategy ownership from 0→1 across 3 startups',
      'Grew Sova to 2,000+ organic users via brand-led content',
      'Drove 3x online presence growth at ProductFlo as COO',
      'Investor narrative, fundraising communication & pitch decks',
      'Community building, social strategy & user acquisition',
    ],
  },
  ai: {
    color: 'var(--violet)',
    items: [
      'Built miniCMO — AI agent generating full GTM strategies in 60s',
      'LLM-powered content pipelines replacing full marketing functions',
      'AI encouragement & mood-aware logic in 75Kind wellness app',
      'Prompt engineering for specificity, consistency & brand voice',
      'AI workflows deployed across multiple production startups',
    ],
  },
};

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const typewriterRef = useRef<HTMLSpanElement>(null);
  const [activeBadge, setActiveBadge] = useState<string | null>(null);

  function toggleBadgePanel(key: string) {
    setActiveBadge((prev) => (prev === key ? null : key));
  }

  // Typewriter
  useEffect(() => {
    const words = ['startups', 'products', 'growth engines', 'full-stack MVPs', 'AI workflows', 'experiences'];
    let wi = 0, ci = 0, deleting = false;
    const tw = typewriterRef.current;
    if (!tw) return;
    let timeoutId: ReturnType<typeof setTimeout>;

    function typeStep() {
      const word = words[wi];
      if (!deleting) {
        ci++;
        tw!.textContent = word.slice(0, ci);
        if (ci === word.length) { deleting = true; timeoutId = setTimeout(typeStep, 1800); return; }
      } else {
        ci--;
        tw!.textContent = word.slice(0, ci);
        if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
      }
      timeoutId = setTimeout(typeStep, deleting ? 55 : 95);
    }
    typeStep();
    return () => clearTimeout(timeoutId);
  }, []);

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    type Particle = { x: number; y: number; vx: number; vy: number; r: number };
    let particles: Particle[] = [];
    let W = 0, H = 0;
    let animId: number;
    const mouse = { x: -999, y: -999 };

    function resize() {
      W = canvas!.width = canvas!.offsetWidth;
      H = canvas!.height = canvas!.offsetHeight;
    }
    resize();

    function initParticles() {
      particles = [];
      const n = Math.floor((W * H) / 12000);
      for (let i = 0; i < n; i++) {
        particles.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 1.5 + 0.5,
        });
      }
    }
    initParticles();

    function draw() {
      ctx!.clearRect(0, 0, W, H);
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) { p.x += dx / dist * 1.5; p.y += dy / dist * 1.5; }
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = 'rgba(0,232,150,0.6)';
        ctx!.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx!.beginPath();
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.strokeStyle = `rgba(0,232,150,${0.12 * (1 - d / 120)})`;
            ctx!.lineWidth = 0.5;
            ctx!.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    }
    draw();

    const onMove = (e: MouseEvent) => {
      const r = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    };
    const onLeave = () => { mouse.x = -999; mouse.y = -999; };
    const onResize = () => { resize(); initParticles(); };

    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // Scroll reveal + skill bars + stat counters
  useEffect(() => {
    function animateStat(el: Element) {
      const target = parseInt((el as HTMLElement).dataset.target ?? '0');
      const suffix = (el as HTMLElement).dataset.suffix ?? '';
      const dur = 1400;
      const start = performance.now();
      function step(now: number) {
        const t = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(ease * target) + suffix;
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('visible');
        const num = e.target.querySelector('.stat-num[data-target]');
        if (num) animateStat(num);
        e.target.querySelectorAll('.skill-bar-item').forEach((bar) => {
          const fill = bar.querySelector('.skill-bar-fill') as HTMLElement | null;
          if (fill) fill.style.width = (bar as HTMLElement).dataset.pct + '%';
        });
        io.unobserve(e.target);
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

    const skillIo = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const fill = e.target.querySelector('.skill-bar-fill') as HTMLElement | null;
        if (fill) setTimeout(() => { fill.style.width = (e.target as HTMLElement).dataset.pct + '%'; }, 150);
        skillIo.unobserve(e.target);
      });
    }, { threshold: 0.2 });
    document.querySelectorAll('.skill-bar-item[data-pct]').forEach((el) => skillIo.observe(el));

    return () => { io.disconnect(); skillIo.disconnect(); };
  }, []);

  return (
    <>
      {/* NAV */}
      <nav>
        <span className="nav-logo">RS</span>
        <div className="nav-links" style={{ display: 'flex', gap: '24px' }}>
          <a href="#about">About</a>
          <a href="#experience">Work</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#testimonials">Recognition</a>
        </div>
        <a href="#contact" className="nav-cta">Let&apos;s Talk</a>
      </nav>

      {/* HERO */}
      <section id="hero">
        <canvas ref={canvasRef} id="particle-canvas" />
        <div className="glow-orb orb-green" />
        <div className="glow-orb orb-violet" />

        <div className="hero-badge">
          <span className="badge-dot" />
          Available for new opportunities
        </div>

        <h1 className="hero-name">Raywa Singh</h1>

        <div className="hero-typewriter-wrap">
          <span className="typewriter-prefix">I build &amp; grow</span>
          <span className="typewriter-word" ref={typewriterRef}>startups</span>
        </div>

        <p className="hero-tagline">
          <strong>Most engineers can&apos;t do growth. Most marketers can&apos;t ship.</strong><br />
          I do both - at founder speed. CTO · Full-Stack Engineer · GTM Lead · AI GTM Engineer.
        </p>

        <div className="hero-ctas">
          <a href="#experience" className="btn-primary">See My Work</a>
          <a href="#contact" className="btn-secondary">Get In Touch →</a>
        </div>

        <div className="hero-scroll">
          <div className="scroll-line" />
          scroll
        </div>
      </section>

      {/* STATS BAR */}
      <div id="stats">
        <div className="stats-grid">
          <div className="stat-item reveal">
            <div className="stat-num" data-target="3">0</div>
            <div className="stat-label">Startups from 0→1</div>
          </div>
          <div className="stat-item reveal" style={{ transitionDelay: '0.1s' }}>
            <div className="stat-num" data-target="3" data-suffix="x">0x</div>
            <div className="stat-label">Platform growth driven as COO</div>
          </div>
          <div className="stat-item reveal" style={{ transitionDelay: '0.2s' }}>
            <div className="stat-num" data-target="5" data-suffix="+">0+</div>
            <div className="stat-label">LinkedIn recommendations</div>
          </div>
          <div className="stat-item reveal" style={{ transitionDelay: '0.3s' }}>
            <div className="stat-num" data-target="2" data-suffix=" yrs">0 yrs</div>
            <div className="stat-label">Founding-level experience</div>
          </div>
        </div>
      </div>

      {/* ABOUT */}
      <section id="about">
        <div className="container">
          <div className="about-grid">
            <div className="about-text reveal">
              <div className="section-label">// about</div>
              <h2 className="section-title">
                The rare hybrid<br />
                <span style={{ background: 'linear-gradient(135deg,var(--green),var(--violet))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  engineer &amp; operator.
                </span>
              </h2>
              <p>I&apos;m Raywa - CTO at <strong>Teaqlo</strong>, building a prediction market for pop culture from 0→1. I architect the full stack, design the systems, and run AI-powered GTM workflows to bring it to users.</p>
              <p>Before this, I was <strong>CMO and full-stack dev at Sova Dating</strong> (the first therapist-designed relational intelligence app), and <strong>COO and full-stack dev at ProductFlo</strong> - where I built the platform from scratch and tripled the company&apos;s growth trajectory.</p>
              <p>What I&apos;m best at: <strong>0→1 execution</strong> where engineering, product, and growth collide. Architecting MVPs that don&apos;t need to be rebuilt six months later. Building AI-powered GTM systems that replace entire functions.</p>
              <p style={{ color: 'var(--green)', fontStyle: 'italic', fontWeight: 500 }}>I don&apos;t need playbooks to start - I write the playbooks.</p>
            </div>

            <div className="about-card reveal" style={{ transitionDelay: '0.15s' }}>
              <div className="dual-badge">
                <span className="badge badge-green" style={{ cursor: 'pointer' }} onClick={() => toggleBadgePanel('eng')}>⌨ Engineer</span>
                <span className="badge badge-violet" style={{ cursor: 'pointer' }} onClick={() => toggleBadgePanel('gtm')}>📈 GTM Lead</span>
                <span className="badge badge-violet" style={{ cursor: 'pointer' }} onClick={() => toggleBadgePanel('ai')}>🤖 AI GTM Engineer</span>
              </div>

              {activeBadge && badgeContent[activeBadge] && (
                <div style={{
                  marginBottom: '20px', padding: '16px', borderRadius: '12px',
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid ${activeBadge === 'eng' ? 'rgba(0,232,150,0.25)' : 'rgba(168,85,247,0.25)'}`,
                }}>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {badgeContent[activeBadge].items.map((item, i) => (
                      <li key={i} style={{ display: 'flex', gap: '10px', fontSize: '13px', color: 'var(--muted)' }}>
                        <span style={{ color: badgeContent[activeBadge].color, flexShrink: 0 }}>▸</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <ul className="skill-list">
                <li className="skill-item"><span>React · Next.js · TypeScript</span></li>
                <li className="skill-item"><span>System Architecture &amp; APIs</span></li>
                <li className="skill-item"><span>AI-Powered GTM Workflows &amp; Automation</span></li>
                <li className="skill-item"><span>LLM pipelines for content &amp; distribution</span></li>
                <li className="skill-item"><span>Demand gen, SEO &amp; social growth loops</span></li>
                <li className="skill-item"><span>Brand Strategy &amp; User Acquisition</span></li>
                <li className="skill-item"><span>0→1 Product Execution</span></li>
                <li className="skill-item"><span>Fundraising &amp; Investor Narratives</span></li>
                <li className="skill-item"><span>Cross-functional Team Leadership</span></li>
                <li className="skill-item"><span>Performance &amp; UX Optimization</span></li>
              </ul>

              <div style={{ marginTop: '28px', paddingTop: '28px', borderTop: '1px solid var(--border)' }}>
                <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '10px', fontFamily: 'var(--font-mono)' }}>// stack</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--green)', lineHeight: '1.8' }}>
                  React · Next.js · TypeScript<br />
                  Tailwind CSS · Node.js · REST APIs<br />
                  AI/LLM tooling · GTM systems
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience">
        <div className="container">
          <div className="reveal">
            <div className="section-label">// experience</div>
            <h2 className="section-title">Where I&apos;ve built.</h2>
            <p className="section-sub">Three founding-level roles. Each one shipping production code and driving growth simultaneously.</p>
          </div>

          <div className="exp-grid">
            <div className="exp-card reveal" style={{ transitionDelay: '0.1s' }}>
              <div>
                <div className="exp-company">TEAQLO · 2026 – PRESENT</div>
                <div className="exp-title">CTO / Founding Engineer</div>
                <div className="exp-desc">
                  Building a prediction market for pop culture from the ground up as sole founding engineer. Full ownership across the entire stack.
                  <ul style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '0', listStyle: 'none' }}>
                    <li style={{ display: 'flex', gap: '10px' }}><span style={{ color: 'var(--green)', flexShrink: 0 }}>▸</span>Architected and shipped the full-stack platform in React 18, TypeScript 5, Vite (SWC), shadcn/ui, and Framer Motion, with a real-time backend and live market pricing logic</li>
                    <li style={{ display: 'flex', gap: '10px' }}><span style={{ color: 'var(--green)', flexShrink: 0 }}>▸</span>Designed the prediction market engine - probability curves, resolution logic, user balance ledger, and event lifecycle state machine from scratch</li>
                    <li style={{ display: 'flex', gap: '10px' }}><span style={{ color: 'var(--green)', flexShrink: 0 }}>▸</span>Built AI-powered GTM workflows using LLMs to automate content, social distribution, and user acquisition - replacing a full marketing function</li>
                    <li style={{ display: 'flex', gap: '10px' }}><span style={{ color: 'var(--green)', flexShrink: 0 }}>▸</span>Set up CI/CD pipeline, environment config, database schema, and Vercel deployments for scalable production releases</li>
                  </ul>
                </div>
                <div className="exp-tags">
                  <span className="exp-tag highlight">Full-Stack</span>
                  <span className="exp-tag highlight">Systems Design</span>
                  <span className="exp-tag">AI/GTM</span>
                  <span className="exp-tag">Product Architecture</span>
                  <span className="exp-tag">0→1</span>
                </div>
              </div>
              <div><div className="exp-period">Mar 2026<br />Present</div></div>
            </div>

            <div className="exp-card reveal" style={{ transitionDelay: '0.2s' }}>
              <div>
                <div className="exp-company">SOVA DATING · 2025 – PRESENT</div>
                <div className="exp-title">CMO &amp; Full-Stack Developer</div>
                <div className="exp-desc">
                  Dual role owning both GTM strategy and full-stack development at the first therapist-designed relational intelligence app.
                  <ul style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '0', listStyle: 'none' }}>
                    <li style={{ display: 'flex', gap: '10px' }}><span style={{ color: 'var(--green)', flexShrink: 0 }}>▸</span><span>Grew the waitlist and community to <strong style={{ color: 'var(--text)' }}>2,000+ organic users</strong> through brand-led content strategy and cross-platform community engagement</span></li>
                    <li style={{ display: 'flex', gap: '10px' }}><span style={{ color: 'var(--green)', flexShrink: 0 }}>▸</span>Built and shipped full-stack features end-to-end - frontend components, backend integrations, and systems architecture in collaboration with engineering</li>
                    <li style={{ display: 'flex', gap: '10px' }}><span style={{ color: 'var(--green)', flexShrink: 0 }}>▸</span>Owned investor-facing communication and fundraising narrative, translating product vision into compelling growth metrics and brand story</li>
                    <li style={{ display: 'flex', gap: '10px' }}><span style={{ color: 'var(--green)', flexShrink: 0 }}>▸</span>Established brand voice, visual identity system, and marketing playbook from 0 - positioning Sova as a category-defining app in the dating space</li>
                  </ul>
                </div>
                <div className="exp-tags">
                  <span className="exp-tag highlight">Marketing Strategy</span>
                  <span className="exp-tag highlight">Full-Stack Dev</span>
                  <span className="exp-tag">Brand Identity</span>
                  <span className="exp-tag">Fundraising</span>
                  <span className="exp-tag">User Acquisition</span>
                </div>
              </div>
              <div><div className="exp-period">Nov 2025<br />Present</div></div>
            </div>

            <div className="exp-card reveal" style={{ transitionDelay: '0.3s' }}>
              <div>
                <div className="exp-company">PRODUCTFLO · 2025 – 2025</div>
                <div className="exp-title">COO &amp; Full-Stack Developer</div>
                <div className="exp-desc">
                  Led both engineering and operations at a hardware version-control startup - building the platform from scratch while running the company.
                  <ul style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '0', listStyle: 'none' }}>
                    <li style={{ display: 'flex', gap: '10px' }}><span style={{ color: 'var(--green)', flexShrink: 0 }}>▸</span>Built the full company website and product platform end-to-end in React, Next.js, TypeScript, and Tailwind CSS - from zero to production</li>
                    <li style={{ display: 'flex', gap: '10px' }}><span style={{ color: 'var(--green)', flexShrink: 0 }}>▸</span>Integrated third-party APIs and backend services; optimised performance and cross-device rendering across the entire product</li>
                    <li style={{ display: 'flex', gap: '10px' }}><span style={{ color: 'var(--green)', flexShrink: 0 }}>▸</span>Drove a <strong style={{ color: 'var(--text)' }}>3x growth in online presence</strong> as COO by owning GTM, brand, and growth execution alongside engineering</li>
                    <li style={{ display: 'flex', gap: '10px' }}><span style={{ color: 'var(--green)', flexShrink: 0 }}>▸</span>Managed fundraising communications, cross-functional team alignment, and company operations strategy</li>
                  </ul>
                </div>
                <div className="exp-tags">
                  <span className="exp-tag highlight">React / Next.js</span>
                  <span className="exp-tag highlight">TypeScript</span>
                  <span className="exp-tag">Operations</span>
                  <span className="exp-tag">GTM</span>
                  <span className="exp-tag">Tailwind CSS</span>
                  <span className="exp-tag">API Integration</span>
                </div>
              </div>
              <div><div className="exp-period">Feb 2025<br />Dec 2025</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills">
        <div className="container">
          <div className="reveal">
            <div className="section-label">// skills</div>
            <h2 className="section-title">Built different.</h2>
            <p className="section-sub">The rare combination of deep engineering and go-to-market instinct - both at a founding level.</p>
          </div>

          <div className="skills-layout">
            <div className="reveal" style={{ transitionDelay: '0.1s' }}>
              <div className="skill-group-title">Engineering</div>
              <div className="skill-bars">
                {[
                  { name: 'React / Next.js', pct: 95 },
                  { name: 'TypeScript', pct: 90 },
                  { name: 'Systems Design & APIs', pct: 88 },
                  { name: 'Tailwind CSS / UI', pct: 85 },
                  { name: 'AI / LLM Integration', pct: 82 },
                ].map(({ name, pct }) => (
                  <div key={name} className="skill-bar-item" data-pct={pct}>
                    <div className="skill-bar-header">
                      <span className="skill-bar-name">{name}</span>
                      <span className="skill-bar-pct">{pct}%</span>
                    </div>
                    <div className="skill-bar-track"><div className="skill-bar-fill" /></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="reveal" style={{ transitionDelay: '0.2s' }}>
              <div className="skill-group-title">Growth &amp; Operator</div>
              <div className="skill-bars">
                {[
                  { name: 'GTM Strategy', pct: 92 },
                  { name: 'Brand & Marketing', pct: 88 },
                  { name: '0→1 Product Execution', pct: 90 },
                  { name: 'Fundraising Narratives', pct: 85 },
                  { name: 'Team Leadership', pct: 90 },
                ].map(({ name, pct }) => (
                  <div key={name} className="skill-bar-item" data-pct={pct}>
                    <div className="skill-bar-header">
                      <span className="skill-bar-name">{name}</span>
                      <span className="skill-bar-pct">{pct}%</span>
                    </div>
                    <div className="skill-bar-track"><div className="skill-bar-fill" /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects">
        <div className="container">
          <div className="reveal">
            <div className="section-label">// projects</div>
            <h2 className="section-title">Things I&apos;ve shipped.</h2>
            <p className="section-sub">Personal projects at the intersection of engineering, AI, and product thinking.</p>
          </div>

          <div style={{ marginTop: '56px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="exp-card reveal" style={{ transitionDelay: '0.1s', gridTemplateColumns: '1fr' }}>
              <div>
                <div className="exp-company">TEAQLO · 2026</div>
                <div className="exp-title">Prediction Market for Pop Culture</div>
                <div className="exp-desc">Built from scratch as founding engineer - a full-stack prediction market where users bet on pop culture outcomes. Architected the entire system: frontend in React 18 + Vite, backend APIs, real-time data, and an AI-powered GTM layer to drive user acquisition.</div>
                <div className="exp-tags">
                  <span className="exp-tag highlight">Next.js</span>
                  <span className="exp-tag highlight">Full-Stack</span>
                  <span className="exp-tag">AI/GTM</span>
                  <span className="exp-tag">Real-time</span>
                  <span className="exp-tag">0→1</span>
                </div>
                <div style={{ marginTop: '16px' }}>
                  <a href="https://teaqlo.com/" target="_blank" style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--green)', textDecoration: 'none', borderBottom: '1px solid rgba(0,232,150,0.3)' }}>teaqlo.com →</a>
                </div>
              </div>
            </div>

            <div className="exp-card reveal" style={{ transitionDelay: '0.15s', gridTemplateColumns: '1fr' }}>
              <div>
                <div className="exp-company">PERSONAL PROJECT · 2025</div>
                <div className="exp-title">75Kind - PMS-Safe 75Hard App</div>
                <div className="exp-desc">A full-stack habit and challenge tracking app that reimagines 75Hard with compassion - featuring a PMS-Safe mode that dynamically adjusts expectations, language, and water goals during a configurable window. Built with Supabase auth, daily checklists, streak logic, AI encouragement prompts, and progress analytics across 75 days.</div>
                <div className="exp-tags">
                  <span className="exp-tag highlight">React + TypeScript</span>
                  <span className="exp-tag highlight">Supabase</span>
                  <span className="exp-tag">Tailwind / shadcn-ui</span>
                  <span className="exp-tag">AI Prompts</span>
                  <span className="exp-tag">Vite</span>
                </div>
                <div style={{ marginTop: '16px' }}>
                  <a href="https://github.com/Raywa10/75-day-hard-PMS-Safe" target="_blank" style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--green)', textDecoration: 'none', borderBottom: '1px solid rgba(0,232,150,0.3)' }}>github.com/Raywa10/75-day-hard-PMS-Safe →</a>
                </div>
              </div>
            </div>

            <div className="exp-card reveal" style={{ transitionDelay: '0.25s', gridTemplateColumns: '1fr' }}>
              <div>
                <div className="exp-company">PERSONAL PROJECT · 2025</div>
                <div className="exp-title">Mission Thrombectomy Portal</div>
                <div className="exp-desc">A clinical workflow platform built 0→1 for stroke care teams - enabling rapid (&lt;60s) thrombectomy case logging, global access metrics, and structured data flow. Worked directly with neurology stakeholders to translate complex clinical workflows into a clean, error-free UI. Set up the full engineering pipeline: repo, CI/CD, API integration, and database schema on Vercel.</div>
                <div className="exp-tags">
                  <span className="exp-tag highlight">React + TypeScript</span>
                  <span className="exp-tag highlight">Tailwind / shadcn-ui</span>
                  <span className="exp-tag">Supabase</span>
                  <span className="exp-tag">Vercel CI/CD</span>
                  <span className="exp-tag">0→1</span>
                </div>
                <div style={{ marginTop: '16px' }}>
                  <a href="https://github.com/Raywa10/thrombectomy-portal" target="_blank" style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--green)', textDecoration: 'none', borderBottom: '1px solid rgba(0,232,150,0.3)' }}>github.com/Raywa10/thrombectomy-portal →</a>
                </div>
              </div>
            </div>

            <div className="exp-card reveal" style={{ transitionDelay: '0.3s', gridTemplateColumns: '1fr' }}>
              <div>
                <div className="exp-company">PERSONAL PROJECT · 2025</div>
                <div className="exp-title">miniCMO - AI GTM Agent</div>
                <div className="exp-desc">An AI-powered Go-To-Market agent that turns a product idea into a full launch strategy in 60 seconds - covering positioning, ICP personas, channel strategy, a day-by-day launch calendar, email sequences, and competitor angles. The intelligence lives in a structured prompt engineering layer enforcing specificity, cross-section consistency, and brand voice adaptation. Not a ChatGPT wrapper - it reasons like a senior GTM strategist.</div>
                <div className="exp-tags">
                  <span className="exp-tag highlight">React 18 + Vite</span>
                  <span className="exp-tag highlight">OpenAI / GPT-4o</span>
                  <span className="exp-tag">Supabase Auth</span>
                  <span className="exp-tag">Framer Motion</span>
                  <span className="exp-tag">Express</span>
                </div>
                <div style={{ marginTop: '16px' }}>
                  <a href="https://github.com/Raywa10/miniCMO" target="_blank" style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--green)', textDecoration: 'none', borderBottom: '1px solid rgba(0,232,150,0.3)' }}>github.com/Raywa10/miniCMO →</a>
                </div>
              </div>
            </div>
          </div>

          <div className="reveal" style={{ marginTop: '32px', textAlign: 'center', transitionDelay: '0.3s' }}>
            <a href="https://github.com/Raywa10/" target="_blank" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
              See more on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials">
        <div className="container">
          <div className="reveal">
            <div className="section-label">// testimonials</div>
            <h2 className="section-title">What people say.</h2>
            <p className="section-sub">
              From teammates, managers, and clients who&apos;ve seen the work up close.{' '}
              <a href="https://www.linkedin.com/in/raywa-singh/" target="_blank" style={{ color: 'var(--green)', textDecoration: 'none', borderBottom: '1px solid rgba(0,232,150,0.3)' }}>
                See all recommendations on LinkedIn →
              </a>
            </p>
          </div>

          <div className="testi-grid" style={{ marginTop: '56px' }}>
            <div className="testi-card featured reveal" style={{ transitionDelay: '0.05s' }}>
              <span className="quote-mark">&ldquo;</span>
              <p className="testi-text">Raywa is a <strong>rare full-stack builder and operator</strong>. She is genuinely someone who moves fast, ships quality work, and takes real ownership. She contributed across engineering and product while also leading a team of interns and supporting investor conversations. She helped drive a ~300% growth in our online presence and brought a level of initiative and reliability you rarely find. <strong>Any team would be lucky to have her.</strong></p>
              <div className="testi-author">
                <div className="testi-avatar">SK</div>
                <div>
                  <div className="testi-name">Serge KADJO</div>
                  <div className="testi-role">Building the most important piece of software for #hardware · managed Raywa directly</div>
                </div>
              </div>
            </div>

            <div className="testi-card reveal" style={{ transitionDelay: '0.1s' }}>
              <span className="quote-mark">&ldquo;</span>
              <p className="testi-text">Raywa is <strong>highly skilled and genuinely great to work with</strong>. She has a strong eye for building clean, user-friendly interfaces and consistently turns ideas into polished, thoughtful products. As a manager, she was supportive, provided clear and actionable feedback.</p>
              <div className="testi-author">
                <div className="testi-avatar">RE</div>
                <div>
                  <div className="testi-name">Rimsha Ejaz</div>
                  <div className="testi-role">APM @ Resmed · CS @ Oregon State · reported to Raywa</div>
                </div>
              </div>
            </div>

            <div className="testi-card reveal" style={{ transitionDelay: '0.15s' }}>
              <span className="quote-mark">&ldquo;</span>
              <p className="testi-text">She took a stalled idea and built the product end-to-end. I had a vision without knowing how to execute and Raywa took ownership of features and even came up with ideas I didn&apos;t have. <strong>She is great at working independently to bring things from 0→1.</strong> I trust her entirely and couldn&apos;t build my dream without her!</p>
              <div className="testi-author">
                <div className="testi-avatar">HP</div>
                <div>
                  <div className="testi-name">Haley Pilgrim</div>
                  <div className="testi-role">Strategy · Operations · Sociology · Raywa&apos;s client</div>
                </div>
              </div>
            </div>

            <div className="testi-card reveal" style={{ transitionDelay: '0.2s' }}>
              <span className="quote-mark">&ldquo;</span>
              <p className="testi-text">Raywa was responsible for distributing full-stack development tasks and approving code reviews. She did way more than just assigned tasks - <strong>she was an amazing leader and helped me expand my technical knowledge from the start.</strong></p>
              <div className="testi-author">
                <div className="testi-avatar">ML</div>
                <div>
                  <div className="testi-name">Michael James Leonick</div>
                  <div className="testi-role">Digital Solutions Developer · Software Dev Intern @ ProductFlo</div>
                </div>
              </div>
            </div>

            <div className="testi-card reveal" style={{ transitionDelay: '0.25s' }}>
              <span className="quote-mark">&ldquo;</span>
              <p className="testi-text">Raywa did amazing work organizing our team and managing social media across platforms. She utilized skills in networking to <strong>increase brand outreach and was integral in ideating events and their execution.</strong></p>
              <div className="testi-author">
                <div className="testi-avatar">AS</div>
                <div>
                  <div className="testi-name">Ashley Senciboy</div>
                  <div className="testi-role">Co-Founder &amp; COO, Sova Dating · worked with Raywa</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact">
        <div className="container">
          <div className="contact-inner reveal">
            <div className="section-label">// contact</div>
            <h2 className="section-title">
              Let&apos;s build<br />
              <span style={{ background: 'linear-gradient(135deg,var(--green),var(--violet))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                something great.
              </span>
            </h2>
            <p className="section-sub" style={{ margin: '20px auto 40px' }}>If you need someone who can code, do GTM, or do both - reach out. I&apos;m open to founding roles, senior engineering, and growth-adjacent positions.</p>
            <div className="contact-links">
              <a href="mailto:raywasingh.10@gmail.com" className="contact-link">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                Email Raywa
              </a>
              <a href="https://www.linkedin.com/in/raywa-singh/" target="_blank" className="contact-link">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
                LinkedIn
              </a>
              <a href="https://github.com/Raywa10/" target="_blank" className="contact-link">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
                GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <span style={{ background: 'linear-gradient(135deg,var(--green),var(--violet))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Raywa Singh</span> · Built with code &amp; ambition · 2026
      </footer>
    </>
  );
}
