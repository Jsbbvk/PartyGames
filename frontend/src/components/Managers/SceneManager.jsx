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
  Waiting,
} from '../Scenes'
import {
  MIN_PLAYERS_TO_START,
  SCENES,
  STATES,
  STATES_TO_SCENES,
} from '../../constants'
import Menu from '../Menu'
import { useEmitter, useGameContext, useListener } from '.'

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
    [SCENES.waiting]: <Waiting />,
  }

  const [currScene, setCurrScene] = useState(SCENES.intro)
  const [sceneProps, setSceneProps] = useState({})
  const [players, setPlayers] = useState([])
  const [showMenu, setShowMenu] = useState(false)
  const { roomId } = useGameContext()
  const emit = useEmitter()

  const switchToScene = (scene, props) => {
    setCurrScene(scene)
    if (props) setSceneProps(props)
  }

  const setProps = (props) => setSceneProps(props)

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (
        currScene === SCENES.selection ||
        currScene === SCENES.caption ||
        currScene === SCENES.voting ||
        currScene === SCENES.results
      ) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  useListener('room state change', ({ state, error }) => {
    if (error) return
    switchToScene(STATES_TO_SCENES[state])
  })

  const getPlayers = () => {
    if (!roomId) return
    emit('get players', { roomId }, (data) => {
      const { players: roomPlayers, error } = data
      if (error) {
        if (process.env.REACT_APP_NODE_ENV === 'development') console.log(error)
        return
      }

      if (
        roomPlayers.length < MIN_PLAYERS_TO_START &&
        (currScene === SCENES.selection ||
          currScene === SCENES.caption ||
          currScene === SCENES.voting ||
          currScene === SCENES.results)
      )
        emit('set room state', { roomId, state: STATES.waiting })

      setPlayers(roomPlayers)
    })
  }

  useListener('update players', getPlayers)

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
        <Menu show={showMenu} players={players} getPlayers={getPlayers} />
        <SwitchTransition mode="out-in">
          <Fade key={currScene} in unmountOnExit>
            <Container sx={{ py: 10 }}>{scenes[currScene]}</Container>
          </Fade>
        </SwitchTransition>
      </SceneContext.Provider>
    </>
  )
}

export default SceneManager
