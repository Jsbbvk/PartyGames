/* eslint-disable import/no-cycle */
import { Box, Fade, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { SwitchTransition } from 'react-transition-group'
import { useGameplayContext } from '.'
import { GAME_STATES } from '../../../constants'

const Czar = () => {
  const { gameState, setGameState, players, isCzar, hydrateCards } =
    useGameplayContext()
  const [czarCard, setCzarCard] = useState({})

  useEffect(() => {
    if (gameState === GAME_STATES.choosing_card_czar) {
      if (isCzar)
        setCzarCard({ text: 'You are the Card Czar', id: 'you are czar' })
      else {
        const czar = players.find((p) => p.isCzar)
        setCzarCard(
          czar && czar.name
            ? {
                text: `Waiting for Card Czar ${czar?.name}...`,
                id: 'waiting czar',
              }
            : {
                text: '',
                id: 'none',
              }
        )
      }
    } else {
      const czar = players.find((p) => p.isCzar)?.chosenCard
      if (czar) setCzarCard(hydrateCards([czar], 'black')[0])
    }
  }, [players, isCzar, gameState])

  return (
    <Box sx={{ height: '28vh', pt: 10, px: 2 }}>
      <SwitchTransition mode="out-in">
        <Fade
          key={czarCard.id}
          addEndListener={(node, done) =>
            node.addEventListener('transitionend', done, false)
          }
          timeout={250}
        >
          <Typography variant="body1">{czarCard.text}</Typography>
        </Fade>
      </SwitchTransition>
    </Box>
  )
}

export default Czar
