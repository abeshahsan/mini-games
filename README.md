<div align="center">

# PlayClassix

**Classic multiplayer games reimagined with modern real-time technology**

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Redis](https://img.shields.io/badge/Upstash_Redis-serverless-red?style=flat-square&logo=redis)](https://upstash.com/)
[![Pusher](https://img.shields.io/badge/Pusher-real--time-blue?style=flat-square)](https://pusher.com/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

[Live Demo](https://playclassix.com) • [Report Bug](https://github.com/abeshahsan/playclassix/issues) • [Request Feature](https://github.com/abeshahsan/playclassix/issues)

</div>

---

## About

**PlayClassix** is a modern web platform bringing classic games to life with real-time multiplayer capabilities. Built with Next.js 16 and powered by serverless Redis, it offers seamless gameplay experiences with instant state synchronization across players.

Perfect for casual gaming sessions with friends, PlayClassix eliminates the need for downloads or installations—just share a link and start playing instantly in your browser.

**Current Status:** Memory Match is fully playable with 2-player real-time multiplayer. More games coming soon!

---

## Key Features

- **No Login Required** — Start playing instantly with auto-generated session IDs stored in browser cookies. No personal data collected, all session data cleared when browser closes
- **Real-Time Multiplayer** — Play with friends instantly using Pusher WebSocket connections for sub-100ms state synchronization
- **Optimistic UI Updates** — Cards flip immediately on click with automatic rollback on network failures for butter-smooth UX
- **Session Statistics** — Track wins, losses, and draws with your opponents using serverless Redis persistence
- **Smart Turn Management** — Race condition-free gameplay with processing locks preventing double-moves
- **Dark Mode Support** — Fully responsive design with light/dark theme support and custom CSS variables
- **Serverless Architecture** — Zero-latency deployment on Vercel with Upstash Redis for global performance
- **Accessibility First** — Semantic HTML, ARIA labels, and keyboard navigation throughout

---

## Technology Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | [Next.js 16](https://nextjs.org/) with App Router & React Server Components |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) with strict mode |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) with custom design system |
| **State Management** | [Zustand](https://zustand-demo.pmnd.rs/) for client state |
| **Database** | [Upstash Redis](https://upstash.com/) for game state & session stats |
| **Real-Time** | [Pusher](https://pusher.com/) for WebSocket-based multiplayer sync |
| **Icons** | [React Icons](https://react-icons.github.io/react-icons/) (Feather set) |
| **Fonts** | [Geist Sans & Geist Mono](https://vercel.com/font) |
| **Deployment** | [Vercel](https://vercel.com/) with Edge Runtime |
| **Dev Tools** | ESLint 9, Sharp (image optimization) |

---

## Featured Games

### Memory Match (Completed)
A classic memory card game reimagined for real-time multiplayer:
- 16-card grid with fruit-themed illustrations
- 2-player competitive gameplay
- Real-time score tracking and turn indicators
- Session-based statistics (W/L/D records)
- Game complete modal with individual stats
- Optimistic card flips with error recovery

### Coming Soon
- **Wordle Clone** — Daily word puzzle with multiplayer duels
- **Tic Tac Toe** — Strategic multiplayer grid game
- **Snake** — Classic arcade action
- **Chess** — Timeless strategy game with real-time play

---

## Architecture

PlayClassix follows a **modern Next.js App Router architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                      Client Layer                       │
│  - React Components (Server + Client Components)        │
│  - Zustand Stores (Local State)                         │
│  - Custom Hooks (Business Logic)                        │
└────────────────────────────┬────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────┐
│                    API Routes Layer                     │
│  - Server Actions (Next.js 16)                          │
│  - RESTful API endpoints                                │
│  - Cookie management (authentication)                   │
└────────────────────────────┬────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────┐
│                     Services Layer                      │
│  - Game Store (game-store.ts)                           │
│  - Pusher Server (real-time events)                     │
│  - Redis Client (state persistence)                     │
└────────────────────────────┬────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────┐
│                   External Services                     │
│  - Upstash Redis (Serverless DB)                        │
│  - Pusher Channels (WebSocket)                          │
└─────────────────────────────────────────────────────────┘
```

### Key Design Patterns

- **Optimistic Updates** — Client updates UI immediately, rolls back on API failure
- **WebSocket Sync** — Pusher broadcasts game state changes to all connected players
- **Redis as SSoT** — All game state persists to Redis with 2-hour TTL
- **Custom Hooks** — Game logic encapsulated in reusable hooks (useCardClickHandler, useSetUpPusherClient)
- **Type Safety** — End-to-end TypeScript with strict compiler options

---

## Getting Started

### Prerequisites

- **Node.js** 20.x or higher
- **npm** or **pnpm**
- **Upstash Redis** account ([create free](https://upstash.com/))
- **Pusher** account ([create free](https://pusher.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/abeshahsan/playclassix.git
   cd playclassix
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the root directory. see [`.env.example`](.env.example) for required variables.

   ```env

4. **Run development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

---

## Project Structure

```
playclassix/
├── public/
│   ├── assets/
│   │   ├── cards/          # Game card images
│   │   ├── icons/          # App icons (favicon, apple-touch)
│   │   ├── logos/          # Brand logos
│   │   ├── ui/             # UI assets (medals, backgrounds)
│   │   └── social/         # OG images for social sharing
│   └── manifest.json       # PWA manifest
│
├── scripts/
│   └── generate-assets.mjs # Asset generation utilities
│
├── src/
│   ├── app/
│   │   ├── api/            # API routes
│   │   │   ├── games/      # Game-specific APIs
│   │   │   │   └── memory-match/
│   │   │   │       ├── new-game/
│   │   │   │       ├── join-game/
│   │   │   │       ├── move/
│   │   │   │       └── player-stats/
│   │   │   ├── me/         # User authentication
│   │   │   └── message/    # System messages
│   │   ├── games/          # Game pages
│   │   │   └── memory-match/
│   │   │       ├── [gameId]/
│   │   │       └── new-game/
│   │   ├── set-username/   # Onboarding
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page
│   │
│   ├── components/
│   │   ├── games/          # Game-specific components
│   │   │   └── memory-match/
│   │   │       ├── card.tsx
│   │   │       ├── game-complete-modal.tsx
│   │   │       ├── score-board.tsx
│   │   │       └── ...
│   │   └── global/         # Shared components
│   │       ├── app-shell.tsx
│   │       ├── sidebar.tsx
│   │       ├── site-header.tsx
│   │       └── theme-provider.tsx
│   │
│   ├── core/
│   │   └── game.registry.ts  # Game metadata registry
│   │
│   ├── hooks/
│   │   └── games/
│   │       └── memory-match/
│   │           ├── useCardClickHandler.ts
│   │           ├── useJoinOrFetchGame.ts
│   │           └── useSetUpPusherClient.ts
│   │
│   ├── lib/
│   │   ├── game-store.ts   # Redis-backed game state
│   │   ├── pusher.ts       # Pusher server config
│   │   └── redis.ts        # Redis client (Upstash/ioredis)
│   │
│   ├── store/
│   │   ├── gamer.ts        # User state (Zustand)
│   │   └── games/
│   │       └── memory-match.ts  # Game-specific state
│   │
│   └── types/
│       ├── index.ts        # Global types
│       └── games/
│           └── memory-match/
│               └── types.ts
│
├── .env.local              # Environment variables (not in git)
├── next.config.ts          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS config
├── tsconfig.json           # TypeScript config
└── package.json            # Dependencies
```

---

## Key Implementation Details

### Redis State Management

Games are stored with a 2-hour TTL:
```typescript
// Key pattern: game:memory-match:{gameId}
await redis.set(`game:memory-match:${gameId}`, JSON.stringify(gameState), "EX", 7200);
```

Player stats use sorted pair keys:
```typescript
// Key pattern: player-stats:{player1Id}:{player2Id}
// IDs are sorted to ensure consistency
const key = [player1Id, player2Id].sort().join(":");
```

### Optimistic Updates

1. Client flips card immediately
2. Send move to server
3. On success: Pusher broadcasts to all players
4. On failure: Rollback local state + show error

```typescript
const previousState = { ...gameRoom };
optimisticFlipCard(cardId);  // Immediate UI update

const success = await sendMove(cardId, gameId, userId);
if (!success) {
  rollbackOptimisticFlip(previousState);  // Revert on error
}
```

### Preventing Race Conditions

Processing lock prevents double-clicks:
```typescript
if (isProcessing) return;  // Block new moves
setIsProcessing(true);     // Lock for 500ms minimum
```

---

## Security & Environment Variables

**Critical:** Never commit sensitive keys to git!

Required environment variables:
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`
- `PUSHER_APP_ID` / `PUSHER_SECRET` / `NEXT_PUBLIC_PUSHER_KEY` / `NEXT_PUBLIC_PUSHER_CLUSTER`

Use `.env.local` for local development (already in `.gitignore`).

For production deployment on Vercel:
1. Project Settings → Environment Variables
2. Add all required keys
3. Redeploy

---

## Contributing

Contributions are welcome! Standard flow:

1. **Fork** the project
2. Create your feature branch  
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes  
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. Push to the branch  
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a **Pull Request**

### Development Guidelines

- Follow existing code style (TypeScript strict mode)
- Add types for all new functions/components
- Test multiplayer features with 2+ browser tabs
- Update README if adding new features

---

## License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

## Author

**K. M. Abesh Ahsan**  
GitHub: [@abeshahsan](https://github.com/abeshahsan)  
Website: [playclassix.com](https://playclassix.com)

---

## Show Your Support

Give a star ⭐ if you like this project!

---

<div align="center">

**Built with ❤️ by K. M. Abesh Ahsan**

[Back to Top](#playclassix)

</div>
