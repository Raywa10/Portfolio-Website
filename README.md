# Raywa Singh - Personal Portfolio


A high-performance personal portfolio built to showcase my work as a CTO, Full-Stack Engineer, and GTM Lead. Designed and engineered from scratch — no templates, no component libraries, no shortcuts.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | CSS (custom design system with CSS variables) |
| Fonts | Space Grotesk · JetBrains Mono (via `next/font`) |
| Animations | CSS keyframes · Canvas API · IntersectionObserver |
| Deployment | Vercel |

---

## Features

- **Particle canvas** — interactive WebGL-style particle network built on the raw Canvas API with mouse-repulsion physics
- **Typewriter effect** — smooth character-by-character animation cycling through roles
- **Scroll reveal** — IntersectionObserver-driven fade-up animations on every section
- **Animated stat counters** — eased number animations that trigger on viewport entry
- **Skill bar animations** — percentage bars that fill on scroll with cubic-bezier easing
- **Badge panel toggle** — interactive skill breakdown cards (Engineer / GTM Lead / AI GTM Engineer)
- **Floating nav** — frosted-glass pill navigation with smooth scroll anchors
- **Fully responsive** — mobile-first layout across all breakpoints

---

## Project Structure

```
├── app/
│   ├── layout.tsx        # HTML shell, metadata, Google Fonts
│   ├── page.tsx          # Full portfolio — all sections as one React component
│   └── globals.css       # Complete design system (CSS variables, all styles)
├── public/
├── next.config.js
├── tsconfig.json
└── package.json
```

---

## Running Locally

```bash
git clone https://github.com/Raywa10/portfolio.git
cd portfolio
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Design Decisions

**No UI framework.** Every component — cards, nav, badges, skill bars — is hand-written CSS. This keeps the bundle lean and the design fully intentional.

**One page component.** The entire portfolio lives in `app/page.tsx` as a single `'use client'` component. For a static portfolio with no routing or shared state, this is the right call - no premature abstraction.

**Canvas over library.** The hero particle system is built directly on the Canvas API rather than a library like tsParticles. ~60 lines of code, zero dependencies, full control over physics and rendering.

**CSS variables over Tailwind.** A custom design token system (`--green`, `--violet`, `--bg`, `--muted`, etc.) gives the same utility as a design system without the framework overhead.

---

## Featured Projects

| Project | Stack | Link |
|---|---|---|
| **Teaqlo** — Prediction market for pop culture | React 18, TypeScript, Vite, Framer Motion | [teaqlo.com](https://teaqlo.com) |
| **75Kind** — PMS-Safe 75Hard habit tracker | React, TypeScript, Supabase, shadcn/ui | [GitHub](https://github.com/Raywa10/75-day-hard-PMS-Safe) |
| **Mission Thrombectomy Portal** — Clinical workflow platform | React, TypeScript, Supabase, Vercel CI/CD | [GitHub](https://github.com/Raywa10/thrombectomy-portal) |
| **miniCMO** — AI GTM agent | React 18, Vite, OpenAI GPT-4o, Express | [GitHub](https://github.com/Raywa10/miniCMO) |

---

## Contact

**Email** — raywasingh.10@gmail.com  
**LinkedIn** — [linkedin.com/in/raywa-singh](https://www.linkedin.com/in/raywa-singh/)  
**GitHub** — [github.com/Raywa10](https://github.com/Raywa10/)
