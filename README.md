# 🎬 MediaWorld — Cinematic Experience Platform

> *Your ultimate streaming destination for movies, shows, and exclusive content. AI-powered recommendations tailored to your taste.*

---

## 📖 About the Project

**MediaWorld** is a modern, high-performance cinema platform landing page built with Next.js 16 and React 19. The project delivers a premium editorial-style user experience inspired by luxury cinema culture — think velvet seats, atmospheric lighting, and the magic of the silver screen.

The platform serves as both a marketing front-end and a gateway into a full-featured streaming service. It features cinematic typography, parallax animations, smooth scroll-reveal effects, and an AI-powered film recommendation engine showcased through an elegant, interactive UI.

---

## 🎯 Goals

- **Premium First Impression** — A visually stunning landing page that immediately communicates quality and exclusivity
- **AI-Powered Discovery** — Showcase a four-step AI assistant that learns user preferences and curates personalized film recommendations
- **Featured Film Curation** — Surface must-watch films with rich detail cards, genre tags, awards highlights, and release metadata
- **Full-Page Storytelling** — Guide visitors through the MediaWorld brand story via Vision, Philosophy, AI Experience, and Featured Films sections
- **Responsive & Accessible** — Mobile-first layout with a collapsible navigation menu and keyboard-accessible interactive elements
- **Performance Optimized** — Intersection Observer–driven animations, passive scroll listeners, and Next.js image optimization

---

## ✨ Key Features

### 🏠 Hero Section
- Full-viewport cinematic background with a parallax scroll effect
- Animated headline entrance with staggered timing (`cubic-bezier` easing)
- Architectural grid line decorations that shift independently on scroll
- `4K Ultra HD` / `Dolby Atmos` corner badge
- Smooth scroll indicator with pulsing animation

### 🔭 Vision Section
- Brand mission and value statements
- Editorial layout with large serif typography

### 💡 Philosophy Section
- Core brand principles presented in an elegant editorial format

### 🤖 AI Assistant Section (`#ai-assistant`)
- Interactive four-step accordion explaining the recommendation engine:
  1. **Discover** — Tell Us Your Mood (natural language input)
  2. **Analyze** — AI Processing (ML, sentiment analysis, pattern recognition)
  3. **Curate** — Personalized Selection (top matches with explanations)
  4. **Enjoy** — Watch & Refine (4K streaming + continuous learning)
- Expandable step detail panels with feature bullet lists

### 🎥 Featured Films Section (`#featured`)
- Interactive film showcase with three curated titles:
  - *Dune: Part Two* (2024) — Action / Adventure / Sci-Fi
  - *Oppenheimer* (2023) — Biography / Drama / History
  - *Everything Everywhere All at Once* (2022) — Action / Comedy / Fantasy
- Awards badges, genre tags, director credits, release year labels
- Smooth image crossfade transitions between selections

### 📬 Contact Section
- Inquiry and newsletter sign-up form
- Location, support email, and press contact details

### 🧭 Navigation Header
- Transparent-to-frosted-glass transition on scroll
- Desktop horizontal nav + animated mobile full-screen overlay
- Hover underline animations on all nav items
- Responsive hamburger → X animation

### 🦶 Footer
- Brand tagline, explore links, legal links, social links
- Oversized decorative serif quote text
- Smooth "Back to Top" button

---

## 🗂️ Page Sections (in order)

| # | Section | ID / Anchor | Component |
|---|---------|-------------|-----------|
| 1 | Hero | — | `HeroSection` |
| 2 | Vision | `#vision` | `VisionSection` |
| 3 | Philosophy | `#philosophy` | `PhilosophySection` |
| 4 | AI Experience | `#ai-assistant` | `ExperienceSection` |
| 5 | Featured Films | `#featured` | `DishesSection` |
| 6 | Contact | `#contact` | `ContactSection` |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI Library | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Component System | Radix UI primitives (full suite) |
| Icons | Lucide React |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Fonts | Inter, Playfair Display, JetBrains Mono (Google Fonts) |
| Analytics | Vercel Analytics |
| Animations | CSS transitions + Intersection Observer |
| Images | Next.js `<Image>` with custom `ImageReveal` component |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** or **pnpm**

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/mediaworld.git
cd mediaworld

# Install dependencies
npm install
# or
pnpm install
```

### Environment Setup

Copy the example environment file and fill in your values:

```bash
cp .env.local.example .env.local
```

Required environment variables are documented in `claude.md`.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run start
```

---

## 📁 Project Structure

```
mediaworld/
├── app/
│   ├── globals.css          # Global styles & CSS custom properties
│   ├── layout.tsx           # Root layout, fonts, metadata, analytics
│   └── page.tsx             # Home page — composes all sections
├── components/
│   ├── header.tsx           # Fixed navigation header
│   ├── footer.tsx           # Site footer
│   ├── theme-provider.tsx   # next-themes dark/light mode wrapper
│   └── sections/
│       ├── hero.tsx         # Hero with parallax & entrance animation
│       ├── vision.tsx       # Brand vision section
│       ├── philosophy.tsx   # Brand philosophy section
│       ├── experience.tsx   # AI assistant 4-step accordion
│       ├── dishes.tsx       # Featured films showcase
│       ├── projects.tsx     # (Reserved) Featured projects layout
│       └── contact.tsx      # Contact & newsletter form
│   └── ui/                  # shadcn/ui + custom primitives (58 components)
├── lib/
│   └── utils.ts             # `cn()` class merge utility
├── public/
│   └── images/              # Hero, film, and experience images
├── styles/                  # Additional global stylesheets
├── .env.local               # Local environment variables (git-ignored)
├── claude.md                # AI assistant context & architecture notes
├── next.config.mjs          # Next.js configuration
├── tailwind.config          # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

© 2026 MediaWorld. All rights reserved.

---

*Cinema is the art that captures dreams and awakens wonder.*
