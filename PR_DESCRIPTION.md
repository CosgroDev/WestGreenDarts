# Migrate database layer from Prisma to direct SQL

## Overview

Migrates the entire database layer from Prisma ORM to direct SQL using better-sqlite3 to resolve Prisma engine download failures due to network restrictions (403 Forbidden errors).

## Motivation

Prisma client generation was failing in the deployment environment:
- **Error**: 403 Forbidden when downloading Prisma engines
- **Impact**: Blocked by network restrictions
- **Problem**: Unable to generate Prisma client needed for database access

## Solution

Complete conversion to direct SQL queries using better-sqlite3:
- ✅ No external binary downloads required
- ✅ Synchronous API better suited for SQLite
- ✅ Full control over queries and performance
- ✅ Type-safe wrappers maintain developer experience

## Changes

### Core Libraries (3 files)
- **`lib/db-direct.ts`** (~2000 lines) - Comprehensive type-safe database access layer
- **`lib/statistics-calculator.ts`** - Converted all Prisma queries to direct SQL
- **`lib/auth-direct.ts`** - PIN authentication with direct SQL (added `initializePinDirect` and `updatePinDirect`)

### API Endpoints (17 files)
- ✅ **Players API** - GET, POST, PUT, DELETE
- ✅ **Seasons API** - GET, POST, PUT, DELETE with fixture counts
- ✅ **Fixtures API** - GET, POST, PUT, DELETE with game counts
- ✅ **Games API** - GET, POST, DELETE, visit recording, undo functionality
- ✅ **Statistics API** - Player stats, team stats, recalculate
- ✅ **Export API** - Players CSV, team CSV, games CSV
- ✅ **Init API** - Database initialization

### Page Components (5 files)
- ✅ `app/players/page.tsx` - Players list with sorting
- ✅ `app/players/[id]/edit/page.tsx` - Player edit form
- ✅ `app/players/[id]/stats/page.tsx` - Player statistics dashboard
- ✅ `app/seasons/page.tsx` - Seasons list
- ✅ `app/seasons/[id]/fixtures/page.tsx` - Season fixtures view

## Testing

**Comprehensive test suite executed**:
- ✅ 18 API endpoint tests (all passing)
- ✅ Export functionality tests (CSV generation working)
- ✅ Authentication flow verified (PIN 1234)
- ✅ CRUD operations for all entities
- ✅ Complex game scoring logic (Best of 2 format)
- ✅ Statistics calculation (18+ metrics)
- ✅ Undo functionality

**Test Results**:
```
============================================================
✓ All tests passed!
============================================================
  - Authentication: PIN verification working (correct/incorrect PIN tested)
  - Players CRUD: Create, read, update, delete all working
  - Seasons CRUD: With fixture counts aggregated correctly
  - Fixtures CRUD: With game counts aggregated correctly
  - Games: Creation with first leg auto-creation
  - Visit Recording: Player and opponent scoring (60 points tested)
  - Undo: Restores scores correctly
  - Statistics: Team and player aggregations calculating correctly
  - Export: CSV files generated with proper headers and data

Export Test Results:
  - Player Statistics CSV: 30 columns of data exported correctly
  - Team Statistics CSV: All active players aggregated
  - Game Data CSV: Full game history with results
  - Statistics accuracy: 3-Dart Average 167.00, 100% win rate verified
```

## Database Operations

### Example Conversion Pattern

**Before (Prisma)**:
```typescript
const players = await prisma.player.findMany({
  where: { isActive: true },
  include: { statistics: true },
  orderBy: { name: 'asc' }
})
```

**After (Direct SQL)**:
```typescript
const players = getAllPlayers()
players.sort((a, b) => {
  if (a.isActive !== b.isActive) return a.isActive ? -1 : 1
  return a.name.localeCompare(b.name)
})
```

### Key Functions in db-direct.ts

