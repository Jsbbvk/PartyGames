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

  const emit = useEmitter()

  const onGameplayStateChange = (data) => {
    if (!data) return
    const { state } = data

    console.log(state)
    setGameState(state)
  }

  const getPlayers = () => {
    if (!roomId) return
    emit('get players', { roomId }, (data) => {
      const { players: roomPlayers, error } = data
      if (error) {
        if (process.env.REACT_APP_NODE_ENV === 'development') console.log(error)
        return
      }
      setPlayers(roomPlayers)
    })
  }

  useEffect(() => {
    if (!players.length) return

    setIsCzar(players.some((p) => p._id === uuid && p.isCzar))
  }, [players])

  useEffect(() => {
    toggleColorMode(isCzar ? 'dark' : 'light')
  }, [isCzar])

  useListener('update players', getPlayers)
  useListener('room gameplay state change', onGameplayStateChange)

  return (
    <Container maxWidth="sm" sx={{ p: 0 }}>
      <GameplayContext.Provider
        value={{ gameState, setGameState, players, isCzar }}
      >
        <Czar />
        <Cards />
      </GameplayContext.Provider>
    </Container>
  )
}

export default Gameplay
