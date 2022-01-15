import ASIAN_CARDS_JSON from './cards/asianCards.json'
import CARDS_JSON from './cards/cah-cards-compact.json'

export const NUMBER_OF_CARD_CHOICES = 7
export const USERNAME_LENGTH = 20

export const SCENES = {
  intro: 'intro',
  join: 'join',
  host: 'host',
  gameplay: 'gameplay',
  waiting: 'waiting',
}

export const STATES = {
  waiting: 'waiting',
  gameplay: 'gameplay',
  results: 'results',
}

export const GAME_STATES = {
  choosing_card_czar: 'choosing card czar',
  choosing_card: 'choosing card',
  choosing_winning_card: 'choosing winning card',
}

export const INFO = {
  czar: 'You are the Card Czar',
  waiting: 'Waiting for Card Czar',
  results: 'Results',
  empty: '',
  waitingForCzar: {
    text: 'Waiting for Card Czar...',
    key: 'waiting for czar',
  },
  skips: {
    text: 'Skips left: ',
    key: 'skips',
  },
  waitingForPlayers: (numP = 0, totalP = 1) => ({
    text: `Waiting for players... ${numP}/${totalP}`,
    key: 'waiting for players',
  }),
}

export const MIN_PLAYERS_TO_START = 3

export const CAF_CARDS = {
  white: Object.values(CARDS_JSON.white).map((c, i) => ({
    text: c,
    id: i + 1,
  })),
  black: Object.values(CARDS_JSON.black).flatMap((c, i) =>
    c.pick === 1 ? [{ text: c.text, id: i + 1 }] : []
  ),
}

export const AFA_CARDS = {
  white: ASIAN_CARDS_JSON.white.map((c, i) => ({ text: c, id: i + 1 })),
  black: ASIAN_CARDS_JSON.black.map((c, i) => ({ text: c, id: i + 1 })),
}

export const PACKS = {
  CAH_PACK: 'Cards Against Humanity',
  AFA_PACK: 'A For Asian',
}
