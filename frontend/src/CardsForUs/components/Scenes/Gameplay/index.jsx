/* eslint-disable import/no-cycle */
import { Container } from '@mui/material'
import { createContext, useContext, useState } from 'react'
import { GAME_STATES } from '../../../constants'
import { useListener } from '../../Managers'
import Cards from './Cards'
import Czar from './Czar'

const GameplayContext = createContext()
export const useGameplayContext = () => useContext(GameplayContext)

const Gameplay = () => {
  const [gameState, setGameState] = useState(GAME_STATES.choosing_card)

  const onGameplayStateChange = (data) => {
    if (!data) return
    const { state } = data

    console.log(state)
    setGameState(state)
  }

  useListener('room gameplay state change', onGameplayStateChange)

  return (
    <Container maxWidth="sm" sx={{ p: 0 }}>
      <GameplayContext.Provider value={{ gameState, setGameState }}>
        <Czar />
        <Cards />
      </GameplayContext.Provider>
    </Container>
  )
}

export default Gameplay
