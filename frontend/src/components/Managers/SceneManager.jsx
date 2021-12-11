import { Fade, Box } from '@mui/material'
import { useState, useEffect } from 'react'
import { SwitchTransition } from 'react-transition-group'
import { Voting, Caption } from '../Scenes'

const SceneManager = () => {
  const scenes = {
    initial: <Caption />,
    end: <Voting />,
  }
  const [currScene, setCurrScene] = useState('initial')
  const switchScene = () => {
    setCurrScene((p) => (p === 'initial' ? 'end' : 'initial'))
  }

  return (
    <>
      <button onClick={switchScene} type="button">
        switch
      </button>
      <SwitchTransition mode="out-in">
        <Fade key={currScene} in appear unmountOnExit>
          <Box>{scenes[currScene]}</Box>
        </Fade>
      </SwitchTransition>
    </>
  )
}

export default SceneManager
