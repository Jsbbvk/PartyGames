import {
  Box,
  Fab,
  Fade,
  IconButton,
  Modal,
  Stack,
  styled,
  Typography,
} from '@mui/material'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip'
import { useState, useEffect, useRef, useMemo } from 'react'
import { grey } from '@mui/material/colors'
import InfoIcon from '@mui/icons-material/Info'
import { isMobile } from 'react-device-detect'
// eslint-disable-next-line import/no-cycle
import { useDemoContext } from './DemoManager'
import CanvasWorkarea from '../Canvas'

const StyledIconButton = styled(IconButton)({
  display: 'inline',
  padding: 0,
  boxShadow: 'none',
  margin: 5,
  color: '#363636',
})

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
  const [memeDataUrl, setMemeDataUrl] = useState('')

  const handleOnSubmit = async () => {
    const url = workareaRef.current.getDataUrl()
    setSubmittedMeme((p) => !p)
    switchToScene('display', { url })
  }

  return (
    <Stack pb={20}>
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
