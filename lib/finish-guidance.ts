/**
 * Finish guidance for 501 darts
 * Provides optimal checkout combinations for scores 2-170
 */

export interface FinishRoute {
  score: number
  combination: string[]
  description: string
}

export const FINISH_ROUTES: Record<number, FinishRoute> = {
  2: { score: 2, combination: ['D1'], description: 'Double 1' },
  4: { score: 4, combination: ['D2'], description: 'Double 2' },
  6: { score: 6, combination: ['D3'], description: 'Double 3' },
  8: { score: 8, combination: ['D4'], description: 'Double 4' },
  10: { score: 10, combination: ['D5'], description: 'Double 5' },
  12: { score: 12, combination: ['D6'], description: 'Double 6' },
  14: { score: 14, combination: ['D7'], description: 'Double 7' },
  16: { score: 16, combination: ['D8'], description: 'Double 8' },
  18: { score: 18, combination: ['D9'], description: 'Double 9' },
  20: { score: 20, combination: ['D10'], description: 'Double 10' },
  22: { score: 22, combination: ['D11'], description: 'Double 11' },
  24: { score: 24, combination: ['D12'], description: 'Double 12' },
  26: { score: 26, combination: ['D13'], description: 'Double 13' },
  28: { score: 28, combination: ['D14'], description: 'Double 14' },
  30: { score: 30, combination: ['D15'], description: 'Double 15' },
  32: { score: 32, combination: ['D16'], description: 'Double 16' },
  34: { score: 34, combination: ['D17'], description: 'Double 17' },
  36: { score: 36, combination: ['D18'], description: 'Double 18' },
  38: { score: 38, combination: ['D19'], description: 'Double 19' },
  40: { score: 40, combination: ['D20'], description: 'Double 20' },

  // Two-dart finishes (41-60)
  41: { score: 41, combination: ['9', 'D16'], description: '9, Double 16' },
  42: { score: 42, combination: ['10', 'D16'], description: '10, Double 16' },
  43: { score: 43, combination: ['11', 'D16'], description: '11, Double 16' },
  44: { score: 44, combination: ['12', 'D16'], description: '12, Double 16' },
  45: { score: 45, combination: ['13', 'D16'], description: '13, Double 16' },
  46: { score: 46, combination: ['14', 'D16'], description: '14, Double 16' },
  47: { score: 47, combination: ['15', 'D16'], description: '15, Double 16' },
  48: { score: 48, combination: ['16', 'D16'], description: '16, Double 16' },
  49: { score: 49, combination: ['17', 'D16'], description: '17, Double 16' },
  50: { score: 50, combination: ['Bull'], description: 'Bullseye' },
  51: { score: 51, combination: ['19', 'D16'], description: '19, Double 16' },
  52: { score: 52, combination: ['20', 'D16'], description: '20, Double 16' },
  53: { score: 53, combination: ['13', 'D20'], description: '13, Double 20' },
  54: { score: 54, combination: ['14', 'D20'], description: '14, Double 20' },
  55: { score: 55, combination: ['15', 'D20'], description: '15, Double 20' },
  56: { score: 56, combination: ['16', 'D20'], description: '16, Double 20' },
  57: { score: 57, combination: ['17', 'D20'], description: '17, Double 20' },
  58: { score: 58, combination: ['18', 'D20'], description: '18, Double 20' },
  59: { score: 59, combination: ['19', 'D20'], description: '19, Double 20' },
  60: { score: 60, combination: ['20', 'D20'], description: '20, Double 20' },

  // Three-dart finishes (61-170)
  61: { score: 61, combination: ['T15', 'D8'], description: 'Treble 15, Double 8' },
  62: { score: 62, combination: ['T10', 'D16'], description: 'Treble 10, Double 16' },
  63: { score: 63, combination: ['T13', 'D12'], description: 'Treble 13, Double 12' },
  64: { score: 64, combination: ['T16', 'D8'], description: 'Treble 16, Double 8' },
  65: { score: 65, combination: ['T11', 'D16'], description: 'Treble 11, Double 16' },
  66: { score: 66, combination: ['T10', 'D18'], description: 'Treble 10, Double 18' },
  67: { score: 67, combination: ['T17', 'D8'], description: 'Treble 17, Double 8' },
  68: { score: 68, combination: ['T16', 'D10'], description: 'Treble 16, Double 10' },
  69: { score: 69, combination: ['T19', 'D6'], description: 'Treble 19, Double 6' },
  70: { score: 70, combination: ['T18', 'D8'], description: 'Treble 18, Double 8' },
  71: { score: 71, combination: ['T13', 'D16'], description: 'Treble 13, Double 16' },
  72: { score: 72, combination: ['T16', 'D12'], description: 'Treble 16, Double 12' },
  73: { score: 73, combination: ['T19', 'D8'], description: 'Treble 19, Double 8' },
  74: { score: 74, combination: ['T14', 'D16'], description: 'Treble 14, Double 16' },
  75: { score: 75, combination: ['T17', 'D12'], description: 'Treble 17, Double 12' },
  76: { score: 76, combination: ['T20', 'D8'], description: 'Treble 20, Double 8' },
  77: { score: 77, combination: ['T19', 'D10'], description: 'Treble 19, Double 10' },
  78: { score: 78, combination: ['T18', 'D12'], description: 'Treble 18, Double 12' },
  79: { score: 79, combination: ['T13', 'D20'], description: 'Treble 13, Double 20' },
  80: { score: 80, combination: ['T20', 'D10'], description: 'Treble 20, Double 10' },
  81: { score: 81, combination: ['T19', 'D12'], description: 'Treble 19, Double 12' },
  82: { score: 82, combination: ['Bull', 'D16'], description: 'Bullseye, Double 16' },
  83: { score: 83, combination: ['T17', 'D16'], description: 'Treble 17, Double 16' },
  84: { score: 84, combination: ['T20', 'D12'], description: 'Treble 20, Double 12' },
  85: { score: 85, combination: ['T15', 'D20'], description: 'Treble 15, Double 20' },
  86: { score: 86, combination: ['T18', 'D16'], description: 'Treble 18, Double 16' },
  87: { score: 87, combination: ['T17', 'D18'], description: 'Treble 17, Double 18' },
  88: { score: 88, combination: ['T20', 'D14'], description: 'Treble 20, Double 14' },
  89: { score: 89, combination: ['T19', 'D16'], description: 'Treble 19, Double 16' },
  90: { score: 90, combination: ['T20', 'D15'], description: 'Treble 20, Double 15' },
  91: { score: 91, combination: ['T17', 'D20'], description: 'Treble 17, Double 20' },
  92: { score: 92, combination: ['T20', 'D16'], description: 'Treble 20, Double 16' },
  93: { score: 93, combination: ['T19', 'D18'], description: 'Treble 19, Double 18' },
  94: { score: 94, combination: ['T18', 'D20'], description: 'Treble 18, Double 20' },
  95: { score: 95, combination: ['T19', 'D19'], description: 'Treble 19, Double 19' },
  96: { score: 96, combination: ['T20', 'D18'], description: 'Treble 20, Double 18' },
  97: { score: 97, combination: ['T19', 'D20'], description: 'Treble 19, Double 20' },
  98: { score: 98, combination: ['T20', 'D19'], description: 'Treble 20, Double 19' },
  99: { score: 99, combination: ['T19', '10', 'D16'], description: 'Treble 19, 10, Double 16' },
  100: { score: 100, combination: ['T20', 'D20'], description: 'Treble 20, Double 20' },
  101: { score: 101, combination: ['T17', 'Bull'], description: 'Treble 17, Bullseye' },
  102: { score: 102, combination: ['T20', '10', 'D16'], description: 'Treble 20, 10, Double 16' },
  103: { score: 103, combination: ['T19', '10', 'D18'], description: 'Treble 19, 10, Double 18' },
  104: { score: 104, combination: ['T18', 'Bull'], description: 'Treble 18, Bullseye' },
  105: { score: 105, combination: ['T20', '13', 'D16'], description: 'Treble 20, 13, Double 16' },
  106: { score: 106, combination: ['T20', '14', 'D16'], description: 'Treble 20, 14, Double 16' },
  107: { score: 107, combination: ['T19', 'Bull'], description: 'Treble 19, Bullseye' },
  108: { score: 108, combination: ['T20', '16', 'D16'], description: 'Treble 20, 16, Double 16' },
  109: { score: 109, combination: ['T20', '17', 'D16'], description: 'Treble 20, 17, Double 16' },
  110: { score: 110, combination: ['T20', 'Bull'], description: 'Treble 20, Bullseye' },
  111: { score: 111, combination: ['T19', '14', 'D20'], description: 'Treble 19, 14, Double 20' },
  112: { score: 112, combination: ['T20', '20', 'D16'], description: 'Treble 20, 20, Double 16' },
  113: { score: 113, combination: ['T19', '16', 'D20'], description: 'Treble 19, 16, Double 20' },
  114: { score: 114, combination: ['T20', '14', 'D20'], description: 'Treble 20, 14, Double 20' },
  115: { score: 115, combination: ['T19', '18', 'D20'], description: 'Treble 19, 18, Double 20' },
  116: { score: 116, combination: ['T20', '16', 'D20'], description: 'Treble 20, 16, Double 20' },
  117: { score: 117, combination: ['T20', '17', 'D20'], description: 'Treble 20, 17, Double 20' },
  118: { score: 118, combination: ['T20', '18', 'D20'], description: 'Treble 20, 18, Double 20' },
  119: { score: 119, combination: ['T19', '12', 'Bull'], description: 'Treble 19, 12, Bullseye' },
  120: { score: 120, combination: ['T20', '20', 'D20'], description: 'Treble 20, 20, Double 20' },
  121: { score: 121, combination: ['T20', '11', 'Bull'], description: 'Treble 20, 11, Bullseye' },
  122: { score: 122, combination: ['T18', '18', 'Bull'], description: 'Treble 18, 18, Bullseye' },
  123: { score: 123, combination: ['T19', '16', 'Bull'], description: 'Treble 19, 16, Bullseye' },
  124: { score: 124, combination: ['T20', '14', 'Bull'], description: 'Treble 20, 14, Bullseye' },
  125: { score: 125, combination: ['T20', '15', 'Bull'], description: 'Treble 20, 15, Bullseye' },
  126: { score: 126, combination: ['T19', '19', 'Bull'], description: 'Treble 19, 19, Bullseye' },
  127: { score: 127, combination: ['T20', '17', 'Bull'], description: 'Treble 20, 17, Bullseye' },
  128: { score: 128, combination: ['T20', '18', 'Bull'], description: 'Treble 20, 18, Bullseye' },
  129: { score: 129, combination: ['T19', '12', 'D20'], description: 'Treble 19, 12, Double 20' },
  130: { score: 130, combination: ['T20', '20', 'Bull'], description: 'Treble 20, 20, Bullseye' },
  131: { score: 131, combination: ['T20', '19', 'Bull'], description: 'Treble 20, 19, Bullseye' },
  132: { score: 132, combination: ['Bull', 'Bull', 'D16'], description: 'Bullseye, Bullseye, Double 16' },
  133: { score: 133, combination: ['T20', '13', 'D20'], description: 'Treble 20, 13, Double 20' },
  134: { score: 134, combination: ['T20', 'T14', 'D16'], description: 'Treble 20, Treble 14, Double 16' },
  135: { score: 135, combination: ['Bull', 'Bull', 'D17.5'], description: 'Bullseye, Bullseye, Double 17.5' },
  136: { score: 136, combination: ['T20', 'T20', 'D8'], description: 'Treble 20, Treble 20, Double 8' },
  137: { score: 137, combination: ['T20', 'T19', 'D10'], description: 'Treble 20, Treble 19, Double 10' },
  138: { score: 138, combination: ['T20', 'T18', 'D12'], description: 'Treble 20, Treble 18, Double 12' },
  139: { score: 139, combination: ['T20', 'T19', 'D11'], description: 'Treble 20, Treble 19, Double 11' },
  140: { score: 140, combination: ['T20', 'T20', 'D10'], description: 'Treble 20, Treble 20, Double 10' },
  141: { score: 141, combination: ['T20', 'T19', 'D12'], description: 'Treble 20, Treble 19, Double 12' },
  142: { score: 142, combination: ['T20', 'T14', 'Bull'], description: 'Treble 20, Treble 14, Bullseye' },
  143: { score: 143, combination: ['T20', 'T17', 'D16'], description: 'Treble 20, Treble 17, Double 16' },
  144: { score: 144, combination: ['T20', 'T20', 'D12'], description: 'Treble 20, Treble 20, Double 12' },
  145: { score: 145, combination: ['T20', 'T15', 'Bull'], description: 'Treble 20, Treble 15, Bullseye' },
  146: { score: 146, combination: ['T20', 'T18', 'D16'], description: 'Treble 20, Treble 18, Double 16' },
  147: { score: 147, combination: ['T20', 'T17', 'D18'], description: 'Treble 20, Treble 17, Double 18' },
  148: { score: 148, combination: ['T20', 'T20', 'D14'], description: 'Treble 20, Treble 20, Double 14' },
  149: { score: 149, combination: ['T20', 'T19', 'D16'], description: 'Treble 20, Treble 19, Double 16' },
  150: { score: 150, combination: ['T20', 'T18', 'D18'], description: 'Treble 20, Treble 18, Double 18' },
  151: { score: 151, combination: ['T20', 'T17', 'D20'], description: 'Treble 20, Treble 17, Double 20' },
  152: { score: 152, combination: ['T20', 'T20', 'D16'], description: 'Treble 20, Treble 20, Double 16' },
  153: { score: 153, combination: ['T20', 'T19', 'D18'], description: 'Treble 20, Treble 19, Double 18' },
  154: { score: 154, combination: ['T20', 'T18', 'D20'], description: 'Treble 20, Treble 18, Double 20' },
  155: { score: 155, combination: ['T20', 'T19', 'D19'], description: 'Treble 20, Treble 19, Double 19' },
  156: { score: 156, combination: ['T20', 'T20', 'D18'], description: 'Treble 20, Treble 20, Double 18' },
  157: { score: 157, combination: ['T20', 'T19', 'D20'], description: 'Treble 20, Treble 19, Double 20' },
  158: { score: 158, combination: ['T20', 'T20', 'D19'], description: 'Treble 20, Treble 20, Double 19' },
  160: { score: 160, combination: ['T20', 'T20', 'D20'], description: 'Treble 20, Treble 20, Double 20' },
  161: { score: 161, combination: ['T20', 'T17', 'Bull'], description: 'Treble 20, Treble 17, Bullseye' },
  164: { score: 164, combination: ['T20', 'T18', 'Bull'], description: 'Treble 20, Treble 18, Bullseye' },
  167: { score: 167, combination: ['T20', 'T19', 'Bull'], description: 'Treble 20, Treble 19, Bullseye' },
  170: { score: 170, combination: ['T20', 'T20', 'Bull'], description: 'Treble 20, Treble 20, Bullseye' },
}

/**
 * Get the finish guidance for a given score
 */
export function getFinishGuidance(score: number): FinishRoute | null {
  if (score < 2 || score > 170) return null

  // Handle impossible finishes (159, 163, 166, 169)
  const impossibleFinishes = [159, 163, 166, 169]
  if (impossibleFinishes.includes(score)) return null

  return FINISH_ROUTES[score] || null
}

/**
 * Check if a score is a valid finish
 */
export function isValidFinish(score: number): boolean {
  return score >= 2 && score <= 170 && getFinishGuidance(score) !== null
}

/**
 * Get alternative finishes when a dart is missed
 */
export function getAlternativeFinish(
  originalScore: number,
  dartsMissed: number,
  scoredSoFar: number
): FinishRoute | null {
  const remainingScore = originalScore - scoredSoFar
  return getFinishGuidance(remainingScore)
}
