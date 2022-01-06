import {
  Fade,
  Container,
  Modal,
  styled,
  Box,
  Typography,
  Stack,
} from '@mui/material'
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact'
import { useState, useEffect, createContext, useContext } from 'react'
import { SwitchTransition } from 'react-transition-group'
import { isMobile } from 'react-device-detect'
import { Selection, Results, Intro, Join, Host, Waiting } from '../Scenes'
import { MIN_PLAYERS_TO_START, SCENES, STATES } from '../../constants'
import Menu from '../Menu'
import { useEmitter, useGameContext, useListener } from '.'
import Button from '../widgets/Button'

const SceneContext = createContext()
export const useSceneContext = () => useContext(SceneContext)

const StyledModalBox = styled(Box)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  textAlign: 'center',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 400,
  backgroundColor: 'white',
  boxShadow: 24,
  padding: 32,
  borderRadius: 7,
})

const SceneManager = () => {
  const scenes = {
    [SCENES.intro]: <Intro />,
    [SCENES.join]: <Join />,
    [SCENES.host]: <Host />,
    [SCENES.selection]: <Selection />,
    [SCENES.results]: <Results />,
    [SCENES.waiting]: <Waiting />,
  }

  const [currScene, setCurrScene] = useState(SCENES.selection)
  const [sceneProps, setSceneProps] = useState({})
  const [players, setPlayers] = useState([])
  const [showMenu, setShowMenu] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [reconnectRoomData, setReconnectRoomData] = useState({})

  const { roomId, uuid, name, set, reset } = useGameContext()
  const emit = useEmitter()

  const switchToScene = (scene, props) => {
    if (scene === currScene) return

    setCurrScene(scene)
    if (props) setSceneProps(props)
  }

  const setProps = (props) => setSceneProps(props)

  return (
    <>
      <SceneContext.Provider
        value={{
          switchToScene,
          sceneProps,
          setSceneProps: setProps,
          setShowMenu,
        }}
      >
        <SwitchTransition mode="out-in">
          <Fade key={currScene} in unmountOnExit>
            <Container sx={{ pb: 10 }}>{scenes[currScene]}</Container>
          </Fade>
        </SwitchTransition>
      </SceneContext.Provider>
    </>
  )
}

export default SceneManager
