# West Green Darts - Team Management Application

A mobile-first web application for managing West Green Darts team fixtures, games, player profiles, and comprehensive statistics.

## Features

- **PIN Authentication**: Simple team-wide access with PIN entry
- **Player Management**: Register players with darts equipment profiles
- **Season Organization**: Organize fixtures by season (25/26, 26/27, etc.)
- **Live 501 Game Scoring**: Track games with undo functionality and finish guidance
- **Comprehensive Statistics**: Track 18+ performance metrics per player
- **Team Dashboard**: View aggregate team statistics and performance
- **Data Export**: Export statistics and game data as CSV
- **Mobile-First Design**: Optimized for touch devices with PWA support

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI (shadcn/ui)
- **Database**: SQLite with Prisma ORM
- **Authentication**: Custom PIN-based auth with bcryptjs

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd WestGreenDarts
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
# Generate Prisma client
npx prisma generate

# Create and migrate database
npx prisma db push
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Default PIN

The default PIN is **1234**. You can change this in the settings after logging in.

## Database Management

```bash
# View database in browser UI
npx prisma studio

# Reset database (WARNING: Deletes all data)
rm prisma/dev.db
npx prisma db push
```

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard page
│   ├── players/           # Player management
│   ├── seasons/           # Season management
│   └── fixtures/          # Fixture management
├── components/            # React components
│   ├── ui/               # Base UI components
│   └── navigation.tsx    # App navigation
├── lib/                   # Utility libraries
│   ├── prisma.ts         # Database client
│   ├── auth.ts           # Authentication logic
│   ├── finish-guidance.ts # Checkout suggestions
│   └── utils.ts          # Helper functions
├── prisma/               # Database schema and migrations
│   └── schema.prisma     # Database schema
└── public/               # Static assets
```

## Development Phases

See [PRD.md](./PRD.md) for complete product requirements.

### ✅ Phase 1: Authentication & Setup (Complete)
- PIN authentication
- Route protection
- Basic navigation
- Dashboard structure

### 🚧 Phase 2: Player Management (In Progress)
- Add/edit players
- Player profiles
- Equipment tracking

### 📋 Phase 3: Season & Fixture Management (Planned)
- Create seasons
- Schedule fixtures
- Fixture details

### 📋 Phase 4: 501 Game Scoring Engine (Planned)
- Live scoring interface
- Numeric keypad
- Undo functionality
- Finish guidance

### 📋 Phase 5: Statistics Tracking (Planned)
- Calculate all 18+ statistics
- Real-time updates
- Performance metrics

### 📋 Phase 6: Dashboard & Analytics (Planned)
- Team statistics
- Player dashboards
- Charts and visualizations

### 📋 Phase 7: Data Export (Planned)
- CSV exports
- Game data export

### 📋 Phase 8: PWA Features (Planned)
- Offline support
- Home screen installation

### 📋 Phase 9: Polish & Optimization (Planned)
- Mobile UX refinement
- Performance tuning
- Accessibility improvements

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open database GUI
- `npx prisma db push` - Push schema changes to database

## Statistics Tracked

### Basic Statistics
- Legs (played/won)
- 3 Darts Average
- First 9 Average

### Score Distribution
- 60+ scores, 80+ scores, 100+ scores
- 120+ scores, 140+ scores, 170+ scores
- 180s (maximum scores)

### Finish Statistics
- High Finish
- 100+ Finishes
- Best/Worst Leg

### Performance Metrics
- Checkout %, Checkout Prediction %
- Keep %, Keep Prediction %
- Break %, Break Prediction %

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Deploy
4. Add environment variables if needed

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- Render
- AWS
- Google Cloud

## License

Private - West Green Darts Team

## Support

For issues or feature requests, contact the team administrator.

---

**Version**: 1.0.0
**Last Updated**: 2026-01-22
