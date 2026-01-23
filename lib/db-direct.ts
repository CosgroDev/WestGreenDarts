/**
 * Direct Database Access Library
 * Provides type-safe database operations using better-sqlite3
 */

import Database from 'better-sqlite3'
import { join } from 'path'

const dbPath = join(process.cwd(), 'prisma', 'dev.db')

function getDb() {
  return new Database(dbPath)
}

// Helper to generate UUID
function generateId(): string {
  return crypto.randomUUID()
}

// Helper to get current ISO timestamp
function now(): string {
  return new Date().toISOString()
}

// ============================================================================
// PLAYERS
// ============================================================================

export interface Player {
  id: string
  name: string
  avatarUrl: string | null
  isActive: boolean
  dartModel: string | null
  stemLength: string | null
  flightType: string | null
  createdAt: string
  updatedAt: string
}

export function getAllPlayers(): Player[] {
  const db = getDb()
  try {
    const rows = db.prepare('SELECT * FROM Player ORDER BY name').all()
    return rows.map(row => ({
      ...row,
      isActive: Boolean(row.isActive),
    })) as Player[]
  } finally {
    db.close()
  }
}

export function getPlayerById(id: string): Player | null {
  const db = getDb()
  try {
    const row = db.prepare('SELECT * FROM Player WHERE id = ?').get(id)
    if (!row) return null
    return {
      ...row,
      isActive: Boolean(row.isActive),
    } as Player
  } finally {
    db.close()
  }
}

export function createPlayer(data: {
  name: string
  avatarUrl?: string
  dartModel?: string
  stemLength?: string
  flightType?: string
}): Player {
  const db = getDb()
  try {
    const id = generateId()
    const timestamp = now()

    db.prepare(`
      INSERT INTO Player (id, name, avatarUrl, isActive, dartModel, stemLength, flightType, createdAt, updatedAt)
      VALUES (?, ?, ?, 1, ?, ?, ?, ?, ?)
    `).run(
      id,
      data.name,
      data.avatarUrl || null,
      data.dartModel || null,
      data.stemLength || null,
      data.flightType || null,
      timestamp,
      timestamp
    )

    return getPlayerById(id)!
  } finally {
    db.close()
  }
}

export function updatePlayer(id: string, data: Partial<Omit<Player, 'id' | 'createdAt'>>): Player {
  const db = getDb()
  try {
    const updates: string[] = []
    const values: any[] = []

    if (data.name !== undefined) {
      updates.push('name = ?')
      values.push(data.name)
    }
    if (data.avatarUrl !== undefined) {
      updates.push('avatarUrl = ?')
      values.push(data.avatarUrl)
    }
    if (data.isActive !== undefined) {
      updates.push('isActive = ?')
      values.push(data.isActive ? 1 : 0)
    }
    if (data.dartModel !== undefined) {
      updates.push('dartModel = ?')
      values.push(data.dartModel)
    }
    if (data.stemLength !== undefined) {
      updates.push('stemLength = ?')
      values.push(data.stemLength)
    }
    if (data.flightType !== undefined) {
      updates.push('flightType = ?')
      values.push(data.flightType)
    }

    updates.push('updatedAt = ?')
    values.push(now())
    values.push(id)

    db.prepare(`UPDATE Player SET ${updates.join(', ')} WHERE id = ?`).run(...values)

    return getPlayerById(id)!
  } finally {
    db.close()
  }
}

export function deletePlayer(id: string): void {
  const db = getDb()
  try {
    db.prepare('DELETE FROM Player WHERE id = ?').run(id)
  } finally {
    db.close()
  }
}

// ============================================================================
// SEASONS
// ============================================================================

export interface Season {
  id: string
  name: string
  startDate: string | null
  endDate: string | null
  isCurrent: boolean
  createdAt: string
  updatedAt: string
}

export function getAllSeasons(): Season[] {
  const db = getDb()
  try {
    const rows = db.prepare('SELECT * FROM Season ORDER BY createdAt DESC').all()
    return rows.map(row => ({
      ...row,
      isCurrent: Boolean(row.isCurrent),
    })) as Season[]
  } finally {
    db.close()
  }
}

export function getCurrentSeason(): Season | null {
  const db = getDb()
  try {
    const row = db.prepare('SELECT * FROM Season WHERE isCurrent = 1 LIMIT 1').get()
    if (!row) return null
    return {
      ...row,
      isCurrent: Boolean(row.isCurrent),
    } as Season
  } finally {
    db.close()
  }
}

export function getSeasonById(id: string): Season | null {
  const db = getDb()
  try {
    const row = db.prepare('SELECT * FROM Season WHERE id = ?').get(id)
    if (!row) return null
    return {
      ...row,
      isCurrent: Boolean(row.isCurrent),
    } as Season
  } finally {
    db.close()
  }
}

