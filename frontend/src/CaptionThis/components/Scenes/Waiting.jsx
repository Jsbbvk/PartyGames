import {
  Box,
  Fab,
  IconButton,
  InputBase,
  Stack,
  styled,
  Tooltip,
  Typography,
  Collapse,
  Slider,
} from '@mui/material'
import { useEffect, useState, useRef, useCallback } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import CheckIcon from '@mui/icons-material/Check'
import LogoutIcon from '@mui/icons-material/Logout'
import { TransitionGroup } from 'react-transition-group'
import debounce from 'lodash/debounce'
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
  height: '50vh',
  maxHeight: '375px',
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

const StyledSlider = styled(Slider)({
  width: 200,

  '& .MuiSlider-thumb': {
    height: 18,
    width: 18,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
    '&:before': {
      display: 'none',
    },
  },
})

const Waiting = () => {
  const { switchToScene, setSceneProps, setShowMenu } = useSceneContext()
  const {
    name,
    setName,
    uuid,
    roomId,
    reset,
    numMemeChoices,
    setNumMemeChoices,
  } = useGameContext()
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

      setPlayers(roomPlayers)
    })
  }

  useListener('update players', getPlayers)

  useEffect(() => {
    setShowMenu(false)
    getPlayers()

    emit('get room', { roomId }, (data) => {
      if (!data) return
      const { error, room } = data
      if (error && process.env.REACT_APP_NODE_ENV === 'development')
        console.log(error)
      setNumMemeChoices(room?.memeChoices)
    })
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

  const emitMemeChange = useCallback(
    debounce((numMemes) => {
      emit('set number meme choices', { roomId, numMemes })
    }, 250),
    [emit, roomId]
  )

  const onMemeChoiceChange = (_, newVal) => {
    setNumMemeChoices(newVal)
    emitMemeChange(newVal)
  }

  return (
    <Stack alignItems="center">
      <Typography variant="h5">Room ID: {roomId}</Typography>
      <Box mt={3}>
        <Typography variant="body2" sx={{ textAlign: 'center' }}>
          Number of meme choices: <b>{numMemeChoices}</b>
        </Typography>
        <StyledSlider
          value={numMemeChoices}
          step={1}
          min={1}
          max={20}
          onChange={onMemeChoiceChange}
        />
      </Box>
      <PlayerWrapper mt={2}>
        <TransitionGroup
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Collapse key={uuid} sx={{ width: '100%' }}>
            <StyledPlayerRow
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              editing={isEditingName}
            >
              {isEditingName ? (
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
                <Typography variant="body1">{name} (You)</Typography>
              )}

              {isEditingName ? (
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
                  <StyledIconButton
                    disableRipple
                    onClick={confirmName}
                    disabled={userName.trim() === ''}
                  >
                    <CheckIcon />
                  </StyledIconButton>
                </Stack>
              ) : (
                <Tooltip placement="right" title="Edit name">
                  <StyledIconButton disableRipple onClick={editName}>
                    <EditIcon />
                  </StyledIconButton>
                </Tooltip>
              )}
            </StyledPlayerRow>
          </Collapse>

          {players
            .filter(({ _id }) => _id !== uuid)
            .map(({ name: playerName, _id: playerId }) => (
              <Collapse key={playerId} sx={{ width: '100%' }}>
                <StyledPlayerRow
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  editing={playerId === uuid && isEditingName}
                >
                  <Typography variant="body1">{playerName}</Typography>

                  <Tooltip placement="right" title="Kick">
                    <StyledIconButton
                      disableRipple
                      onClick={() => removePlayer(playerId)}
                    >
                      <CloseIcon />
                    </StyledIconButton>
                  </Tooltip>
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
