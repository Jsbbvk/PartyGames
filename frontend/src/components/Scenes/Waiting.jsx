import {
  Box,
  Fab,
  IconButton,
  InputBase,
  Stack,
  styled,
  Tooltip,
  Typography,
  Fade,
  Collapse,
} from '@mui/material'
import { useEffect, useState, useRef } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import CheckIcon from '@mui/icons-material/Check'
import LogoutIcon from '@mui/icons-material/Logout'
import { TransitionGroup } from 'react-transition-group'
import {
  useEmitter,
  useGameContext,
  useListener,
  useSceneContext,
} from '../Managers'
import Button from '../widgets/Button'
import { MIN_PLAYERS_TO_START, SCENES, STATES } from '../../constants'

const PlayerWrapper = styled(Box)({
  overflowY: 'auto',
  height: '75vh',
  maxHeight: '450px',
  width: '90vw',
  maxWidth: '400px',
  padding: '0 8px',

  scrollbarWidth: 'thin',
  scrollbarColor: '#adadad #f1f1f1',

  '&::-webkit-scrollbar': {
    width: 5,
  },

  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
  },

  '&::-webkit-scrollbar-thumb': {
    background: '#adadad',
  },

  '&::-webkit-scrollbar-thumb:hover': {
    background: '#919191',
  },
})

const StyledPlayerRow = styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'editing',
})(({ editing }) => ({
  width: '100%',
  backgroundColor: editing ? '#cccccc' : '#eeeeee',
  padding: '8px 12px',
  margin: '4px 0',
}))

const StyledIconButton = styled(IconButton)({
  padding: 0,
  transition: 'none',

  '& > svg': {
    fontSize: '16px',
    transition: 'none',
  },

  '&:hover': {
    backgroundColor: 'inherit',
    color: '#000000de',
    '&:parent': {
      backgroundColor: '#f1f1f1',
    },
  },
})

const Waiting = () => {
  const { switchToScene, setSceneProps, setShowMenu } = useSceneContext()
  const { name, setName, uuid, roomId, reset } = useGameContext()
  const [players, setPlayers] = useState([])
  const [isEditingName, setIsEditingName] = useState(false)
  const [userName, setUserName] = useState(name)
  const inputRef = useRef(null)

  const emit = useEmitter()

  const getPlayers = () => {
    if (!roomId) return
    emit('get players', { roomId }, (data) => {
      const { players: roomPlayers, error } = data
      if (error) {
        if (process.env.REACT_APP_NODE_ENV === 'development') console.log(error)
        return
      }

      const inRoom = roomPlayers.some(({ _id: playerId }) => uuid === playerId)
      if (!inRoom) {
        // handle getting kicked
        reset()
        switchToScene(SCENES.intro)
        return
      }

      setPlayers(roomPlayers)
    })
  }

  useListener('update players', getPlayers)

  useEffect(() => {
    setShowMenu(false)
    getPlayers()
  }, [])

  const leaveGame = () => {
    emit('remove player', { roomId, uuid }, ({ error }) => {
      if (error && process.env.REACT_APP_NODE_ENV === 'development')
        console.log(error)
      reset()
      switchToScene(SCENES.intro)
    })
  }

  const editName = () => setIsEditingName(true)

  useEffect(() => {
    if (isEditingName) {
      inputRef.current?.focus()
      inputRef.current?.setSelectionRange(0, inputRef.current?.value.length)
    }
  }, [isEditingName])

  const confirmName = () => {
    emit('set player name', { roomId, uuid, name: userName }, ({ error }) => {
      setIsEditingName(false)
      if (error) {
        if (process.env.REACT_APP_NODE_ENV === 'development') console.log(error)
        return
      }
      setName(userName)
    })
  }

  const removePlayer = (playerId) =>
    emit('remove player', { roomId, uuid: playerId }, ({ error }) => {
      if (error && process.env.REACT_APP_NODE_ENV === 'development')
        console.log(error)
    })

  const startGame = () =>
    emit('restart game', { roomId, state: STATES.captioning })

  return (
    <Stack alignItems="center">
      <Typography variant="h5">Room ID: {roomId}</Typography>
      <PlayerWrapper mt={2}>
        <TransitionGroup
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {players.map(({ name: playerName, _id: playerId }) => (
            <Collapse key={playerId} sx={{ width: '100%' }}>
              <StyledPlayerRow
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                editing={playerId === uuid && isEditingName}
              >
                {playerId === uuid && isEditingName ? (
                  <InputBase
                    inputRef={inputRef}
                    value={userName}
                    autoFocus
                    onBlur={() => {}}
                    onChange={(e) => setUserName(e.target.value || '')}
                    sx={{ p: 0, width: '85%' }}
                    inputProps={{
                      maxLength: 20,
                      style: { padding: 0 },
                    }}
                  />
                ) : (
                  <Typography variant="body1">
                    {playerName}
                    {playerId === uuid ? ' (You)' : ''}
                  </Typography>
                )}

                {playerId === uuid && isEditingName ? (
                  <Stack direction="row" spacing={1}>
                    <StyledIconButton
                      disableRipple
                      onClick={() => {
                        setUserName(name)
                        setIsEditingName(false)
                      }}
                    >
                      <CloseIcon />
                    </StyledIconButton>
                    <StyledIconButton disableRipple onClick={confirmName}>
                      <CheckIcon />
                    </StyledIconButton>
                  </Stack>
                ) : (
                  <Tooltip
                    placement="right"
                    title={playerId === uuid ? 'Edit name' : 'Kick'}
                  >
                    <StyledIconButton
                      disableRipple
                      onClick={() =>
                        playerId === uuid ? editName() : removePlayer(playerId)
                      }
                    >
                      {playerId === uuid ? <EditIcon /> : <CloseIcon />}
                    </StyledIconButton>
                  </Tooltip>
                )}
              </StyledPlayerRow>
            </Collapse>
          ))}
        </TransitionGroup>
      </PlayerWrapper>
      <Stack direction="row" alignItems="center" spacing={5} mt={3}>
        <Tooltip placement="top" title="Leave">
          <Button size="small" sx={{ p: 3 }} disableRipple onClick={leaveGame}>
            <LogoutIcon sx={{ fontSize: 18 }} />
          </Button>
        </Tooltip>
        <Button
          variant="extended"
          disableRipple
          disabled={isEditingName || players.length < MIN_PLAYERS_TO_START}
          sx={{
            transition: 'transform 100ms, background-color 250ms',
          }}
          onClick={startGame}
        >
          {players.length < MIN_PLAYERS_TO_START
            ? `${MIN_PLAYERS_TO_START - players.length} more player${
                MIN_PLAYERS_TO_START - players.length <= 1 ? '' : 's'
              }`
            : 'Start'}
        </Button>
      </Stack>
    </Stack>
  )
}

export default Waiting