export function createSeason(data: {
  name: string
  startDate?: string
  endDate?: string
  isCurrent?: boolean
}): Season {
  const db = getDb()
  try {
    const id = generateId()
    const timestamp = now()

    // If setting as current, unset all others first
    if (data.isCurrent) {
      db.prepare('UPDATE Season SET isCurrent = 0, updatedAt = ?').run(timestamp)
    }

    db.prepare(`
      INSERT INTO Season (id, name, startDate, endDate, isCurrent, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      data.name,
      data.startDate || null,
      data.endDate || null,
      data.isCurrent ? 1 : 0,
      timestamp,
      timestamp
    )

    return getSeasonById(id)!
  } finally {
    db.close()
  }
}

export function updateSeason(id: string, data: Partial<Omit<Season, 'id' | 'createdAt'>>): Season {
  const db = getDb()
  try {
    const timestamp = now()

    // If setting as current, unset all others first
    if (data.isCurrent) {
      db.prepare('UPDATE Season SET isCurrent = 0, updatedAt = ?').run(timestamp)
    }

    const updates: string[] = []
    const values: any[] = []

    if (data.name !== undefined) {
      updates.push('name = ?')
      values.push(data.name)
    }
    if (data.startDate !== undefined) {
      updates.push('startDate = ?')
      values.push(data.startDate)
    }
    if (data.endDate !== undefined) {
      updates.push('endDate = ?')
      values.push(data.endDate)
    }
    if (data.isCurrent !== undefined) {
      updates.push('isCurrent = ?')
      values.push(data.isCurrent ? 1 : 0)
    }

    updates.push('updatedAt = ?')
    values.push(timestamp)
    values.push(id)

    db.prepare(`UPDATE Season SET ${updates.join(', ')} WHERE id = ?`).run(...values)

    return getSeasonById(id)!
  } finally {
    db.close()
  }
}

export function deleteSeason(id: string): void {
  const db = getDb()
  try {
    db.prepare('DELETE FROM Season WHERE id = ?').run(id)
  } finally {
    db.close()
  }
}

export interface SeasonWithFixtureCount extends Season {
  _count: {
    fixtures: number
  }
}

export function getAllSeasonsWithFixtureCount(): SeasonWithFixtureCount[] {
  const db = getDb()
  try {
    const rows = db.prepare(`
      SELECT
        s.*,
        COUNT(f.id) as fixtureCount
      FROM Season s
      LEFT JOIN Fixture f ON s.id = f.seasonId
      GROUP BY s.id
      ORDER BY s.createdAt DESC
    `).all()

    return rows.map(row => ({
      id: row.id,
      name: row.name,
      startDate: row.startDate,
      endDate: row.endDate,
      isCurrent: Boolean(row.isCurrent),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      _count: {
        fixtures: row.fixtureCount || 0
      }
    })) as SeasonWithFixtureCount[]
  } finally {
    db.close()
  }
}

export interface SeasonWithFixtures extends Season {
  fixtures: Fixture[]
}

export function getSeasonWithFixtures(id: string): SeasonWithFixtures | null {
  const db = getDb()
  try {
    const season = getSeasonById(id)
    if (!season) return null

    const fixtures = db.prepare('SELECT * FROM Fixture WHERE seasonId = ? ORDER BY date ASC').all(id)

    return {
      ...season,
      fixtures: fixtures.map(row => ({
        ...row,
        isHome: Boolean(row.isHome),
      })) as Fixture[]
    }
  } finally {
    db.close()
  }
}

// ============================================================================
// FIXTURES
// ============================================================================

export interface Fixture {
  id: string
  seasonId: string
  date: string
  opponentTeam: string
  isHome: boolean
  venue: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface FixtureWithSeason extends Fixture {
  season: Season
}

export function getAllFixtures(seasonId?: string): Fixture[] {
  const db = getDb()
  try {
    let query = 'SELECT * FROM Fixture'
    let params: any[] = []

    if (seasonId) {
      query += ' WHERE seasonId = ?'
      params.push(seasonId)
    }

    query += ' ORDER BY date DESC'

    const rows = db.prepare(query).all(...params)
    return rows.map(row => ({
      ...row,
      isHome: Boolean(row.isHome),
    })) as Fixture[]
  } finally {
    db.close()
  }
}

export function getFixtureById(id: string): FixtureWithSeason | null {
  const db = getDb()
  try {
    const fixture = db.prepare('SELECT * FROM Fixture WHERE id = ?').get(id)
    if (!fixture) return null

    const season = db.prepare('SELECT * FROM Season WHERE id = ?').get(fixture.seasonId)

    return {
      ...fixture,
      isHome: Boolean(fixture.isHome),
      season: {
        ...season,
        isCurrent: Boolean(season.isCurrent),
      },
    } as FixtureWithSeason
  } finally {
    db.close()
  }
}

export function createFixture(data: {
  seasonId: string
  date: string
  opponentTeam: string
  isHome?: boolean
  venue?: string
  notes?: string
}): Fixture {
  const db = getDb()
  try {
    const id = generateId()
    const timestamp = now()

    db.prepare(`
      INSERT INTO Fixture (id, seasonId, date, opponentTeam, isHome, venue, notes, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      data.seasonId,
      data.date,
      data.opponentTeam,
      data.isHome ? 1 : 0,
      data.venue || null,
      data.notes || null,
      timestamp,
      timestamp
    )

    const fixture = db.prepare('SELECT * FROM Fixture WHERE id = ?').get(id)
    return {
      ...fixture,
      isHome: Boolean(fixture.isHome),
    } as Fixture
  } finally {
    db.close()
  }
}

export function updateFixture(id: string, data: Partial<Omit<Fixture, 'id' | 'createdAt'>>): Fixture {
  const db = getDb()
  try {
    const updates: string[] = []
    const values: any[] = []

    if (data.date !== undefined) {
      updates.push('date = ?')
      values.push(data.date)
    }
    if (data.opponentTeam !== undefined) {
      updates.push('opponentTeam = ?')
      values.push(data.opponentTeam)
    }
    if (data.isHome !== undefined) {
      updates.push('isHome = ?')
      values.push(data.isHome ? 1 : 0)
    }
    if (data.venue !== undefined) {
      updates.push('venue = ?')
      values.push(data.venue)
    }
    if (data.notes !== undefined) {
      updates.push('notes = ?')
      values.push(data.notes)
    }

    updates.push('updatedAt = ?')
    values.push(now())
    values.push(id)

    db.prepare(`UPDATE Fixture SET ${updates.join(', ')} WHERE id = ?`).run(...values)

    const fixture = db.prepare('SELECT * FROM Fixture WHERE id = ?').get(id)
    return {
      ...fixture,
      isHome: Boolean(fixture.isHome),
    } as Fixture
  } finally {
    db.close()
  }
}

export interface FixtureWithSeasonAndGameCount extends FixtureWithSeason {
  _count: {
    games: number
  }
}

export function getAllFixturesWithRelations(seasonId?: string): FixtureWithSeasonAndGameCount[] {
  const db = getDb()
  try {
    let query = `
      SELECT
        f.*,
        s.id as season_id,
        s.name as season_name,
        s.startDate as season_startDate,
        s.endDate as season_endDate,
        s.isCurrent as season_isCurrent,
        s.createdAt as season_createdAt,
        s.updatedAt as season_updatedAt,
        COUNT(g.id) as gameCount
      FROM Fixture f
      LEFT JOIN Season s ON f.seasonId = s.id
      LEFT JOIN Game g ON f.id = g.fixtureId
    `
    let params: any[] = []

    if (seasonId) {
      query += ' WHERE f.seasonId = ?'
      params.push(seasonId)
    }

    query += ' GROUP BY f.id ORDER BY f.date DESC'

    const rows = db.prepare(query).all(...params)

    return rows.map(row => ({
      id: row.id,
      seasonId: row.seasonId,
      date: row.date,
      opponentTeam: row.opponentTeam,
      isHome: Boolean(row.isHome),
      venue: row.venue,
      notes: row.notes,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      season: {
        id: row.season_id,
        name: row.season_name,
        startDate: row.season_startDate,
        endDate: row.season_endDate,
        isCurrent: Boolean(row.season_isCurrent),
        createdAt: row.season_createdAt,
        updatedAt: row.season_updatedAt,
      },
      _count: {
        games: row.gameCount || 0
      }
    })) as FixtureWithSeasonAndGameCount[]
  } finally {
    db.close()
  }
}

export interface FixtureWithGames extends FixtureWithSeason {
  games: Array<Game & { player: Player }>
}

export function getFixtureWithGames(id: string): FixtureWithGames | null {
  const db = getDb()
  try {
    const fixture = db.prepare('SELECT * FROM Fixture WHERE id = ?').get(id)
    if (!fixture) return null

    const season = db.prepare('SELECT * FROM Season WHERE id = ?').get(fixture.seasonId)

    const gamesRows = db.prepare(`
      SELECT
        g.*,
        p.id as player_id,
        p.name as player_name,
        p.avatarUrl as player_avatarUrl,
        p.isActive as player_isActive,
        p.dartModel as player_dartModel,
        p.stemLength as player_stemLength,
        p.flightType as player_flightType,
        p.createdAt as player_createdAt,
        p.updatedAt as player_updatedAt
      FROM Game g
      LEFT JOIN Player p ON g.playerId = p.id
      WHERE g.fixtureId = ?
      ORDER BY g.createdAt DESC
    `).all(id)

    const games = gamesRows.map(row => ({
      id: row.id,
      fixtureId: row.fixtureId,
      playerId: row.playerId,
      opponentName: row.opponentName,
      isComplete: Boolean(row.isComplete),
      playerWon: row.playerWon !== null ? Boolean(row.playerWon) : null,
      playerStarted: Boolean(row.playerStarted),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      completedAt: row.completedAt,
      player: {
        id: row.player_id,
        name: row.player_name,
        avatarUrl: row.player_avatarUrl,
        isActive: Boolean(row.player_isActive),
        dartModel: row.player_dartModel,
        stemLength: row.player_stemLength,
        flightType: row.player_flightType,
        createdAt: row.player_createdAt,
        updatedAt: row.player_updatedAt,
      }
    }))

    return {
      ...fixture,
      isHome: Boolean(fixture.isHome),
      season: {
        ...season,
        isCurrent: Boolean(season.isCurrent),
      },
      games
    } as FixtureWithGames
  } finally {
    db.close()
  }
}

export function createFixtureWithSeason(data: {
  seasonId: string
  date: string
  opponentTeam: string
  isHome?: boolean
  venue?: string
  notes?: string
}): FixtureWithSeason {
  const db = getDb()
  try {
    const id = generateId()
    const timestamp = now()

    db.prepare(`
      INSERT INTO Fixture (id, seasonId, date, opponentTeam, isHome, venue, notes, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      data.seasonId,
      data.date,
      data.opponentTeam,
      data.isHome ? 1 : 0,
      data.venue || null,
      data.notes || null,
      timestamp,
      timestamp
    )

    return getFixtureById(id)!
  } finally {
    db.close()
  }
}

export function updateFixtureWithSeason(id: string, data: Partial<Omit<Fixture, 'id' | 'createdAt'>>): FixtureWithSeason {
  const db = getDb()
  try {
    const updates: string[] = []
    const values: any[] = []

    if (data.seasonId !== undefined) {
      updates.push('seasonId = ?')
      values.push(data.seasonId)
    }
    if (data.date !== undefined) {
      updates.push('date = ?')
      values.push(data.date)
    }
    if (data.opponentTeam !== undefined) {
      updates.push('opponentTeam = ?')
      values.push(data.opponentTeam)
    }
    if (data.isHome !== undefined) {
      updates.push('isHome = ?')
      values.push(data.isHome ? 1 : 0)
    }
    if (data.venue !== undefined) {
      updates.push('venue = ?')
      values.push(data.venue)
    }
    if (data.notes !== undefined) {
      updates.push('notes = ?')
      values.push(data.notes)
    }

    updates.push('updatedAt = ?')
    values.push(now())
    values.push(id)

    db.prepare(`UPDATE Fixture SET ${updates.join(', ')} WHERE id = ?`).run(...values)

    return getFixtureById(id)!
  } finally {
    db.close()
  }
}

export function deleteFixture(id: string): void {
  const db = getDb()
  try {
    db.prepare('DELETE FROM Fixture WHERE id = ?').run(id)
  } finally {
    db.close()
  }
}

// ============================================================================
// GAMES
// ============================================================================

export interface Game {
  id: string
  fixtureId: string
  playerId: string
  opponentName: string
  isComplete: boolean
  playerWon: boolean | null
  playerStarted: boolean
  createdAt: string
  updatedAt: string
  completedAt: string | null
}

export interface GameWithRelations extends Game {
  player: Player
  fixture: FixtureWithSeason
  legs: Leg[]
}

export function getGameById(id: string): GameWithRelations | null {
  const db = getDb()
  try {
    const game = db.prepare('SELECT * FROM Game WHERE id = ?').get(id)
    if (!game) return null

    const player = db.prepare('SELECT * FROM Player WHERE id = ?').get(game.playerId)
    const fixture = db.prepare('SELECT * FROM Fixture WHERE id = ?').get(game.fixtureId)
    const season = db.prepare('SELECT * FROM Season WHERE id = ?').get(fixture.seasonId)
    const legs = db.prepare('SELECT * FROM Leg WHERE gameId = ? ORDER BY legNumber').all(id)

    return {
      ...game,
      isComplete: Boolean(game.isComplete),
      playerStarted: Boolean(game.playerStarted),
      playerWon: game.playerWon === null ? null : Boolean(game.playerWon),
      player: {
        ...player,
        isActive: Boolean(player.isActive),
      },
      fixture: {
        ...fixture,
        isHome: Boolean(fixture.isHome),
        season: {
          ...season,
          isCurrent: Boolean(season.isCurrent),
        },
      },
      legs: legs.map(leg => ({
        ...leg,
        playerStarted: Boolean(leg.playerStarted),
        playerWon: leg.playerWon === null ? null : Boolean(leg.playerWon),
      })),
    } as GameWithRelations
  } finally {
    db.close()
  }
}

export function createGame(data: {
  fixtureId: string
  playerId: string
  opponentName: string
  playerStarted: boolean
}): Game {
  const db = getDb()
  try {
    const id = generateId()
    const timestamp = now()

    db.prepare(`
      INSERT INTO Game (id, fixtureId, playerId, opponentName, isComplete, playerWon, playerStarted, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, 0, NULL, ?, ?, ?)
    `).run(
      id,
      data.fixtureId,
      data.playerId,
      data.opponentName,
      data.playerStarted ? 1 : 0,
      timestamp,
      timestamp
    )

    const game = db.prepare('SELECT * FROM Game WHERE id = ?').get(id)
    return {
      ...game,
      isComplete: Boolean(game.isComplete),
      playerStarted: Boolean(game.playerStarted),
      playerWon: null,
    } as Game
  } finally {
    db.close()
  }
}

export function updateGame(id: string, data: Partial<Omit<Game, 'id' | 'createdAt'>>): Game {
  const db = getDb()
  try {
    const updates: string[] = []
    const values: any[] = []

    if (data.isComplete !== undefined) {
      updates.push('isComplete = ?')
      values.push(data.isComplete ? 1 : 0)
    }
    if (data.playerWon !== undefined) {
      updates.push('playerWon = ?')
      values.push(data.playerWon === null ? null : (data.playerWon ? 1 : 0))
    }
    if (data.completedAt !== undefined) {
      updates.push('completedAt = ?')
      values.push(data.completedAt)
    }

    updates.push('updatedAt = ?')
    values.push(now())
    values.push(id)

    db.prepare(`UPDATE Game SET ${updates.join(', ')} WHERE id = ?`).run(...values)

    const game = db.prepare('SELECT * FROM Game WHERE id = ?').get(id)
    return {
      ...game,
      isComplete: Boolean(game.isComplete),
      playerStarted: Boolean(game.playerStarted),
      playerWon: game.playerWon === null ? null : Boolean(game.playerWon),
    } as Game
  } finally {
    db.close()
  }
}

export function getAllGamesWithRelations(fixtureId?: string): GameWithRelations[] {
  const db = getDb()
  try {
    let query = `
      SELECT
        g.*,
        p.id as player_id,
        p.name as player_name,
        p.avatarUrl as player_avatarUrl,
        p.isActive as player_isActive,
        p.dartModel as player_dartModel,
        p.stemLength as player_stemLength,
        p.flightType as player_flightType,
        p.createdAt as player_createdAt,
        p.updatedAt as player_updatedAt,
        f.id as fixture_id,
        f.seasonId as fixture_seasonId,
        f.date as fixture_date,
        f.opponentTeam as fixture_opponentTeam,
        f.isHome as fixture_isHome,
        f.venue as fixture_venue,
        f.notes as fixture_notes,
        f.createdAt as fixture_createdAt,
        f.updatedAt as fixture_updatedAt,
        s.id as season_id,
        s.name as season_name,
        s.startDate as season_startDate,
        s.endDate as season_endDate,
        s.isCurrent as season_isCurrent,
        s.createdAt as season_createdAt,
        s.updatedAt as season_updatedAt
      FROM Game g
      LEFT JOIN Player p ON g.playerId = p.id
      LEFT JOIN Fixture f ON g.fixtureId = f.id
      LEFT JOIN Season s ON f.seasonId = s.id
    `

    let params: any[] = []
    if (fixtureId) {
      query += ' WHERE g.fixtureId = ?'
      params.push(fixtureId)
    }

    query += ' ORDER BY g.createdAt DESC'

    const gameRows = db.prepare(query).all(...params)

    return gameRows.map(row => {
      const gameId = row.id
      const legs = db.prepare('SELECT * FROM Leg WHERE gameId = ? ORDER BY legNumber').all(gameId)

      return {
        id: row.id,
        fixtureId: row.fixtureId,
        playerId: row.playerId,
        opponentName: row.opponentName,
        isComplete: Boolean(row.isComplete),
        playerWon: row.playerWon === null ? null : Boolean(row.playerWon),
        playerStarted: Boolean(row.playerStarted),
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        completedAt: row.completedAt,
        player: {
          id: row.player_id,
          name: row.player_name,
          avatarUrl: row.player_avatarUrl,
          isActive: Boolean(row.player_isActive),
          dartModel: row.player_dartModel,
          stemLength: row.player_stemLength,
          flightType: row.player_flightType,
          createdAt: row.player_createdAt,
          updatedAt: row.player_updatedAt,
        },
        fixture: {
          id: row.fixture_id,
          seasonId: row.fixture_seasonId,
          date: row.fixture_date,
          opponentTeam: row.fixture_opponentTeam,
          isHome: Boolean(row.fixture_isHome),
          venue: row.fixture_venue,
          notes: row.fixture_notes,
          createdAt: row.fixture_createdAt,
          updatedAt: row.fixture_updatedAt,
          season: {
            id: row.season_id,
            name: row.season_name,
            startDate: row.season_startDate,
            endDate: row.season_endDate,
            isCurrent: Boolean(row.season_isCurrent),
            createdAt: row.season_createdAt,
            updatedAt: row.season_updatedAt,
          }
        },
        legs: legs.map(leg => ({
          ...leg,
          playerStarted: Boolean(leg.playerStarted),
          playerWon: leg.playerWon === null ? null : Boolean(leg.playerWon),
        }))
      }
    }) as GameWithRelations[]
  } finally {
    db.close()
  }
}

export interface GameWithFullDetails extends Game {
  player: Player
  legs: LegWithVisits[]
}

export function getGameWithFullDetails(id: string): GameWithFullDetails | null {
  const db = getDb()
  try {
    const game = db.prepare('SELECT * FROM Game WHERE id = ?').get(id)
    if (!game) return null

    const player = db.prepare('SELECT * FROM Player WHERE id = ?').get(game.playerId)
    const legRows = db.prepare('SELECT * FROM Leg WHERE gameId = ? ORDER BY legNumber').all(id)

    const legs = legRows.map((leg: any) => {
      const visits = db.prepare('SELECT * FROM Visit WHERE legId = ? ORDER BY visitNumber').all(leg.id)
      return {
        ...leg,
        playerStarted: Boolean(leg.playerStarted),
        playerWon: leg.playerWon === null ? null : Boolean(leg.playerWon),
        visits: visits.map((visit: any) => ({
          ...visit,
          isPlayer: Boolean(visit.isPlayer),
          isCheckout: Boolean(visit.isCheckout),
        }))
      }
    })

    return {
      ...game,
      isComplete: Boolean(game.isComplete),
      playerStarted: Boolean(game.playerStarted),
      playerWon: game.playerWon === null ? null : Boolean(game.playerWon),
      player: {
        ...player,
        isActive: Boolean(player.isActive),
      },
      legs
    } as GameWithFullDetails
  } finally {
    db.close()
  }
}

export function createGameWithFirstLeg(data: {
  fixtureId: string
  playerId: string
  opponentName: string
  playerStarted: boolean
}): GameWithFullDetails {
  const db = getDb()
  try {
    const gameId = generateId()
    const timestamp = now()

    // Create game
    db.prepare(`
      INSERT INTO Game (id, fixtureId, playerId, opponentName, isComplete, playerWon, playerStarted, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, 0, NULL, ?, ?, ?)
    `).run(
      gameId,
      data.fixtureId,
      data.playerId,
      data.opponentName,
      data.playerStarted ? 1 : 0,
      timestamp,
      timestamp
    )

    // Create first leg
    const legId = generateId()
    db.prepare(`
      INSERT INTO Leg (id, gameId, legNumber, playerScore, opponentScore, playerWon, playerStarted, totalDarts, createdAt, updatedAt)
      VALUES (?, ?, 1, 501, 501, NULL, ?, 0, ?, ?)
    `).run(
      legId,
      gameId,
      data.playerStarted ? 1 : 0,
      timestamp,
      timestamp
    )

    return getGameWithFullDetails(gameId)!
  } finally {
    db.close()
  }
}

export function deleteGame(id: string): void {
  const db = getDb()
  try {
    db.prepare('DELETE FROM Game WHERE id = ?').run(id)
  } finally {
    db.close()
  }
}

export interface GameWithLegsAndVisits {
  id: string
  playerId: string
  fixtureId: string
  opponentName: string
  isComplete: boolean
  playerWon: boolean | null
  playerStarted: boolean
  createdAt: string
  updatedAt: string
  completedAt: string | null
  legs: Array<{
    id: string
    gameId: string
    legNumber: number
    playerScore: number
    opponentScore: number
    playerWon: boolean | null
    playerStarted: boolean
    totalDarts: number
    createdAt: string
    updatedAt: string
    completedAt: string | null
    visits: Array<{
      id: string
      legId: string
      visitNumber: number
      isPlayer: boolean
      dart1: number | null
      dart2: number | null
      dart3: number | null
      totalScore: number
      isCheckout: boolean
      checkoutScore: number | null
      createdAt: string
    }>
  }>
}

export function getCompletedGamesForPlayer(playerId: string): GameWithLegsAndVisits[] {
  const db = getDb()
  try {
    const games = db.prepare('SELECT * FROM Game WHERE playerId = ? AND isComplete = 1').all(playerId)

    return games.map((game: any) => {
      const legs = db.prepare('SELECT * FROM Leg WHERE gameId = ? ORDER BY legNumber').all(game.id)

      const legsWithVisits = legs.map((leg: any) => {
        const visits = db.prepare('SELECT * FROM Visit WHERE legId = ? ORDER BY visitNumber').all(leg.id)

        return {
          ...leg,
          playerStarted: Boolean(leg.playerStarted),
          playerWon: leg.playerWon === null ? null : Boolean(leg.playerWon),
          visits: visits.map((visit: any) => ({
            ...visit,
            isPlayer: Boolean(visit.isPlayer),
            isCheckout: Boolean(visit.isCheckout),
          }))
        }
      })

      return {
        ...game,
        isComplete: Boolean(game.isComplete),
        playerStarted: Boolean(game.playerStarted),
        playerWon: game.playerWon === null ? null : Boolean(game.playerWon),
        legs: legsWithVisits
      }
    }) as GameWithLegsAndVisits[]
  } finally {
    db.close()
  }
}

export function getGameWithFixtureAndSeason(gameId: string): any {
  const db = getDb()
  try {
    const game = db.prepare('SELECT * FROM Game WHERE id = ?').get(gameId)
    if (!game) return null

    const fixture = db.prepare('SELECT * FROM Fixture WHERE id = ?').get(game.fixtureId)
    const season = fixture ? db.prepare('SELECT * FROM Season WHERE id = ?').get(fixture.seasonId) : null

    const legs = db.prepare('SELECT * FROM Leg WHERE gameId = ? ORDER BY legNumber').all(gameId)
    const legsWithVisits = legs.map((leg: any) => {
      const visits = db.prepare('SELECT * FROM Visit WHERE legId = ? ORDER BY visitNumber').all(leg.id)
      return {
        ...leg,
        playerStarted: Boolean(leg.playerStarted),
        playerWon: leg.playerWon === null ? null : Boolean(leg.playerWon),
        visits: visits.map((visit: any) => ({
          ...visit,
          isPlayer: Boolean(visit.isPlayer),
          isCheckout: Boolean(visit.isCheckout),
        }))
      }
    })

    return {
      ...game,
      isComplete: Boolean(game.isComplete),
      playerStarted: Boolean(game.playerStarted),
      playerWon: game.playerWon === null ? null : Boolean(game.playerWon),
      legs: legsWithVisits,
      fixture: {
        ...fixture,
        isHome: Boolean(fixture?.isHome),
        season: season ? {
          ...season,
          isCurrent: Boolean(season.isCurrent),
        } : null
      }
    }
  } finally {
    db.close()
  }
}

// ============================================================================
// LEGS
// ============================================================================

export interface Leg {
  id: string
  gameId: string
  legNumber: number
  playerScore: number
  opponentScore: number
  playerWon: boolean | null
  playerStarted: boolean
  totalDarts: number
  createdAt: string
  updatedAt: string
  completedAt: string | null
}

export interface LegWithVisits extends Leg {
  visits: Visit[]
}

export function getLegById(id: string): LegWithVisits | null {
  const db = getDb()
  try {
    const leg = db.prepare('SELECT * FROM Leg WHERE id = ?').get(id)
    if (!leg) return null

    const visits = db.prepare('SELECT * FROM Visit WHERE legId = ? ORDER BY visitNumber').all(id)

    return {
      ...leg,
      playerStarted: Boolean(leg.playerStarted),
      playerWon: leg.playerWon === null ? null : Boolean(leg.playerWon),
      visits: visits.map(visit => ({
        ...visit,
        isPlayer: Boolean(visit.isPlayer),
        isCheckout: Boolean(visit.isCheckout),
      })),
    } as LegWithVisits
  } finally {
    db.close()
  }
}

export function getLegsForGame(gameId: string): Leg[] {
  const db = getDb()
  try {
    const legs = db.prepare('SELECT * FROM Leg WHERE gameId = ? ORDER BY legNumber').all(gameId)
    return legs.map(leg => ({
      ...leg,
      playerStarted: Boolean(leg.playerStarted),
      playerWon: leg.playerWon === null ? null : Boolean(leg.playerWon),
    })) as Leg[]
  } finally {
    db.close()
  }
}

export function createLeg(data: {
  gameId: string
  legNumber: number
  playerStarted: boolean
}): Leg {
  const db = getDb()
  try {
    const id = generateId()
    const timestamp = now()

    db.prepare(`
      INSERT INTO Leg (id, gameId, legNumber, playerScore, opponentScore, playerWon, playerStarted, totalDarts, createdAt, updatedAt)
      VALUES (?, ?, ?, 501, 501, NULL, ?, 0, ?, ?)
    `).run(
      id,
      data.gameId,
      data.legNumber,
      data.playerStarted ? 1 : 0,
      timestamp,
      timestamp
    )

    const leg = db.prepare('SELECT * FROM Leg WHERE id = ?').get(id)
    return {
      ...leg,
      playerStarted: Boolean(leg.playerStarted),
      playerWon: null,
    } as Leg
  } finally {
    db.close()
  }
}

export function updateLeg(id: string, data: Partial<Omit<Leg, 'id' | 'createdAt' | 'gameId' | 'legNumber'>>): Leg {
  const db = getDb()
  try {
    const updates: string[] = []
    const values: any[] = []

    if (data.playerScore !== undefined) {
      updates.push('playerScore = ?')
      values.push(data.playerScore)
    }
    if (data.opponentScore !== undefined) {
      updates.push('opponentScore = ?')
      values.push(data.opponentScore)
    }
    if (data.playerWon !== undefined) {
      updates.push('playerWon = ?')
      values.push(data.playerWon === null ? null : (data.playerWon ? 1 : 0))
    }
    if (data.totalDarts !== undefined) {
      updates.push('totalDarts = ?')
      values.push(data.totalDarts)
    }
    if (data.completedAt !== undefined) {
      updates.push('completedAt = ?')
      values.push(data.completedAt)
    }

    updates.push('updatedAt = ?')
    values.push(now())
    values.push(id)

    db.prepare(`UPDATE Leg SET ${updates.join(', ')} WHERE id = ?`).run(...values)

    const leg = db.prepare('SELECT * FROM Leg WHERE id = ?').get(id)
    return {
      ...leg,
      playerStarted: Boolean(leg.playerStarted),
      playerWon: leg.playerWon === null ? null : Boolean(leg.playerWon),
    } as Leg
  } finally {
    db.close()
  }
}

export function deleteLeg(id: string): void {
  const db = getDb()
  try {
    db.prepare('DELETE FROM Leg WHERE id = ?').run(id)
  } finally {
    db.close()
  }
}

// ============================================================================
// VISITS
// ============================================================================

export interface Visit {
  id: string
  legId: string
  visitNumber: number
  isPlayer: boolean
  dart1: number | null
  dart2: number | null
  dart3: number | null
  totalScore: number
  isCheckout: boolean
  checkoutScore: number | null
  createdAt: string
}

export function getVisitsForLeg(legId: string): Visit[] {
  const db = getDb()
  try {
    const visits = db.prepare('SELECT * FROM Visit WHERE legId = ? ORDER BY visitNumber').all(legId)
    return visits.map(visit => ({
      ...visit,
      isPlayer: Boolean(visit.isPlayer),
      isCheckout: Boolean(visit.isCheckout),
    })) as Visit[]
  } finally {
    db.close()
  }
}

export function createVisit(data: {
  legId: string
  visitNumber: number
  isPlayer: boolean
  dart1?: number
  dart2?: number
  dart3?: number
  totalScore: number
  isCheckout?: boolean
  checkoutScore?: number
}): Visit {
  const db = getDb()
  try {
    const id = generateId()
    const timestamp = now()

    db.prepare(`
      INSERT INTO Visit (id, legId, visitNumber, isPlayer, dart1, dart2, dart3, totalScore, isCheckout, checkoutScore, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      data.legId,
      data.visitNumber,
      data.isPlayer ? 1 : 0,
      data.dart1 || null,
      data.dart2 || null,
      data.dart3 || null,
      data.totalScore,
      data.isCheckout ? 1 : 0,
      data.checkoutScore || null,
      timestamp
    )

    const visit = db.prepare('SELECT * FROM Visit WHERE id = ?').get(id)
    return {
      ...visit,
      isPlayer: Boolean(visit.isPlayer),
      isCheckout: Boolean(visit.isCheckout),
    } as Visit
  } finally {
    db.close()
  }
}

export function deleteLastVisit(legId: string): void {
  const db = getDb()
  try {
    db.prepare(`
      DELETE FROM Visit
      WHERE id = (
        SELECT id FROM Visit
        WHERE legId = ?
        ORDER BY visitNumber DESC
        LIMIT 1
      )
    `).run(legId)
  } finally {
    db.close()
  }
}

export function deleteVisit(id: string): void {
  const db = getDb()
  try {
    db.prepare('DELETE FROM Visit WHERE id = ?').run(id)
  } finally {
    db.close()
  }
}

// ============================================================================
// PLAYER STATISTICS
// ============================================================================

export interface PlayerStatistics {
  id: string
  playerId: string
  seasonId: string | null
  totalLegs: number
  legsWon: number
  totalGames: number
  gamesWon: number
  threeDartAverage: number
  firstNineAverage: number
  scores60Plus: number
  scores80Plus: number
  scores100Plus: number
  scores120Plus: number
  scores140Plus: number
  scores170Plus: number
  total180s: number
  highFinish: number
  finishes100Plus: number
  bestLeg: number | null
  worstLeg: number | null
  checkoutPercentage: number
  checkoutPrediction: number
  keepPercentage: number
  keepPrediction: number
  breakPercentage: number
  breakPrediction: number
  totalVisits: number
  totalPointsScored: number
  checkoutAttempts: number
  successfulCheckouts: number
  legsStarted: number
  legsWonWhenStarted: number
  legsNotStarted: number
  legsWonWhenNotStarted: number
  createdAt: string
  updatedAt: string
}

export function getPlayerStatistics(playerId: string, seasonId: string | null = null): PlayerStatistics | null {
  const db = getDb()
  try {
    let query = 'SELECT * FROM PlayerStatistics WHERE playerId = ?'
    const params: any[] = [playerId]

    if (seasonId === null) {
      query += ' AND seasonId IS NULL'
    } else {
      query += ' AND seasonId = ?'
      params.push(seasonId)
    }

    const row = db.prepare(query).get(...params)
    return row as PlayerStatistics | null
  } finally {
    db.close()
  }
}

export function getAllPlayerStatistics(seasonId: string | null = null): PlayerStatistics[] {
  const db = getDb()
  try {
    let query = 'SELECT * FROM PlayerStatistics WHERE '

    if (seasonId === null) {
      query += 'seasonId IS NULL'
    } else {
      query += 'seasonId = ?'
    }

    const rows = seasonId === null
      ? db.prepare(query).all()
      : db.prepare(query).all(seasonId)

    return rows as PlayerStatistics[]
  } finally {
    db.close()
  }
}

export function upsertPlayerStatistics(data: Omit<PlayerStatistics, 'id' | 'createdAt' | 'updatedAt'>): PlayerStatistics {
  const db = getDb()
  try {
    const timestamp = now()

    // Check if exists
    const existing = getPlayerStatistics(data.playerId, data.seasonId)

    if (existing) {
      // Update
      db.prepare(`
        UPDATE PlayerStatistics SET
          totalLegs = ?, legsWon = ?, totalGames = ?, gamesWon = ?,
          threeDartAverage = ?, firstNineAverage = ?,
          scores60Plus = ?, scores80Plus = ?, scores100Plus = ?, scores120Plus = ?,
          scores140Plus = ?, scores170Plus = ?, total180s = ?,
          highFinish = ?, finishes100Plus = ?, bestLeg = ?, worstLeg = ?,
          checkoutPercentage = ?, checkoutPrediction = ?,
          keepPercentage = ?, keepPrediction = ?,
          breakPercentage = ?, breakPrediction = ?,
          totalVisits = ?, totalPointsScored = ?,
          checkoutAttempts = ?, successfulCheckouts = ?,
          legsStarted = ?, legsWonWhenStarted = ?,
          legsNotStarted = ?, legsWonWhenNotStarted = ?,
          updatedAt = ?
        WHERE id = ?
      `).run(
        data.totalLegs, data.legsWon, data.totalGames, data.gamesWon,
        data.threeDartAverage, data.firstNineAverage,
        data.scores60Plus, data.scores80Plus, data.scores100Plus, data.scores120Plus,
        data.scores140Plus, data.scores170Plus, data.total180s,
        data.highFinish, data.finishes100Plus, data.bestLeg, data.worstLeg,
        data.checkoutPercentage, data.checkoutPrediction,
        data.keepPercentage, data.keepPrediction,
        data.breakPercentage, data.breakPrediction,
        data.totalVisits, data.totalPointsScored,
        data.checkoutAttempts, data.successfulCheckouts,
        data.legsStarted, data.legsWonWhenStarted,
        data.legsNotStarted, data.legsWonWhenNotStarted,
        timestamp,
        existing.id
      )

      return getPlayerStatistics(data.playerId, data.seasonId)!
    } else {
      // Insert
      const id = generateId()

      db.prepare(`
        INSERT INTO PlayerStatistics (
          id, playerId, seasonId,
          totalLegs, legsWon, totalGames, gamesWon,
          threeDartAverage, firstNineAverage,
          scores60Plus, scores80Plus, scores100Plus, scores120Plus,
          scores140Plus, scores170Plus, total180s,
          highFinish, finishes100Plus, bestLeg, worstLeg,
          checkoutPercentage, checkoutPrediction,
          keepPercentage, keepPrediction,
          breakPercentage, breakPrediction,
          totalVisits, totalPointsScored,
          checkoutAttempts, successfulCheckouts,
          legsStarted, legsWonWhenStarted,
          legsNotStarted, legsWonWhenNotStarted,
          createdAt, updatedAt
        ) VALUES (
          ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?,
          ?, ?,
          ?, ?,
          ?, ?,
          ?, ?,
          ?, ?,
          ?, ?,
          ?, ?
        )
      `).run(
        id, data.playerId, data.seasonId,
        data.totalLegs, data.legsWon, data.totalGames, data.gamesWon,
        data.threeDartAverage, data.firstNineAverage,
        data.scores60Plus, data.scores80Plus, data.scores100Plus, data.scores120Plus,
        data.scores140Plus, data.scores170Plus, data.total180s,
        data.highFinish, data.finishes100Plus, data.bestLeg, data.worstLeg,
        data.checkoutPercentage, data.checkoutPrediction,
        data.keepPercentage, data.keepPrediction,
        data.breakPercentage, data.breakPrediction,
        data.totalVisits, data.totalPointsScored,
        data.checkoutAttempts, data.successfulCheckouts,
        data.legsStarted, data.legsWonWhenStarted,
        data.legsNotStarted, data.legsWonWhenNotStarted,
        timestamp, timestamp
      )

      return getPlayerStatistics(data.playerId, data.seasonId)!
    }
  } finally {
    db.close()
  }
}

export function deletePlayerStatistics(playerId: string, seasonId: string | null): void {
  const db = getDb()
  try {
    if (seasonId === null) {
      db.prepare('DELETE FROM PlayerStatistics WHERE playerId = ? AND seasonId IS NULL').run(playerId)
    } else {
      db.prepare('DELETE FROM PlayerStatistics WHERE playerId = ? AND seasonId = ?').run(playerId, seasonId)
    }
  } finally {
    db.close()
  }
}

// ============================================================================
// EXPORT HELPERS
// ============================================================================

export interface PlayerStatisticsWithRelations extends PlayerStatistics {
  player: Player
  season: Season | null
}

export function getPlayerStatisticsWithRelations(filters?: {
  seasonId?: string | null
  playerId?: string
  activePlayersOnly?: boolean
}): PlayerStatisticsWithRelations[] {
  const db = getDb()
  try {
    let query = `
      SELECT
        ps.*,
        p.id as player_id,
        p.name as player_name,
        p.avatarUrl as player_avatarUrl,
        p.isActive as player_isActive,
        p.dartModel as player_dartModel,
        p.stemLength as player_stemLength,
        p.flightType as player_flightType,
        p.createdAt as player_createdAt,
        p.updatedAt as player_updatedAt,
        s.id as season_id,
        s.name as season_name,
        s.startDate as season_startDate,
        s.endDate as season_endDate,
        s.isCurrent as season_isCurrent,
        s.createdAt as season_createdAt,
        s.updatedAt as season_updatedAt
      FROM PlayerStatistics ps
      LEFT JOIN Player p ON ps.playerId = p.id
      LEFT JOIN Season s ON ps.seasonId = s.id
      WHERE 1=1
    `

    const params: any[] = []

    if (filters?.seasonId !== undefined) {
      if (filters.seasonId === null) {
        query += ' AND ps.seasonId IS NULL'
      } else {
        query += ' AND ps.seasonId = ?'
        params.push(filters.seasonId)
      }
    }

    if (filters?.playerId) {
      query += ' AND ps.playerId = ?'
      params.push(filters.playerId)
    }

    if (filters?.activePlayersOnly) {
      query += ' AND p.isActive = 1'
    }

    query += ' ORDER BY ps.threeDartAverage DESC'

    const rows = db.prepare(query).all(...params)

    return rows.map(row => ({
      id: row.id,
      playerId: row.playerId,
      seasonId: row.seasonId,
      totalLegs: row.totalLegs,
      legsWon: row.legsWon,
      totalGames: row.totalGames,
      gamesWon: row.gamesWon,
      threeDartAverage: row.threeDartAverage,
      firstNineAverage: row.firstNineAverage,
      scores60Plus: row.scores60Plus,
      scores80Plus: row.scores80Plus,
      scores100Plus: row.scores100Plus,
      scores120Plus: row.scores120Plus,
      scores140Plus: row.scores140Plus,
      scores170Plus: row.scores170Plus,
      total180s: row.total180s,
      highFinish: row.highFinish,
      finishes100Plus: row.finishes100Plus,
      bestLeg: row.bestLeg,
      worstLeg: row.worstLeg,
      checkoutPercentage: row.checkoutPercentage,
      checkoutPrediction: row.checkoutPrediction,
      keepPercentage: row.keepPercentage,
      keepPrediction: row.keepPrediction,
      breakPercentage: row.breakPercentage,
      breakPrediction: row.breakPrediction,
      totalVisits: row.totalVisits,
      totalPointsScored: row.totalPointsScored,
      checkoutAttempts: row.checkoutAttempts,
      successfulCheckouts: row.successfulCheckouts,
      legsStarted: row.legsStarted,
      legsWonWhenStarted: row.legsWonWhenStarted,
      legsNotStarted: row.legsNotStarted,
      legsWonWhenNotStarted: row.legsWonWhenNotStarted,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      player: {
        id: row.player_id,
        name: row.player_name,
        avatarUrl: row.player_avatarUrl,
        isActive: Boolean(row.player_isActive),
        dartModel: row.player_dartModel,
        stemLength: row.player_stemLength,
        flightType: row.player_flightType,
        createdAt: row.player_createdAt,
        updatedAt: row.player_updatedAt,
      },
      season: row.season_id ? {
        id: row.season_id,
        name: row.season_name,
        startDate: row.season_startDate,
        endDate: row.season_endDate,
        isCurrent: Boolean(row.season_isCurrent),
        createdAt: row.season_createdAt,
        updatedAt: row.season_updatedAt,
      } : null
    })) as PlayerStatisticsWithRelations[]
  } finally {
    db.close()
  }
}

export interface GameWithExportDetails {
  id: string
  playerId: string
  fixtureId: string
  opponentName: string
  isComplete: boolean
  playerWon: boolean | null
  playerStarted: boolean
  createdAt: string
  updatedAt: string
  completedAt: string | null
  player: Player
  fixture: {
    id: string
    seasonId: string
    date: string
    opponentTeam: string
    isHome: boolean
    venue: string | null
    notes: string | null
    createdAt: string
    updatedAt: string
    season: Season | null
  }
  legs: Leg[]
}

export function getCompletedGamesForExport(filters?: {
  seasonId?: string
  playerId?: string
  fixtureId?: string
}): GameWithExportDetails[] {
  const db = getDb()
  try {
    let query = `
      SELECT
        g.*,
        p.id as player_id,
        p.name as player_name,
        p.avatarUrl as player_avatarUrl,
        p.isActive as player_isActive,
        p.dartModel as player_dartModel,
        p.stemLength as player_stemLength,
        p.flightType as player_flightType,
        p.createdAt as player_createdAt,
        p.updatedAt as player_updatedAt,
        f.id as fixture_id,
        f.seasonId as fixture_seasonId,
        f.date as fixture_date,
        f.opponentTeam as fixture_opponentTeam,
        f.isHome as fixture_isHome,
        f.venue as fixture_venue,
        f.notes as fixture_notes,
        f.createdAt as fixture_createdAt,
        f.updatedAt as fixture_updatedAt,
        s.id as season_id,
        s.name as season_name,
        s.startDate as season_startDate,
        s.endDate as season_endDate,
        s.isCurrent as season_isCurrent,
        s.createdAt as season_createdAt,
        s.updatedAt as season_updatedAt
      FROM Game g
      LEFT JOIN Player p ON g.playerId = p.id
      LEFT JOIN Fixture f ON g.fixtureId = f.id
      LEFT JOIN Season s ON f.seasonId = s.id
      WHERE g.isComplete = 1
    `

    const params: any[] = []

    if (filters?.playerId) {
      query += ' AND g.playerId = ?'
      params.push(filters.playerId)
    }

    if (filters?.fixtureId) {
      query += ' AND g.fixtureId = ?'
      params.push(filters.fixtureId)
    } else if (filters?.seasonId) {
      query += ' AND f.seasonId = ?'
      params.push(filters.seasonId)
    }

    query += ' ORDER BY g.completedAt DESC'

    const gameRows = db.prepare(query).all(...params)

    return gameRows.map(row => {
      const legs = db.prepare('SELECT * FROM Leg WHERE gameId = ?').all(row.id).map(leg => ({
        ...leg,
        playerStarted: Boolean(leg.playerStarted),
        playerWon: leg.playerWon === null ? null : Boolean(leg.playerWon),
      }))

      return {
        id: row.id,
        playerId: row.playerId,
        fixtureId: row.fixtureId,
        opponentName: row.opponentName,
        isComplete: Boolean(row.isComplete),
        playerWon: row.playerWon === null ? null : Boolean(row.playerWon),
        playerStarted: Boolean(row.playerStarted),
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        completedAt: row.completedAt,
        player: {
          id: row.player_id,
          name: row.player_name,
          avatarUrl: row.player_avatarUrl,
          isActive: Boolean(row.player_isActive),
          dartModel: row.player_dartModel,
          stemLength: row.player_stemLength,
          flightType: row.player_flightType,
          createdAt: row.player_createdAt,
          updatedAt: row.player_updatedAt,
        },
        fixture: {
          id: row.fixture_id,
          seasonId: row.fixture_seasonId,
          date: row.fixture_date,
          opponentTeam: row.fixture_opponentTeam,
          isHome: Boolean(row.fixture_isHome),
          venue: row.fixture_venue,
          notes: row.fixture_notes,
          createdAt: row.fixture_createdAt,
          updatedAt: row.fixture_updatedAt,
          season: row.season_id ? {
            id: row.season_id,
            name: row.season_name,
            startDate: row.season_startDate,
            endDate: row.season_endDate,
            isCurrent: Boolean(row.season_isCurrent),
            createdAt: row.season_createdAt,
            updatedAt: row.season_updatedAt,
          } : null
        },
        legs
      }
    }) as GameWithExportDetails[]
  } finally {
    db.close()
  }
}

// ============================================================================
// UTILITY/COUNT FUNCTIONS
// ============================================================================

export function countActivePlayers(): number {
  const db = getDb()
  try {
    const result = db.prepare('SELECT COUNT(*) as count FROM Player WHERE isActive = 1').get() as { count: number }
    return result.count
  } finally {
    db.close()
  }
}

export function countFixtures(seasonId?: string): number {
  const db = getDb()
  try {
    if (seasonId) {
      const result = db.prepare('SELECT COUNT(*) as count FROM Fixture WHERE seasonId = ?').get(seasonId) as { count: number }
      return result.count
    } else {
      const result = db.prepare('SELECT COUNT(*) as count FROM Fixture').get() as { count: number }
      return result.count
    }
  } finally {
    db.close()
  }
}

export function countFixturesWithCompletedGames(seasonId?: string): number {
  const db = getDb()
  try {
    let query = `
      SELECT COUNT(DISTINCT f.id) as count
      FROM Fixture f
      INNER JOIN Game g ON f.id = g.fixtureId
      WHERE g.isComplete = 1
    `
    if (seasonId) {
      query += ' AND f.seasonId = ?'
      const result = db.prepare(query).get(seasonId) as { count: number }
      return result.count
    } else {
      const result = db.prepare(query).get() as { count: number }
      return result.count
    }
  } finally {
    db.close()
  }
}

export function getUpcomingFixtures(seasonId?: string, limit: number = 5): FixtureWithSeason[] {
  const db = getDb()
  try {
    const now = new Date().toISOString()
    let query = `
      SELECT
        f.*,
        s.id as season_id,
        s.name as season_name,
        s.startDate as season_startDate,
        s.endDate as season_endDate,
        s.isCurrent as season_isCurrent,
        s.createdAt as season_createdAt,
        s.updatedAt as season_updatedAt
      FROM Fixture f
      LEFT JOIN Season s ON f.seasonId = s.id
      WHERE f.date >= ?
    `
    const params: any[] = [now]

    if (seasonId) {
      query += ' AND f.seasonId = ?'
      params.push(seasonId)
    }

    query += ' ORDER BY f.date ASC LIMIT ?'
    params.push(limit)

    const rows = db.prepare(query).all(...params)

    return rows.map(row => ({
      id: row.id,
      seasonId: row.seasonId,
      date: row.date,
      opponentTeam: row.opponentTeam,
      isHome: Boolean(row.isHome),
      venue: row.venue,
      notes: row.notes,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      season: {
        id: row.season_id,
        name: row.season_name,
        startDate: row.season_startDate,
        endDate: row.season_endDate,
        isCurrent: Boolean(row.season_isCurrent),
        createdAt: row.season_createdAt,
        updatedAt: row.season_updatedAt,
      }
    })) as FixtureWithSeason[]
  } finally {
    db.close()
  }
}

// Export the db getter for custom queries if needed
export { getDb, generateId, now }
