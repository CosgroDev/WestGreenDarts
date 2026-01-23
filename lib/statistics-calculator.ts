import {
  getCompletedGamesForPlayer,
  getGameWithFixtureAndSeason,
  getPlayerStatistics,
  upsertPlayerStatistics,
  type GameWithLegsAndVisits,
} from './db-direct'

interface Visit {
  id: string
  isPlayer: boolean
  totalScore: number
  isCheckout: boolean
  checkoutScore: number | null
  visitNumber: number
}

interface Leg {
  id: string
  playerWon: boolean | null
  playerStarted: boolean
  totalDarts: number
  visits: Visit[]
}

interface Game {
  id: string
  playerId: string
  playerWon: boolean | null
  legs: Leg[]
}

interface CalculatedStats {
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
  keepPercentage: number
  breakPercentage: number

  // Supporting data
  totalVisits: number
  totalPointsScored: number
  checkoutAttempts: number
  successfulCheckouts: number
  legsStarted: number
  legsWonWhenStarted: number
  legsNotStarted: number
  legsWonWhenNotStarted: number
}

/**
 * Calculate statistics for a single game
 */
export function calculateGameStatistics(game: Game): Partial<CalculatedStats> {
  const stats: Partial<CalculatedStats> = {
    totalLegs: 0,
    legsWon: 0,
    totalGames: 1,
    gamesWon: 0,
    scores60Plus: 0,
    scores80Plus: 0,
    scores100Plus: 0,
    scores120Plus: 0,
    scores140Plus: 0,
    scores170Plus: 0,
    total180s: 0,
    highFinish: 0,
    finishes100Plus: 0,
    bestLeg: null,
    worstLeg: null,
    totalVisits: 0,
    totalPointsScored: 0,
    checkoutAttempts: 0,
    successfulCheckouts: 0,
    legsStarted: 0,
    legsWonWhenStarted: 0,
    legsNotStarted: 0,
    legsWonWhenNotStarted: 0,
  }

  // Count game won
  if (game.playerWon === true) {
    stats.gamesWon = 1
  }

  // Process each leg
  for (const leg of game.legs) {
    // Only count completed legs
    if (leg.playerWon === null) continue

    stats.totalLegs = (stats.totalLegs || 0) + 1

    if (leg.playerWon) {
      stats.legsWon = (stats.legsWon || 0) + 1
    }

    // Track keep/break statistics
    if (leg.playerStarted) {
      stats.legsStarted = (stats.legsStarted || 0) + 1
      if (leg.playerWon) {
        stats.legsWonWhenStarted = (stats.legsWonWhenStarted || 0) + 1
      }
    } else {
      stats.legsNotStarted = (stats.legsNotStarted || 0) + 1
      if (leg.playerWon) {
        stats.legsWonWhenNotStarted = (stats.legsWonWhenNotStarted || 0) + 1
      }
    }

    // Track best/worst leg (only for won legs)
    if (leg.playerWon && leg.totalDarts > 0) {
      if (stats.bestLeg === null || leg.totalDarts < stats.bestLeg) {
        stats.bestLeg = leg.totalDarts
      }
      if (stats.worstLeg === null || leg.totalDarts > stats.worstLeg) {
        stats.worstLeg = leg.totalDarts
      }
    }

    // Process visits
    const playerVisits = leg.visits.filter((v) => v.isPlayer)

    for (const visit of playerVisits) {
      stats.totalVisits = (stats.totalVisits || 0) + 1
      stats.totalPointsScored = (stats.totalPointsScored || 0) + visit.totalScore

      // Score distribution
      if (visit.totalScore >= 60) stats.scores60Plus = (stats.scores60Plus || 0) + 1
      if (visit.totalScore >= 80) stats.scores80Plus = (stats.scores80Plus || 0) + 1
      if (visit.totalScore >= 100) stats.scores100Plus = (stats.scores100Plus || 0) + 1
      if (visit.totalScore >= 120) stats.scores120Plus = (stats.scores120Plus || 0) + 1
      if (visit.totalScore >= 140) stats.scores140Plus = (stats.scores140Plus || 0) + 1
      if (visit.totalScore >= 170) stats.scores170Plus = (stats.scores170Plus || 0) + 1
      if (visit.totalScore === 180) stats.total180s = (stats.total180s || 0) + 1

      // Checkout statistics
      if (visit.isCheckout && visit.checkoutScore) {
        stats.successfulCheckouts = (stats.successfulCheckouts || 0) + 1

        if (visit.checkoutScore > (stats.highFinish || 0)) {
          stats.highFinish = visit.checkoutScore
        }

        if (visit.checkoutScore >= 100) {
          stats.finishes100Plus = (stats.finishes100Plus || 0) + 1
        }
      }
    }

    // Count checkout attempts (when player was on a finish)
    // This is approximated by looking at visits where remaining score was <= 170
    // For now, we'll count actual checkouts as attempts
    // In a more sophisticated version, we'd track all finish attempts
    stats.checkoutAttempts = (stats.checkoutAttempts || 0) + (leg.playerWon ? 1 : 0)
  }

  return stats
}

