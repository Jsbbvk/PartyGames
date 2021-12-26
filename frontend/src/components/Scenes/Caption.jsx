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
import { useSceneContext } from '../Managers'
import CanvasWorkarea from '../Canvas'
import WaitingForPlayers from '../WaitingForPlayers'

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
    background: '#474747',
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
  const workareaRef = useRef(null)

  const [submittedMeme, setSubmittedMeme] = useState(false)
  const [openMemeExampleModal, setOpenMemeExampleModal] = useState(false)
  const [memeDataUrl, setMemeDataUrl] = useState('')

  const handleOnSubmit = () => {
    const url = workareaRef.current.getDataUrl()
    setMemeDataUrl(url)
    setSubmittedMeme((p) => !p)
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

      <Box textAlign="center" mb={2}>
        <Typography variant="h5">
          {sceneProps?.selectedMeme?.name}

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

      {submittedMeme && (
        <Stack alignItems="center" mt={4}>
          <Typography variant="h6">Copied Meme!</Typography>
          <img
            alt="captioned meme"
            src={memeDataUrl}
            width={isMobile ? window.innerWidth * 0.8 : '400px'}
          />
        </Stack>
      )}

      <WaitingForPlayers
        transitionIn={submittedMeme}
        numReady={5}
        numTotal={5}
      />
    </Stack>
  )
}

export default Caption
