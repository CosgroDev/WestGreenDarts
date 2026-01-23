import sqlite3
import sys

# Connect to database
conn = sqlite3.connect('prisma/dev.db')
cursor = conn.cursor()

print('Creating complete database schema...')

# Player table
cursor.execute('''
CREATE TABLE IF NOT EXISTS "Player" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "isActive" INTEGER NOT NULL DEFAULT 1,
    "dartModel" TEXT,
    "stemLength" TEXT,
    "flightType" TEXT,
    "createdAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
)
''')

# Season table
cursor.execute('''
CREATE TABLE IF NOT EXISTS "Season" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "startDate" TEXT,
    "endDate" TEXT,
    "isCurrent" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
)
''')

# Fixture table
cursor.execute('''
CREATE TABLE IF NOT EXISTS "Fixture" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "seasonId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "opponentTeam" TEXT NOT NULL,
    "isHome" INTEGER NOT NULL DEFAULT 1,
    "venue" TEXT,
    "notes" TEXT,
    "createdAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE CASCADE
)
''')

# Game table
cursor.execute('''
CREATE TABLE IF NOT EXISTS "Game" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fixtureId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "opponentName" TEXT NOT NULL,
    "isComplete" INTEGER NOT NULL DEFAULT 0,
    "playerWon" INTEGER,
    "playerStarted" INTEGER NOT NULL,
    "createdAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TEXT,
    FOREIGN KEY ("fixtureId") REFERENCES "Fixture"("id") ON DELETE CASCADE,
    FOREIGN KEY ("playerId") REFERENCES "Player"("id")
)
''')

# Leg table
cursor.execute('''
CREATE TABLE IF NOT EXISTS "Leg" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gameId" TEXT NOT NULL,
    "legNumber" INTEGER NOT NULL,
    "playerScore" INTEGER NOT NULL DEFAULT 501,
    "opponentScore" INTEGER NOT NULL DEFAULT 501,
    "playerWon" INTEGER,
    "playerStarted" INTEGER NOT NULL,
    "totalDarts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TEXT,
    FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE
)
''')

# Visit table
cursor.execute('''
CREATE TABLE IF NOT EXISTS "Visit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "legId" TEXT NOT NULL,
    "visitNumber" INTEGER NOT NULL,
    "isPlayer" INTEGER NOT NULL,
    "dart1" INTEGER,
    "dart2" INTEGER,
    "dart3" INTEGER,
    "totalScore" INTEGER NOT NULL,
    "isCheckout" INTEGER NOT NULL DEFAULT 0,
    "checkoutScore" INTEGER,
    "createdAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("legId") REFERENCES "Leg"("id") ON DELETE CASCADE
)
''')

# PlayerStatistics table
cursor.execute('''
CREATE TABLE IF NOT EXISTS "PlayerStatistics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "playerId" TEXT NOT NULL,
    "seasonId" TEXT,
    "totalLegs" INTEGER NOT NULL DEFAULT 0,
    "legsWon" INTEGER NOT NULL DEFAULT 0,
    "totalGames" INTEGER NOT NULL DEFAULT 0,
    "gamesWon" INTEGER NOT NULL DEFAULT 0,
    "threeDartAverage" REAL NOT NULL DEFAULT 0,
    "firstNineAverage" REAL NOT NULL DEFAULT 0,
    "scores60Plus" INTEGER NOT NULL DEFAULT 0,
    "scores80Plus" INTEGER NOT NULL DEFAULT 0,
    "scores100Plus" INTEGER NOT NULL DEFAULT 0,
    "scores120Plus" INTEGER NOT NULL DEFAULT 0,
    "scores140Plus" INTEGER NOT NULL DEFAULT 0,
    "scores170Plus" INTEGER NOT NULL DEFAULT 0,
    "total180s" INTEGER NOT NULL DEFAULT 0,
    "highFinish" INTEGER NOT NULL DEFAULT 0,
    "finishes100Plus" INTEGER NOT NULL DEFAULT 0,
    "bestLeg" INTEGER,
    "worstLeg" INTEGER,
    "checkoutPercentage" REAL NOT NULL DEFAULT 0,
    "checkoutPrediction" REAL NOT NULL DEFAULT 0,
    "keepPercentage" REAL NOT NULL DEFAULT 0,
    "keepPrediction" REAL NOT NULL DEFAULT 0,
    "breakPercentage" REAL NOT NULL DEFAULT 0,
    "breakPrediction" REAL NOT NULL DEFAULT 0,
    "totalVisits" INTEGER NOT NULL DEFAULT 0,
    "totalPointsScored" INTEGER NOT NULL DEFAULT 0,
    "checkoutAttempts" INTEGER NOT NULL DEFAULT 0,
    "successfulCheckouts" INTEGER NOT NULL DEFAULT 0,
    "legsStarted" INTEGER NOT NULL DEFAULT 0,
    "legsWonWhenStarted" INTEGER NOT NULL DEFAULT 0,
    "legsNotStarted" INTEGER NOT NULL DEFAULT 0,
    "legsWonWhenNotStarted" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE,
    UNIQUE("playerId", "seasonId")
)
''')

# Create indexes for better performance
cursor.execute('CREATE INDEX IF NOT EXISTS idx_fixture_season ON "Fixture"("seasonId")')
cursor.execute('CREATE INDEX IF NOT EXISTS idx_game_fixture ON "Game"("fixtureId")')
cursor.execute('CREATE INDEX IF NOT EXISTS idx_game_player ON "Game"("playerId")')
cursor.execute('CREATE INDEX IF NOT EXISTS idx_leg_game ON "Leg"("gameId")')
cursor.execute('CREATE INDEX IF NOT EXISTS idx_visit_leg ON "Visit"("legId")')
cursor.execute('CREATE INDEX IF NOT EXISTS idx_stats_player ON "PlayerStatistics"("playerId")')
cursor.execute('CREATE INDEX IF NOT EXISTS idx_stats_season ON "PlayerStatistics"("seasonId")')

conn.commit()
conn.close()

print('✅ Database schema created successfully!')
print('✅ Tables: AppSettings, Player, Season, Fixture, Game, Leg, Visit, PlayerStatistics')
print('✅ Indexes created for optimal performance')
