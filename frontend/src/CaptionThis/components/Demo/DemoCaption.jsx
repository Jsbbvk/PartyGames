/* eslint-disable import/no-cycle */
import {
  Box,
  Fab,
  Fade,
  IconButton,
  Stack,
  styled,
  Typography,
} from '@mui/material'
import { useState, useRef } from 'react'
import ArrowBack from '@mui/icons-material/ArrowBack'
import { useDemoContext } from './DemoManager'
import CanvasWorkarea from '../Canvas'
import { SCENES } from '../../constants'

const StyledFab = styled(Fab)({
  textTransform: 'none',
  boxShadow: 'none',
  color: '#ffffffDE',
  backgroundColor: '#363636',
  transition: 'transform 100ms',

  '&:hover': {
    background: '#474747',
  },
  '&:active': {
    boxShadow: 'none',
    transform: 'scale(.96)',
  },
})

const DemoCaption = () => {
  const { switchToScene, sceneProps } = useDemoContext()
  const workareaRef = useRef(null)

  const [submittedMeme, setSubmittedMeme] = useState(false)

  const handleOnSubmit = async () => {
    const url = workareaRef.current.getDataUrl()
    setSubmittedMeme((p) => !p)
    switchToScene('display', { url })
  }

  return (
    <Stack pb={20}>
      <StyledFab
        disableRipple
        onClick={() => switchToScene(SCENES.selection)}
        size="small"
        disabled={submittedMeme}
        sx={{
          padding: '12px',
          position: 'fixed',
          zIndex: 2,
          top: '20px',
          left: '20px',
          backgroundColor: '#ffffff',
          color: '#000000de',
          boxShadow:
            'rgb(0 0 0 / 20%) 0px 3px 1px -2px, rgb(0 0 0 / 14%) 0px 2px 2px 0px, rgb(0 0 0 / 12%) 0px 1px 5px 0px',
          transition: 'transform 200ms',
          '&:hover': {
            backgroundColor: '#f8f8f8',
          },

          '&:active': {
            transform: 'scale(0.93)',
            boxShadow:
              'rgb(0 0 0 / 20%) 0px 3px 1px -2px, rgb(0 0 0 / 14%) 0px 2px 2px 0px, rgb(0 0 0 / 12%) 0px 1px 5px 0px',
          },
        }}
        title="Back to meme selection"
      >
        <ArrowBack sx={{ fontSize: 20 }} />
      </StyledFab>

      <Box textAlign="center" mb={2}>
        <Typography variant="h5">{sceneProps?.selectedMeme?.name}</Typography>
      </Box>

      <Box mb={2}>
        <CanvasWorkarea
          backgroundImage={sceneProps?.selectedMeme?.src}
          ref={workareaRef}
        />
      </Box>

      <Stack alignItems="center" justifyContent="center">
        <Fade in={!submittedMeme}>
          <StyledFab variant="extended" onClick={handleOnSubmit} disableRipple>
            Submit Meme
          </StyledFab>
        </Fade>
      </Stack>
    </Stack>
  )
}

export default DemoCaption
