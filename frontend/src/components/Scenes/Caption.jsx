import { Box, Button, Stack, styled, Typography } from '@mui/material'
import { useEffect, useRef } from 'react'
import Canvas from '../Canvas'
import { useSceneContext } from '../Managers'

const StyledButton = styled(Button)({
  textTransform: 'none',
  backgroundColor: '#ffb62f',
  color: '#000000DE',
  '&:hover': {
    backgroundColor: '#ffc352',
  },
})

const Caption = () => {
  const { switchToScene, sceneProps } = useSceneContext()
  const canvasRef = useRef(null)

  useEffect(() => {
    canvasRef.current.setBackgroundImage(sceneProps?.src)
  }, [])

  const onAddText = () => {
    canvasRef.current.addText('Text')
  }

  return (
    <Stack>
      <Box>
        <button type="button" onClick={() => switchToScene('selection')}>
          Back to meme select
        </button>
      </Box>

      <Box textAlign="center">
        <Typography variant="h6">{sceneProps?.name}</Typography>
        <StyledButton variant="contained" onClick={onAddText}>
          Add Caption
        </StyledButton>
      </Box>
      <Box my={2}>
        <Canvas ref={canvasRef} />
      </Box>
      <Stack direction="row" justifyContent="center">
        <StyledButton variant="contained">Submit Meme</StyledButton>
      </Stack>
    </Stack>
  )
}

export default Caption
