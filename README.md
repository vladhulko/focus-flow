# 🌸 Focus Flow

A productivity web app with a cozy LifeAt.io-inspired aesthetic — glassmorphism UI, animated backgrounds, Pomodoro timer, digital garden, task management, and gamification.

## Quick Start

### Frontend

```bash
npm install
npm run dev
```

### Backend

```bash
cd server
npm install
cp .env.example .env   # fill in DATABASE_URL and JWT_SECRET
npm run seed            # seed shop items
npm run dev             # starts on port 3001
```

## Features

- ⏰ **Focus Timer**: Circular Pomodoro timer with persistent countdown across routes
  - **4 Preset Slots**: Pomodoro (25/5, fixed), Short, Long, Custom (all editable)
  - Custom glassmorphism +/− number inputs for editing presets
  - Timer continues in background when navigating to Garden/Profile
  - Mini-timer indicator in navbar when running on other pages
  - Auto-start break toggle
  - Flow Coins **only awarded for focus sessions**, never for breaks
- 📋 **Task Management**: Full-stack task tracking linked to focus sessions
  - Add tasks, mark complete, link tasks to active sessions
  - Bonus 5 Flow Coins for completing session-linked tasks
  - Collapsible "completed today" section
  - Backend sync with localStorage fallback
- 🎵 **Music Player**: Cross-page lofi radio powered by Howler.js
  - 5 streaming radio stations (lofi, chillhop, jazz, ambient, chillout)
  - Play/pause/skip/volume controls persist across all routes
  - Volume saved to localStorage
- 🌳 **Digital Garden**: 5×5 grid with sky/ground gradient background
  - 3 growth stages with animations: Seedling → Sprout → Grown (sway + glow)
  - Pop-in spring animation on planting, growth progress bars
  - Hover tooltips with plant name and growth stage
  - Ghost seedling preview on empty plots
  - Integrated Plant Shop sidebar with inventory system
- 👤 **Profile**: Stats, rank system, background theme selector, achievements
- 🎨 **Background Engine**: 8 animated gradient backgrounds with colored floating particles
  - Includes deep forest, tropical ocean, and warm sunset themes
- 💰 **Flow Coins**: Currency earned from focus sessions and task completion, spent in the shop
- 🔐 **Silent Auth**: Device-based UUID + JWT authentication with duplicate-key handling
- 💾 **Persistence**: Full localStorage fallback — works entirely offline

## Architecture

### Frontend

```
src/
├── services/
│   ├── api.js          — Axios instance with JWT interceptor
│   └── auth.js         — Silent login (device_id UUID + JWT)
├── context/
│   ├── AuthContext.jsx  — Auth state (user, token, online/offline)
│   ├── AppContext.jsx   — Global state (coins, garden, inventory, stats)
│   ├── TimerContext.jsx — Timer engine (persists across routes, preset slots)
│   ├── AudioContext.jsx — Music engine (Howler.js, persists across routes)
│   └── TaskContext.jsx  — Task state (CRUD, session linking, coin rewards)
├── components/
│   ├── BackgroundEngine.jsx — 8 animated gradient backgrounds + particles
│   ├── GlassPanel.jsx       — Reusable glassmorphism card
│   ├── MusicPlayer.jsx      — Floating lofi music widget
│   ├── Navbar.jsx            — Bottom nav + mini-timer + coin display
│   ├── TaskPanel.jsx         — Task list with session linking
│   └── TimerSettings.jsx     — Settings modal with custom +/− inputs
└── pages/
    ├── Timer.jsx    — Focus zone + task panel
    ├── Garden.jsx   — Digital garden with growth animations + shop
    └── Profile.jsx  — Stats, rank, achievements, bg selector
```

### Backend (server/)

```
server/
├── index.js           — Express entry point, mounts all /api/* routes
├── config/db.js       — pg Pool with Supabase SSL
├── middleware/auth.js  — JWT verification middleware
├── models/
│   ├── User.js        — findByDeviceId, create, findById, update
│   ├── Session.js     — create, findById, complete
│   ├── Task.js        — findByUser, create, findById, update
│   ├── ShopItem.js    — findAll, findById
│   ├── UserItem.js    — findByUser, userOwnsItem, create
│   ├── GardenObject.js — findByUser, create, findById, remove
│   └── Achievement.js — findByUser, unlock, checkAndUnlock
├── routes/
│   ├── auth.js        — POST /silent (upsert with 23505 handling)
│   ├── sessions.js    — POST /, PATCH /:id (coins, streak, achievements)
│   ├── tasks.js       — GET /, POST /, PATCH /:id
│   ├── shop.js        — GET /items, POST /buy
│   ├── garden.js      — GET /, POST /, DELETE /:id
│   └── achievements.js — GET /
└── seeders/seed.js    — Seeds 12 shop items (plants, themes, sounds)
```

## Navigation

- `/` — Focus Timer
- `/garden` — Digital Garden + Shop
- `/profile` — Stats, achievements, settings

## API Endpoints

Frontend connects to `VITE_API_URL` (default `http://localhost:3001/api`). All endpoints except auth require JWT in `Authorization: Bearer <token>` header.

| Method  | Endpoint              | Description                                  |
|---------|-----------------------|----------------------------------------------|
| POST    | `/api/auth/silent`    | Silent login/register by device_id           |
| POST    | `/api/sessions`       | Start a focus session                        |
| PATCH   | `/api/sessions/:id`   | Complete session (awards coins, updates streak) |
| GET     | `/api/tasks`          | List user's tasks                            |
| POST    | `/api/tasks`          | Create a task                                |
| PATCH   | `/api/tasks/:id`      | Update task (complete, link to session)      |
| GET     | `/api/shop/items`     | List shop items                              |
| POST    | `/api/shop/buy`       | Purchase an item                             |
| GET     | `/api/garden`         | Fetch user's garden                          |
| POST    | `/api/garden`         | Place item in garden                         |
| DELETE  | `/api/garden/:id`     | Remove from garden                           |
| GET     | `/api/achievements`   | Fetch user achievements                      |

## Tech Stack

**Frontend:** React 19, Vite 7, React Router DOM 7, Tailwind CSS 4, Framer Motion, Howler.js, Axios, lucide-react

**Backend:** Node.js, Express 4, pg (raw SQL), JWT, Supabase PostgreSQL

---

Built for NaUKMA · Focus Flow 🌱
