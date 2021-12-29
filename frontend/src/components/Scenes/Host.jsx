import { Box, Fab, Stack, styled, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
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

const Host = () => {
  const { switchToScene, setSceneProps, setShowMenu } = useSceneContext()
  const {
    setName: setGameName,
    setUUID,
    setRoomId: setGameRoomId,
  } = useGameContext()
  const [error, setError] = useState('')
  const [roomId, setRoomId] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const emit = useEmitter()

  useEffect(() => {
    setShowMenu(false)
  }, [])

  const onCreateRoom = () => {
    if (isLoading) return

    setIsLoading(true)
    emit(
      'create room',
      { roomId, name: name.trim() },
      ({ uuid, error: err }) => {
        if (err) {
          setError(err)
          setIsLoading(false)
          return
        }

        setUUID(uuid)
        setGameName(name.trim())
        setGameRoomId(roomId)
        switchToScene(SCENES.waiting)
      }
    )
  }

  const enableHost = roomId.length === 5 && name.length > 0 && !isLoading

  return (
    <Box>
      <Typography variant="h3" sx={{ textAlign: 'center' }}>
        Host Room
      </Typography>

      <Stack alignItems="center" spacing={2} mt={5}>
        <Box>
          <TextField
            id="host-room-id"
            label={`Room ID (${5 - roomId.length})`}
            variant="outlined"
            value={roomId}
            error={Boolean(error)}
            helperText={error || ''}
            onChange={(e) => {
              setRoomId(e.target.value.toUpperCase().trim() || '')
              setError('')
            }}
            inputProps={{
              maxLength: 5,
            }}
          />
        </Box>
        <Box>
          <TextField
            id="host-name"
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
          onClick={onCreateRoom}
          disabled={!enableHost}
        >
          <Typography variant="h6">Host!</Typography>
        </StyledButton>
      </Stack>

      <Stack alignItems="center" mt={10}>
        <img
          src="/images/captionthis/host.gif"
          width={250}
          alt="hosting a room"
        />
      </Stack>
    </Box>
  )
}

export default Host
