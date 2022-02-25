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
import { Gameplay, Intro, Join, Host, Waiting } from '../Scenes'
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
    [SCENES.gameplay]: <Gameplay />,
    [SCENES.waiting]: <Waiting />,
  }

  const [currScene, setCurrScene] = useState(SCENES.intro)
  const [sceneProps, setSceneProps] = useState({})
  const [players, setPlayers] = useState([])
  const [showMenu, setShowMenu] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [reconnectRoomData, setReconnectRoomData] = useState({})

  const { roomId, uuid, name, set, reset, roundNumber } = useGameContext()
  const emit = useEmitter()

  const switchToScene = (scene, props) => {
    if (scene === currScene) return

    setCurrScene(scene)
    if (props) setSceneProps(props)
  }

  const setProps = (props) => setSceneProps(props)

  useEffect(() => {
    if (!isMobile || !sessionStorage.getItem('cardsforus:data')) return
    try {
      const roomData = JSON.parse(sessionStorage.getItem('cardsforus:data'))
      if (
        !roomData?.roomId ||
        !roomData?.uuid ||
        !roomData?.name ||
        !roomData?.roundNumber
      )
        return
      emit(
        'is room active',
        { roomId: roomData.roomId },
        ({ error, roomActive }) => {
          if (error || !roomActive) return
          setReconnectRoomData(roomData)
          setOpenModal(true)
        }
      )
    } catch (e) {
      if (process.env.REACT_APP_NODE_ENV === 'development') console.log(e)
    }
  }, [])

  useListener('room state change', ({ state, error }) => {
    if (error || state === currScene) return

    if (state === SCENES.gameplay) {
      try {
        sessionStorage.setItem(
          'cardsforus:data',
          JSON.stringify({ name, uuid, roomId, roundNumber })
        )
      } catch (e) {
        if (process.env.REACT_APP_NODE_ENV === 'development') console.log(e)
      }
    } else if (state === SCENES.waiting) {
      sessionStorage.setItem('cardsforus:data', '')
      sessionStorage.setItem('cardsforus:skips', '')
    }

    switchToScene(state)
  })

  const getPlayers = () => {
    if (!roomId) return
    emit('get players', { roomId }, (data) => {
      const { players: roomPlayers, error } = data
      if (error) {
        if (process.env.REACT_APP_NODE_ENV === 'development') console.log(error)
        if (
          error === 'Room not found' &&
          (currScene === SCENES.waiting || currScene === SCENES.gameplay)
        ) {
          // room inactive, so kick them out
          reset()
          switchToScene(SCENES.intro)
        }
        return
      }

      const inRoom = roomPlayers.some(({ _id: playerId }) => uuid === playerId)
      if (!inRoom) {
        // handle getting kicked
        reset()
        switchToScene(SCENES.intro)
        return
      }

      if (
        roomPlayers.length < MIN_PLAYERS_TO_START &&
        currScene === SCENES.gameplay
      )
        emit('set room state', { roomId, state: STATES.waiting })

      setPlayers(roomPlayers)
    })
  }

  useListener('update players', getPlayers)

  const reconnect = () => {
    set(reconnectRoomData)
    setOpenModal(false)
    emit('reconnect', {
      uuid: reconnectRoomData.uuid,
      roomId: reconnectRoomData.roomId,
    })
  }

  const cancelReconnect = () => {
    setOpenModal(false)
    sessionStorage.setItem('cardsforus:data', '')
    emit('remove player', {
      uuid: reconnectRoomData.uuid,
      roomId: reconnectRoomData.roomId,
    })
  }

  const ReconnectModal = (
    <Modal
      open={openModal}
      onClose={() => {}}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      disableEscapeKeyDown
      disableAutoFocus
    >
      <Fade in={openModal}>
        <StyledModalBox>
          <Typography id="modal-modal-title" variant="h5">
            Reconnect?
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            RoomID: <b>{reconnectRoomData?.roomId}</b>
          </Typography>
          <Typography variant="body1">
            Name: <b>{reconnectRoomData?.name}</b>
          </Typography>

          <Stack
            mt={5}
            spacing={2}
            direction="row"
            alignItems="center"
            justifyContent="space-around"
          >
            <Button variant="extended" disableRipple onClick={cancelReconnect}>
              No
            </Button>
            <Button variant="extended" disableRipple onClick={reconnect}>
              Reconnect
              <ConnectWithoutContactIcon sx={{ ml: 1 }} />
            </Button>
          </Stack>
        </StyledModalBox>
      </Fade>
    </Modal>
  )

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
        {ReconnectModal}
        <Menu show={showMenu} players={players} getPlayers={getPlayers} />
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
