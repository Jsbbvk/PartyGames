/* eslint-disable import/no-cycle */
import { Container } from '@mui/material'
import { createContext, useContext, useEffect, useState } from 'react'
import { ThemeContext } from '../../../../App'
import { GAME_STATES } from '../../../constants'
import { useEmitter, useGameContext, useListener } from '../../Managers'
import Cards from './Cards'
import Czar from './Czar'

const GameplayContext = createContext()
export const useGameplayContext = () => useContext(GameplayContext)

const Gameplay = () => {
  const { roomId, uuid } = useGameContext()
  const { toggleColorMode } = useContext(ThemeContext)
  const [gameState, setGameState] = useState(GAME_STATES.choosing_card_czar)
  const [players, setPlayers] = useState([])
  const [isCzar, setIsCzar] = useState(false)
  const [allowSkipping, setAllowSkipping] = useState(false) // allow skipping as a whole

  const emit = useEmitter()

  const getPlayers = () => {
    // eslint-disable-next-line consistent-return
    return new Promise((res, rej) => {
      if (!roomId) return res()

      emit('get players', { roomId }, (data) => {
        const { players: roomPlayers, error } = data
        if (error) {
          if (process.env.REACT_APP_NODE_ENV === 'development')
            console.log(error)
          return
        }
        console.log('players', roomPlayers)
        setIsCzar(roomPlayers.some((p) => p._id === uuid && p.isCzar))
        setPlayers(roomPlayers)
        res()
      })
    })
  }

  const onGameplayStateChange = async (data) => {
    if (!data) return
    const { state } = data
    console.log(state)
    if (state === gameState) return
    if (
      state === GAME_STATES.choosing_card_czar &&
      gameState === GAME_STATES.results
    )
      await getPlayers()
    setGameState(state)
  }

  useEffect(() => {
    toggleColorMode(isCzar ? 'dark' : 'light')
  }, [isCzar])

  useEffect(() => {
    getPlayers()
  }, [])

  useListener('update players', getPlayers)
  useListener('room gameplay state change', onGameplayStateChange)

  return (
    <Container maxWidth="sm" sx={{ p: 0 }}>
      <GameplayContext.Provider
        value={{ gameState, setGameState, players, isCzar, allowSkipping }}
      >
        <Czar />
        <Cards />
      </GameplayContext.Provider>
    </Container>
  )
}

export default Gameplay