/**
 * Aggregate statistics from existing stats and new game stats
 */
export function aggregateStatistics(
  existing: CalculatedStats,
  gameStats: Partial<CalculatedStats>
): CalculatedStats {
  const aggregated: CalculatedStats = {
    totalLegs: existing.totalLegs + (gameStats.totalLegs || 0),
    legsWon: existing.legsWon + (gameStats.legsWon || 0),
    totalGames: existing.totalGames + (gameStats.totalGames || 0),
    gamesWon: existing.gamesWon + (gameStats.gamesWon || 0),

    scores60Plus: existing.scores60Plus + (gameStats.scores60Plus || 0),
    scores80Plus: existing.scores80Plus + (gameStats.scores80Plus || 0),
    scores100Plus: existing.scores100Plus + (gameStats.scores100Plus || 0),
    scores120Plus: existing.scores120Plus + (gameStats.scores120Plus || 0),
    scores140Plus: existing.scores140Plus + (gameStats.scores140Plus || 0),
    scores170Plus: existing.scores170Plus + (gameStats.scores170Plus || 0),
    total180s: existing.total180s + (gameStats.total180s || 0),

    highFinish: Math.max(existing.highFinish, gameStats.highFinish || 0),
    finishes100Plus: existing.finishes100Plus + (gameStats.finishes100Plus || 0),
    bestLeg:
      existing.bestLeg === null
        ? gameStats.bestLeg || null
        : gameStats.bestLeg === null
        ? existing.bestLeg
        : Math.min(existing.bestLeg, gameStats.bestLeg),
    worstLeg:
      existing.worstLeg === null
        ? gameStats.worstLeg || null
        : gameStats.worstLeg === null
        ? existing.worstLeg
        : Math.max(existing.worstLeg, gameStats.worstLeg),

    totalVisits: existing.totalVisits + (gameStats.totalVisits || 0),
    totalPointsScored: existing.totalPointsScored + (gameStats.totalPointsScored || 0),
    checkoutAttempts: existing.checkoutAttempts + (gameStats.checkoutAttempts || 0),
    successfulCheckouts: existing.successfulCheckouts + (gameStats.successfulCheckouts || 0),
    legsStarted: existing.legsStarted + (gameStats.legsStarted || 0),
    legsWonWhenStarted: existing.legsWonWhenStarted + (gameStats.legsWonWhenStarted || 0),
    legsNotStarted: existing.legsNotStarted + (gameStats.legsNotStarted || 0),
    legsWonWhenNotStarted: existing.legsWonWhenNotStarted + (gameStats.legsWonWhenNotStarted || 0),

    // Calculate percentages
    threeDartAverage: 0,
    firstNineAverage: 0,
    checkoutPercentage: 0,
    checkoutPrediction: 0,
    keepPercentage: 0,
    keepPrediction: 0,
    breakPercentage: 0,
    breakPrediction: 0,
  }

  // Calculate derived statistics
  aggregated.threeDartAverage =
    aggregated.totalVisits > 0
      ? parseFloat((aggregated.totalPointsScored / aggregated.totalVisits).toFixed(2))
      : 0

  aggregated.checkoutPercentage =
    aggregated.checkoutAttempts > 0
      ? parseFloat(((aggregated.successfulCheckouts / aggregated.checkoutAttempts) * 100).toFixed(2))
      : 0

  aggregated.keepPercentage =
    aggregated.legsStarted > 0
      ? parseFloat(((aggregated.legsWonWhenStarted / aggregated.legsStarted) * 100).toFixed(2))
      : 0

  aggregated.breakPercentage =
    aggregated.legsNotStarted > 0
      ? parseFloat(((aggregated.legsWonWhenNotStarted / aggregated.legsNotStarted) * 100).toFixed(2))
      : 0

  // Prediction percentages (same as actual for now, could be ML-based in future)
  aggregated.checkoutPrediction = aggregated.checkoutPercentage
  aggregated.keepPrediction = aggregated.keepPercentage
  aggregated.breakPrediction = aggregated.breakPercentage

  // First 9 average would require storing first 3 visits per leg
  // For now, using overall average as approximation
  aggregated.firstNineAverage = aggregated.threeDartAverage

  return aggregated
}

