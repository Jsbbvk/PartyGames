import { Fade, Container } from '@mui/material'
import { useState, useEffect, createContext, useContext } from 'react'
import { SwitchTransition } from 'react-transition-group'
import {
  Voting,
  Caption,
  Selection,
  Results,
  Intro,
  Join,
  Host,
} from '../Scenes'
import { SCENES } from '../../constants'
import Menu from '../Menu'

const SceneContext = createContext()
export const useSceneContext = () => useContext(SceneContext)

const SceneManager = () => {
  const scenes = {
    [SCENES.intro]: <Intro />,
    [SCENES.join]: <Join />,
    [SCENES.host]: <Host />,
    [SCENES.selection]: <Selection />,
    [SCENES.caption]: <Caption />,
    [SCENES.voting]: <Voting />,
    [SCENES.results]: <Results />,
  }

  const [currScene, setCurrScene] = useState(SCENES.host)
  const [sceneProps, setSceneProps] = useState({})

  const switchToScene = (scene, props) => {
    setCurrScene(scene)
    if (props) setSceneProps(props)
  }

  const setProps = (props) => setSceneProps(props)

  return (
    <>
      <SceneContext.Provider
        value={{ switchToScene, sceneProps, setSceneProps: setProps }}
      >
        <SwitchTransition mode="out-in">
          <Fade key={currScene} in unmountOnExit>
            <Container sx={{ py: 10 }}>
              {!sceneProps?.hideMenu && <Menu />}
              {scenes[currScene]}
            </Container>
          </Fade>
        </SwitchTransition>
      </SceneContext.Provider>
    </>
  )
}

export default SceneManager
