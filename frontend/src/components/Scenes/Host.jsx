import { Box, Stack, TextField, Typography } from '@mui/material'
import { useEffect } from 'react'
import { useGameContext, useSceneContext } from '../Managers'

const Host = () => {
  const { switchToScene, sceneProps, setSceneProps } = useSceneContext()
  const { emit, on } = useGameContext()

  useEffect(() => {
    setSceneProps({ hideMenu: true })
  }, [])

  useEffect(() => {
    on('welcome', (data) => console.log(data))
  }, [on])

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
    </Box>
  )
}

export default Host
