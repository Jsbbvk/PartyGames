import { Fade, Container } from '@mui/material'
import { useState, useEffect, createContext, useContext } from 'react'
import { SwitchTransition } from 'react-transition-group'
import { Voting, Caption, Selection, Results } from '../Scenes'
import { SCENES } from '../../constants'

const SceneContext = createContext()
export const useSceneContext = () => useContext(SceneContext)

const SceneManager = () => {
  const scenes = {
    [SCENES.selection]: <Selection />,
    [SCENES.caption]: <Caption />,
    [SCENES.voting]: <Voting />,
    [SCENES.results]: <Results />,
  }

  const [currScene, setCurrScene] = useState(SCENES.selection)
  const [sceneProps, setSceneProps] = useState({})

  const switchToScene = (scene, props) => {
    setCurrScene(scene)
    if (props) setSceneProps(props)
  }

  return (
    <>
      <SceneContext.Provider value={{ switchToScene, sceneProps }}>
        <SwitchTransition mode="out-in">
          <Fade key={currScene} in unmountOnExit>
            <Container sx={{ py: 5 }}>{scenes[currScene]}</Container>
          </Fade>
        </SwitchTransition>
      </SceneContext.Provider>
    </>
  )
}

export default SceneManager
