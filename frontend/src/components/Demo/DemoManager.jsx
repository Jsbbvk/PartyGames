/* eslint-disable import/no-cycle */
import { Fade, Container } from '@mui/material'
import { useState, useEffect, createContext, useContext } from 'react'
import { SwitchTransition } from 'react-transition-group'
import DemoMemes from './DemoMemes'
import DemoCaption from './DemoCaption'
import DemoDisplay from './DemoDisplay'

const DemoContext = createContext()
export const useDemoContext = () => useContext(DemoContext)

const DemoManager = () => {
  const scenes = {
    selection: <DemoMemes />,
    caption: <DemoCaption />,
    display: <DemoDisplay />,
  }

  const [currScene, setCurrScene] = useState('selection')
  const [sceneProps, setSceneProps] = useState({})

  const switchToScene = (scene, props) => {
    setCurrScene(scene)
    if (props) setSceneProps(props)
  }

  return (
    <>
      <DemoContext.Provider value={{ switchToScene, sceneProps }}>
        <SwitchTransition mode="out-in">
          <Fade key={currScene} in unmountOnExit>
            <Container sx={{ py: 5 }}>{scenes[currScene]}</Container>
          </Fade>
        </SwitchTransition>
      </DemoContext.Provider>
    </>
  )
}

export default DemoManager
