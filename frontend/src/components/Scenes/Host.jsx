import { Box, Stack, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useListener, useEmitter, useSceneContext } from '../Managers'

const Host = () => {
  const { switchToScene, sceneProps, setSceneProps } = useSceneContext()
  const [data, setData] = useState('nothing')

  const emit = useEmitter('response')

  useEffect(() => {
    setSceneProps({ hideMenu: true })

    console.log('emitting')
    emit({ data }, (res) => console.log(res))
  }, [])

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
      <Typography>{data}</Typography>
    </Box>
  )
}

export default Host
