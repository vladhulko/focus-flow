# 🌸 Focus Flow

A productivity web app with a cozy LifeAt.io-inspired aesthetic — glassmorphism UI, animated backgrounds, Pomodoro timer, digital garden, and gamification.

## Quick Start

```bash
npm install
npm run dev
```

## Features

- ⏰ **Focus Timer**: Circular Pomodoro timer with persistent countdown across routes
  - **4 Preset Slots**: Pomodoro (25/5, fixed), Short, Long, Custom (all editable)
  - Timer continues in background when navigating to Garden/Profile
  - Mini-timer indicator in navbar when running on other pages
  - Auto-start break toggle
  - Flow Coins **only awarded for focus sessions**, never for breaks
- 🎵 **Music Player**: Cross-page lofi radio powered by Howler.js
  - 5 streaming radio stations (lofi, chillhop, jazz, ambient, chillout)
  - Play/pause/skip/volume controls persist across all routes
  - Volume saved to localStorage
- 🌳 **Digital Garden**: 5×5 grid with growth stages (seedling → sprout → grown)
  - Integrated Plant Shop sidebar
  - Inventory system — buy items, then place them on the grid
  - Visual growth progression over time
- 👤 **Profile**: Stats, rank system, background theme selector, achievements
- 🎨 **Background Engine**: 5 animated gradient backgrounds with floating particles
- 💰 **Flow Coins**: Currency earned from focus sessions only, spent in the shop
- 🔐 **Silent Auth**: Device-based UUID + JWT authentication for backend sync
- 💾 **Persistence**: Full localStorage fallback — works offline

## Architecture

```
src/
├── services/
│   ├── api.js          — Axios instance with JWT interceptor
│   └── auth.js         — Silent login (device_id UUID + JWT)
├── context/
│   ├── AuthContext.jsx  — Auth state (user, token, online/offline)
│   ├── AppContext.jsx   — Global state (coins, garden, inventory, stats)
│   ├── TimerContext.jsx — Timer engine (persists across routes, preset slots)
│   └── AudioContext.jsx — Music engine (Howler.js, persists across routes)
├── components/
│   ├── BackgroundEngine.jsx — Animated gradient backgrounds + particles
│   ├── GlassPanel.jsx       — Reusable glassmorphism card
│   ├── MusicPlayer.jsx      — Floating lofi music widget (uses AudioContext)
│   ├── Navbar.jsx            — Bottom nav + mini-timer + coin display
│   └── TimerSettings.jsx     — Settings modal with preset editor
└── pages/
    ├── Timer.jsx    — Focus zone with circular timer + preset selector
    ├── Garden.jsx   — Digital garden + integrated shop
    └── Profile.jsx  — Stats, rank, achievements, bg selector
```

## Navigation

- `/` — Focus Timer
- `/garden` — Digital Garden + Shop
- `/profile` — Stats, achievements, settings

## Backend Integration (Optional)

Set `VITE_API_URL` in `.env` to connect to your Express/PostgreSQL backend:

```
VITE_API_URL=http://localhost:3001/api
```

API endpoints used:
- `POST /api/auth/silent` — Silent login with device_id
- `POST /api/sessions` — Start a focus session
- `PATCH /api/sessions/:id` — Complete a session
- `GET /api/music` — Fetch background music tracks
- `GET /api/shop/items` — List shop items
- `POST /api/shop/buy` — Purchase an item
- `GET /api/garden` — Fetch garden objects
- `GET /api/achievements` — Fetch user achievements

## Tech Stack

- React 19 + Vite 7
- React Router DOM 7
- Tailwind CSS 4
- Framer Motion (page transitions, animations)
- Howler.js (audio streaming engine)
- Axios (API client)
- lucide-react (icons)
- Context API + localStorage

---

Built for NaUKMA · Focus Flow 🌱