**Player Operations**:
- `getAllPlayers()` - Get all players
- `getPlayerById(id)` - Get single player
- `createPlayer(data)` - Create new player
- `updatePlayer(id, data)` - Update player
- `deletePlayer(id)` - Delete player

**Season Operations**:
- `getAllSeasonsWithFixtureCount()` - Seasons with aggregated fixture counts
- `getSeasonById(id)` - Get single season
- `createSeason(data)` - Create season (handles isCurrent logic)
- `updateSeason(id, data)` - Update season
- `deleteSeason(id)` - Delete season

**Fixture Operations**:
- `getAllFixturesWithRelations()` - Fixtures with season and game count
- `getFixtureWithGames(id)` - Full fixture details
- `createFixtureWithSeason(data)` - Create fixture
- `updateFixtureWithSeason(id, data)` - Update fixture
- `deleteFixture(id)` - Delete fixture

**Game Operations**:
- `getAllGamesWithRelations()` - Games with player, fixture, season, legs
- `getGameWithFullDetails(id)` - Complete game with legs and visits
- `createGameWithFirstLeg(data)` - Create game + first leg in transaction
- `deleteGame(id)` - Delete game and cascade

**Visit & Scoring**:
- `createVisit(data)` - Record 3-dart visit
- `deleteVisit(id)` - Delete visit (for undo)
- `updateLeg(id, data)` - Update leg scores
- `createLeg(data)` - Create new leg (for Best of 2)

**Statistics**:
- `getPlayerStatistics(playerId, seasonId)` - Get stats
- `upsertPlayerStatistics(data)` - Create or update stats
- `getPlayerStatisticsWithRelations()` - Stats with player/season info

**Utilities**:
- `countActivePlayers()` - Count active players
- `countFixtures(seasonId?)` - Count fixtures
- `getUpcomingFixtures(seasonId?, limit)` - Get upcoming fixtures

## Critical Bug Fixed

**Issue**: NOT NULL constraint error when creating first player statistics
**Root Cause**: `calculateGameStatistics()` returns `Partial<CalculatedStats>` but `upsertPlayerStatistics()` expects all fields
**Solution**: Use `aggregateStatistics()` with empty initial state to ensure all fields are populated with correct defaults

**Code Change** (in `lib/statistics-calculator.ts`):
```typescript
// Before: Would fail with partial stats
upsertPlayerStatistics({
  playerId: game.playerId,
  seasonId: null,
  ...gameStats as any,  // ❌ Missing fields like threeDartAverage
})

// After: Properly aggregates all fields
const emptyStats: CalculatedStats = { /* all fields initialized */ }
const aggregated = aggregateStatistics(emptyStats, gameStats)
upsertPlayerStatistics({
  playerId: game.playerId,
  seasonId: null,
  ...aggregated,  // ✅ All fields present and calculated
})
```

## Breaking Changes

**None**. All API responses maintain the same structure. The change is purely internal implementation.

## Performance Impact

**Neutral to Positive**:
- SQLite with direct queries is fast for local operations
- No ORM overhead
- Synchronous API reduces async complexity
- Similar or better performance than Prisma for this use case
- Database file size: 112KB

## Migration Notes

**No data migration required**:
- Database schema unchanged (still using Prisma schema for reference)
- Existing SQLite database continues to work
- All table structures identical
- Data compatibility maintained

## Verification Checklist

- [x] All Prisma imports removed from app directory
- [x] Database schema verified (8 tables present: AppSettings, Player, Season, Fixture, Game, Leg, Visit, PlayerStatistics)
- [x] Authentication working (PIN 1234)
- [x] All API endpoints tested and working
- [x] Statistics calculation verified (18+ metrics calculating correctly)
- [x] Export functionality working (CSV generation)
- [x] Game scoring logic intact (Best of 2 format)
- [x] Undo functionality working (score restoration)
- [x] All tests passing (18 API tests + export tests)
- [x] No console errors in development
- [x] Database connections properly closed (try/finally blocks)
- [x] Boolean conversions handled (INTEGER → boolean)

