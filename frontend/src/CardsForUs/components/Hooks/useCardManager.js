import { useState, useEffect, useCallback } from 'react'
import LZString from 'lz-string'
import shuffle from 'lodash/shuffle'
import { AFA_CARDS, PACKS, CAF_CARDS } from '../../constants'

const CardManager = () => {
  const [cards, setCards] = useState({
    black: [],
    white: [],
  })
  const [maxCards, setMaxCards] = useState(7)
  const [cardPack, setCP] = useState({
    name: PACKS.CAH_PACK,
    pack: CAF_CARDS,
  })

  const setCardPack = (pack) => {
    let packObj
    switch (pack) {
      case PACKS.CAH_PACK: {
        packObj = { name: PACKS.CAH_PACK, pack: CAF_CARDS }
        break
      }
      case PACKS.AFA_PACK: {
        packObj = { name: PACKS.AFA_PACK, pack: AFA_CARDS }
        break
      }
      default:
    }
    setCP(packObj)
    refreshCards('white', packObj)
    refreshCards('black', packObj)
  }

  const getCurrentCards = useCallback(
    (type) => {
      return (
        LZString.decompressFromUTF16(
          localStorage.getItem(`Current-${cardPack.name}-Cards-${type}`)
        ).split('/') || []
      )
    },
    [cardPack]
  )

  const hydrateCards = useCallback(
    (ids, type, pack) => ids.map((id) => (pack ?? cardPack).pack[type][id - 1]),
    [cardPack]
  )

  const refreshCards = useCallback(
    (type, pack) => {
      let unusedCards = LZString.decompressFromUTF16(
        localStorage.getItem(`Unused-${pack.name}-Cards-${type}`)
      )
      if (unusedCards) unusedCards = unusedCards.split('/')
      else unusedCards = shuffle(pack.pack[type].map(({ id }) => id))

      let newCards = unusedCards.slice(0, maxCards)
      let restCards = unusedCards.slice(maxCards)

      if (newCards.length < maxCards) {
        // add more cards
        const shuffledCards = shuffle(
          pack.pack[type].flatMap(({ id }) =>
            !newCards.find((_id) => id === _id) ? [id] : []
          )
        )

        restCards = shuffledCards.slice(maxCards - newCards.length)
        newCards = [
          ...newCards,
          ...shuffledCards.slice(0, maxCards - newCards.length),
        ]
      }

      setCards((prev) => ({
        ...prev,
        [type]: hydrateCards(newCards, type, pack),
      }))

      localStorage.setItem(
        `Unused-${pack.name}-Cards-${type}`,
        LZString.compressToUTF16(restCards.join('/'))
      )
      localStorage.setItem(
        `Current-${pack.name}-Cards-${type}`,
        LZString.compressToUTF16(newCards.join('/'))
      )
    },
    [maxCards]
  )

  const skipCard = useCallback(
    (skippedId, type) => {
      const newCards = cards[type].filter(({ id }) => id !== skippedId)

      let unusedCards = LZString.decompressFromUTF16(
        localStorage.getItem(`Unused-${cardPack.name}-Cards-${type}`)
      )
      if (unusedCards) unusedCards = unusedCards.split('/')
      else unusedCards = shuffle(cardPack.pack[type].map(({ id }) => id))

      newCards.push(hydrateCards([unusedCards.shift()], type)[0])

      if (unusedCards.length === 0) {
        unusedCards = shuffle(
          cardPack.pack[type].flatMap(({ id }) =>
            !newCards.find(({ id: _id }) => id === _id) ? [id] : []
          )
        )
      }

      setCards((prev) => ({ ...prev, [type]: newCards }))

      localStorage.setItem(
        `Unused-${cardPack.name}-Cards-${type}`,
        LZString.compressToUTF16(unusedCards.join('/'))
      )
      localStorage.setItem(
        `Current-${cardPack.name}-Cards-${type}`,
        LZString.compressToUTF16(newCards.map(({ id }) => id).join('/'))
      )

      return newCards
    },
    [cards, cardPack]
  )

  return {
    cards,
    skipCard,
    setMaxCards,
    setCardPack,
    hydrateCards,
  }
}

export default CardManager
