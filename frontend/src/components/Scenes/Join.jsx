import { Box, Fab, Stack, styled, TextField, Typography } from '@mui/material'
import { useCallback, useEffect, useRef, useState } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import {
  useListener,
  useEmitter,
  useSceneContext,
  useGameContext,
} from '../Managers'
import { SCENES } from '../../constants'

const StyledButton = styled(Fab)({
  textTransform: 'none',
  boxShadow: 'none',
  color: '#ffffffDE',
  backgroundColor: '#363636',
  transition: 'transform 100ms, background-color 250ms',
  padding: '20px 28px',

  '&:hover': {
    background: '#474747',
  },
  '&:active': {
    boxShadow: 'none',
    transform: 'scale(.96)',
  },
})

const Join = () => {
  const { switchToScene, setSceneProps } = useSceneContext()
  const {
    setName: setGameName,
    setUUID,
    setRoomId: setGameRoomId,
  } = useGameContext()
  const [error, setError] = useState('')
  // TODO change
  const [roomId, setRoomId] = useState('11111')
  const [name, setName] = useState('hi')
  const [isLoading, setIsLoading] = useState(false)
  const buttonRef = useRef(null)

  const emit = useEmitter()

  useEffect(() => {
    setSceneProps({ showMenu: false })
  }, [])

  const onJoinRoom = () => {
    if (isLoading) return
    buttonRef.current.blur()

    setIsLoading(true)

    emit('join room', { roomId, name }, ({ uuid, error: err }) => {
      if (err) {
        setError(err)
        setIsLoading(false)

        return
      }

      setUUID(uuid)
      setGameName(name)
      setGameRoomId(roomId)
      switchToScene(SCENES.waiting)
    })
  }

  const enableJoin = roomId.length === 5 && name.length > 0 && !isLoading

  return (
    <Box>
      <Typography variant="h3" sx={{ textAlign: 'center' }}>
        Join Room
      </Typography>
      <Stack alignItems="center" spacing={2} mt={5}>
        <Box>
          <TextField
            id="join-room-id"
            label={`Room ID (${5 - roomId.length})`}
            variant="outlined"
            value={roomId}
            error={Boolean(error)}
            helperText={error || ''}
            onChange={(e) => {
              setRoomId(e.target.value.toUpperCase() || '')
              setError('')
            }}
            inputProps={{
              maxLength: 5,
            }}
          />
        </Box>
        <Box>
          <TextField
            id="join-name"
            label={`Name (${20 - name.length})`}
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value || '')}
            inputProps={{
              maxLength: 20,
            }}
          />
        </Box>
      </Stack>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        py={4}
        spacing={7}
      >
        <StyledButton
          disableRipple
          onClick={() => switchToScene(SCENES.intro)}
          size="small"
          sx={{ padding: '24px' }}
          title="Back"
        >
          <ArrowBackIcon />
        </StyledButton>
        <StyledButton
          variant="extended"
          disableRipple
          onClick={onJoinRoom}
          disabled={!enableJoin}
          ref={buttonRef}
        >
          <Typography variant="h6">Join!</Typography>
        </StyledButton>
      </Stack>
    </Box>
  )
}

export default Join