## Commits in This PR

11 commits covering the full conversion:

1. **Fix: Add database initialization support** - Initial database setup
2. **Fix authentication: Implement direct SQL workaround for Prisma** - Auth conversion
3. **Clean up temporary verification script** - Cleanup
4. **Add database schema creation script** - Schema setup
5. **Convert Players API to direct SQL** - Players endpoints
6. **Convert Seasons API to direct SQL** - Seasons endpoints
7. **Convert Fixtures API to direct SQL** - Fixtures endpoints
8. **Convert Games API to direct SQL** - Games, visits, undo endpoints (most complex)
9. **Convert statistics calculator to direct SQL** - Statistics calculation
10. **Convert Export endpoints to direct SQL** - CSV exports
11. **Convert player statistics API endpoint to SQL** - Player stats API
12. **Convert remaining statistics API endpoints to direct SQL** - Team stats, recalculate
13. **Convert all page components and auth initialization to direct SQL** - UI components
14. **Fix statistics calculation: Ensure all fields are present when upserting** - Bug fix

## Related Issues

Resolves: Network restriction preventing Prisma engine downloads (403 Forbidden)

## Deployment Notes

**Ready to deploy**:
- ✅ No external dependencies to download at runtime
- ✅ SQLite database included in deployment
- ✅ All functionality tested and working
- ✅ `better-sqlite3` compiles to native addon during `npm install`
- ✅ No Prisma engine downloads required

## Post-Merge Actions

1. Verify production deployment works
2. Monitor for any edge cases in statistics calculation
3. Consider removing unused Prisma files (`lib/auth.ts`, `lib/prisma.ts`)
4. Consider removing Prisma dependencies from `package.json` (optional cleanup)
5. Update README if needed to reflect database approach

## Files Changed Summary

**Created**:
- `lib/db-direct.ts` (~2000 lines)
- `lib/auth-direct.ts` (88 lines)
- `scripts/create-schema.py` (schema setup)
- Test files (temporary, removed after testing)

**Modified**:
- 17 API route files (all `/app/api/**/route.ts`)
- 5 page component files (all `/app/**/page.tsx`)
- `lib/statistics-calculator.ts` (statistics calculation)

**Can be removed after merge** (unused):
- `lib/auth.ts` (old Prisma auth, replaced by `lib/auth-direct.ts`)
- `lib/prisma.ts` (Prisma client instance, no longer used)

## Technical Details

### Database Schema (8 Tables)
1. **AppSettings** - PIN authentication settings
2. **Player** - Player profiles with equipment details
3. **Season** - Season management (25/26, 26/27, etc.)
4. **Fixture** - Match fixtures with opponents
5. **Game** - Individual 501 games (Best of 2 format)
6. **Leg** - Legs within games
7. **Visit** - 3-dart throws (granular scoring data)
8. **PlayerStatistics** - Aggregated statistics per player/season

### Statistics Tracked (18+ Metrics)
- Legs played/won
- 3-Dart Average
- First 9 Average
- Score distribution (60+, 80+, 100+, 120+, 140+, 170+, 180s)
- High Finish, 100+ Finishes
- Best/Worst Leg (darts)
- Checkout % and attempts
- Keep % (legs held when starting)
- Break % (legs won when not starting)

### Complex Features Preserved
- **Best of 2 Format**: Games consist of up to 2 legs (2-0, 0-2, or 1-1 draw)
- **Bust Detection**: Scores going below 0 or hitting 1 are busts
- **Checkout Detection**: Finishing exactly on 0
- **Automatic Second Leg**: Created when first leg completes
- **Game Completion Logic**: Determines winner or draw based on leg results
- **Undo Functionality**: Removes last visit and restores scores
- **Statistics Auto-Update**: Recalculates all stats after game completion
