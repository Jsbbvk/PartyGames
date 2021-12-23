import { Box, Stack, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useListener, useEmitter, useSceneContext } from '../Managers'

const Host = () => {
  const { switchToScene, sceneProps, setSceneProps } = useSceneContext()

  const emit = useEmitter()

  useEffect(() => {
    setSceneProps({ hideMenu: true })
  }, [])

  const onCreateRoom = () =>
    emit('create room', { roomId: '1111', name: 'joe' }, (data) =>
      console.log(data)
    )

  return (
    <Box>
      <Typography variant="h3" sx={{ textAlign: 'center' }}>
        Host Room
      </Typography>
      <Stack alignItems="center" spacing={2} mt={5}>
        <Box>
          <TextField id="host-room-id" label="Room ID" variant="outlined" />
        </Box>
        <Box>
          <TextField id="host-name" label="Name" variant="outlined" />
        </Box>
      </Stack>
      <Stack>
        <button type="button" onClick={onCreateRoom}>
          Create
        </button>
      </Stack>
    </Box>
  )
}

export default Host
