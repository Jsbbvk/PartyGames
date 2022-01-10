import CARDS_JSON from '../../constants/cards/cah-cards-compact.json'
import ASIAN_CARDS_JSON from '../../constants/cards/asainCards.json'

const CARDS = {
  white: Object.values(CARDS_JSON.white).map((c, i) => ({ text: c, id: i })),
  black: Object.values(CARDS_JSON.black).flatMap((c, i) =>
    c.pick === 1 ? [{ text: c.text, id: i }] : []
  ),
}

const ASIAN_CARDS = {
  white: ASIAN_CARDS_JSON.white.map((c, i) => ({ text: c, id: i })),
  black: ASIAN_CARDS_JSON.black.map((c, i) => ({ text: c, id: i })),
}

const CardManager = () => {
  return [CARDS, ASIAN_CARDS]
}

export default CardManager
