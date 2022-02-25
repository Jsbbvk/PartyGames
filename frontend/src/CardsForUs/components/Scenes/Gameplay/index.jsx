/* eslint-disable import/no-cycle */
import { Container } from '@mui/material'
import { useRef, createContext, useContext, useEffect, useState } from 'react'
import { ThemeContext } from '../../../../App'
import { GAME_STATES } from '../../../constants'
import { useCardManager } from '../../Hooks'
import {
  useEmitter,
  useGameContext,
  useListener,
  useSceneContext,
} from '../../Managers'
import Cards from './Cards'
import Czar from './Czar'

const GameplayContext = createContext()
export const useGameplayContext = () => useContext(GameplayContext)

const Gameplay = () => {
  const { name, roomId, uuid, roundNumber, setRoundNumber } = useGameContext()
  const { toggleColorMode } = useContext(ThemeContext)
  const { setShowMenu } = useSceneContext()
  const {
    cards: playerCards,
    skipCard,
    hydrateCards,
    setCardPack,
    refreshCards,
  } = useCardManager()

  const cardsRef = useRef(null)

  const [gameState, setGameState] = useState(null)
  const [players, setPlayers] = useState([])
  const [isCzar, setIsCzar] = useState(false)
  const [allowSkipping, setAllowSkipping] = useState(false) // allow skipping as a whole

  const emit = useEmitter()

  const getPlayers = () => {
    // eslint-disable-next-line consistent-return
    return new Promise((res, rej) => {
      if (!roomId) return res([])

      emit('get players', { roomId }, (data) => {
        const { players: roomPlayers, error } = data
        if (error) {
          if (process.env.REACT_APP_NODE_ENV === 'development')
            console.log(error)
          return
        }
        setIsCzar(roomPlayers.some((p) => p._id === uuid && p.isCzar))
        setPlayers(roomPlayers)
        res(roomPlayers)
      })
    })
  }

  const onGameplayStateChange = async (data) => {
    if (!data) return
    const { state, round } = data

    try {
      sessionStorage.setItem(
        'cardsforus:data',
        JSON.stringify({ name, uuid, roomId, roundNumber: round })
      )
    } catch (e) {
      if (process.env.REACT_APP_NODE_ENV === 'development') console.log(e)
    }

    setRoundNumber(round)
    await getPlayers()
    setGameState(state)

    if (
      gameState &&
      gameState !== GAME_STATES.results &&
      state === GAME_STATES.choosing_card_czar &&
      (round !== roundNumber || round === 1)
    ) {
      cardsRef?.current?.resetStates(true)
      refreshCards('white')
      refreshCards('black')
    }
  }

  useEffect(() => {
    toggleColorMode(isCzar ? 'dark' : 'light')
  }, [isCzar])

  useEffect(() => {
    setShowMenu(true)

    emit('get room', { roomId }, async (data) => {
      if (!data) return
      const { room } = data
      setGameState(room.gameplayState)
      setAllowSkipping(room.allowSkipping)
      setCardPack(room.cardPack, room.round > 1)

      await getPlayers()
    })
  }, [])

  useListener('update players', getPlayers)
  useListener('room gameplay state change', onGameplayStateChange)

  return (
    <Container maxWidth="sm" sx={{ p: 0 }}>
      <GameplayContext.Provider
        value={{
          gameState,
          setGameState,
          players,
          isCzar,
          allowSkipping,
          hydrateCards,
          playerCards,
          skipCard,
          refreshCards,
        }}
      >
        <Czar />
        <Cards ref={cardsRef} />
      </GameplayContext.Provider>
    </Container>
  )
}

export default Gameplay
