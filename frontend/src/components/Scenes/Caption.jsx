import {
  Box,
  Button,
  Fab,
  Fade,
  IconButton,
  LinearProgress,
  Modal,
  Stack,
  styled,
  Typography,
} from '@mui/material'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip'
import { useState, useEffect, useRef, useMemo } from 'react'
import { green, grey, orange, red } from '@mui/material/colors'
import InfoIcon from '@mui/icons-material/Info'
import { SwitchFade } from '../Transitions'
import { useSceneContext } from '../Managers'
import CanvasWorkarea from '../Canvas'

const DarkTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#363636',
    color: 'ffffffDE',
  },
})

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
    background: grey[900],
  },
  '&:active': {
    boxShadow: 'none',
    transform: 'scale(.96)',
  },
})

const StyledModalBox = styled(Box)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  backgroundColor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  padding: 32,
})

const Caption = () => {
  const { switchToScene, sceneProps } = useSceneContext()
  const canvasRef = useRef(null)

  const [submittedMeme, setSubmittedMeme] = useState(false)
  const [playersReadyPercent, setPlayersReadyPercent] = useState(0)
  const [openMemeExampleModal, setOpenMemeExampleModal] = useState(false)

  useEffect(() => {
    // canvasRef.current.setBackgroundImage()
  }, [])

  const handleOnSubmit = () => {
    setSubmittedMeme((p) => !p)
    setTimeout(() => setPlayersReadyPercent(0.7), 300)
  }

  const ExampleMemeModal = useMemo(
    () => (
      <Modal
        open={openMemeExampleModal}
        onClose={() => setOpenMemeExampleModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Fade in={openMemeExampleModal}>
          <StyledModalBox>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Example Meme here
            </Typography>
          </StyledModalBox>
        </Fade>
      </Modal>
    ),
    [openMemeExampleModal]
  )

  return (
    <Stack pb={20}>
      {ExampleMemeModal}
      <Box>
        <button type="button" onClick={() => switchToScene('selection')}>
          Back to meme select
        </button>
      </Box>

      <Box textAlign="center" mb={2}>
        <Typography variant="h5">
          {sceneProps?.name}

          <DarkTooltip title="Show example meme" enterDelay={200}>
            <StyledIconButton
              disableRipple
              size="small"
              onClick={() => setOpenMemeExampleModal(true)}
            >
              <InfoIcon />
            </StyledIconButton>
          </DarkTooltip>
        </Typography>
      </Box>

      <Box mb={2}>
        <CanvasWorkarea backgroundImage={sceneProps?.src} />
      </Box>

      <Stack alignItems="center" justifyContent="center">
        <SwitchFade
          firstChild={
            <StyledFab
              variant="extended"
              onClick={handleOnSubmit}
              disableRipple
            >
              Submit Meme
            </StyledFab>
          }
          secondChild={
            <Box>
              <Box p={1}>
                <Typography variant="h6">Waiting for Players 4/6</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={playersReadyPercent * 100}
              />
              <button onClick={handleOnSubmit} type="button">
                back
              </button>
            </Box>
          }
          switched={submittedMeme}
          keys={submittedMeme ? 'waiting' : 'submit-button'}
        />
      </Stack>
    </Stack>
  )
}

export default Caption
