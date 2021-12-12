import { Fade, Box, Container } from '@mui/material'
import { useState, useEffect } from 'react'
import { SwitchTransition } from 'react-transition-group'
import { Voting, Caption, Selection } from '../Scenes'

const SceneManager = () => {
  const scenes = {
    selection: <Selection />,
    caption: <Caption />,
    voting: <Voting />,
  }
  const [currScene, setCurrScene] = useState('selection')

  return (
    <>
      <SwitchTransition mode="out-in">
        <Fade key={currScene} in unmountOnExit>
          <Container sx={{ py: 5 }}>{scenes[currScene]}</Container>
        </Fade>
      </SwitchTransition>
    </>
  )
}

export default SceneManager