/**
 * Calculate all statistics for a player across all their games
 */
export async function calculatePlayerAllTimeStatistics(playerId: string): Promise<CalculatedStats> {
  const games = getCompletedGamesForPlayer(playerId)

  let allTimeStats: CalculatedStats = {
    totalLegs: 0,
    legsWon: 0,
    totalGames: 0,
    gamesWon: 0,
    threeDartAverage: 0,
    firstNineAverage: 0,
    scores60Plus: 0,
    scores80Plus: 0,
    scores100Plus: 0,
    scores120Plus: 0,
    scores140Plus: 0,
    scores170Plus: 0,
    total180s: 0,
    highFinish: 0,
    finishes100Plus: 0,
    bestLeg: null,
    worstLeg: null,
    checkoutPercentage: 0,
    checkoutPrediction: 0,
    keepPercentage: 0,
    keepPrediction: 0,
    breakPercentage: 0,
    breakPrediction: 0,
    totalVisits: 0,
    totalPointsScored: 0,
    checkoutAttempts: 0,
    successfulCheckouts: 0,
    legsStarted: 0,
    legsWonWhenStarted: 0,
    legsNotStarted: 0,
    legsWonWhenNotStarted: 0,
  }

  for (const game of games) {
    const gameStats = calculateGameStatistics(game as any)
    allTimeStats = aggregateStatistics(allTimeStats, gameStats)
  }

  return allTimeStats
}

/**
 * Update player statistics after a game is completed
 */
export async function updatePlayerStatistics(gameId: string): Promise<void> {
  const game = getGameWithFixtureAndSeason(gameId)

  if (!game || !game.isComplete) {
    return
  }

  // Calculate statistics for this game
  const gameStats = calculateGameStatistics(game as any)

  // Get or create all-time statistics
  let allTimeStats = getPlayerStatistics(game.playerId, null)

  if (!allTimeStats) {
    // Create new all-time stats
    upsertPlayerStatistics({
      playerId: game.playerId,
      seasonId: null,
      ...gameStats as any,
    })
  } else {
    // Update existing all-time stats
    const aggregated = aggregateStatistics(allTimeStats as any, gameStats)
    upsertPlayerStatistics({
      playerId: game.playerId,
      seasonId: null,
      ...aggregated,
    })
  }

  // Get or create season statistics
  if (game.fixture?.season?.id) {
    let seasonStats = getPlayerStatistics(game.playerId, game.fixture.season.id)

    if (!seasonStats) {
      // Create new season stats
      upsertPlayerStatistics({
        playerId: game.playerId,
        seasonId: game.fixture.season.id,
        ...gameStats as any,
      })
    } else {
      // Update existing season stats
      const aggregated = aggregateStatistics(seasonStats as any, gameStats)
      upsertPlayerStatistics({
        playerId: game.playerId,
        seasonId: game.fixture.season.id,
        ...aggregated,
      })
    }
  }
}
