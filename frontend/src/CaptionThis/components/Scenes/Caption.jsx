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
import InfoIcon from '@mui/icons-material/Info'
import ArrowBack from '@mui/icons-material/ArrowBack'
import {
  useEmitter,
  useGameContext,
  useSceneContext,
  useListener,
} from '../Managers'
import CanvasWorkarea from '../Canvas'
import WaitingForPlayers from '../WaitingForPlayers'
import { SCENES, STATES } from '../../constants'

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
  const { sceneProps, setShowMenu, switchToScene } = useSceneContext()
  const { uuid, roomId } = useGameContext()
  const workareaRef = useRef(null)

  const [submittedMeme, setSubmittedMeme] = useState(false)
  const [openMemeExampleModal, setOpenMemeExampleModal] = useState(false)
  const [playersReady, setPlayersReady] = useState([0, 1])

  useEffect(() => {
    setShowMenu(true)
  }, [])

  const emit = useEmitter()

  const setPlayers = () => {
    emit('get players', { roomId }, (data) => {
      const { players: roomPlayers, error } = data
      if (error) {
        if (process.env.REACT_APP_NODE_ENV === 'development') console.log(error)
        return
      }

      const numReady = roomPlayers.reduce(
        (accum, curr) => accum + (curr?.ready?.captioning ? 1 : 0),
        0
      )

      setPlayersReady([numReady, roomPlayers.length])
    })
  }

  useListener('update players', () => submittedMeme && setPlayers())

  const handleOnSubmit = () => {
    const url = workareaRef.current?.getDataUrl()
    workareaRef.current?.setCanvasEditable(false)
    setPlayers()
    setSubmittedMeme(true)

    emit('set player meme url', { url, uuid, roomId })
  }

  useEffect(() => {
    if (playersReady[0] > 0 && playersReady[0] === playersReady[1]) {
      emit('set room state', { roomId, state: STATES.voting })
    }
  }, [playersReady])

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

          '&.Mui-disabled': {
            backgroundColor: '#e0e0e0',
          },
        }}
        title="Back to meme selection"
      >
        <ArrowBack sx={{ fontSize: 20 }} />
      </StyledFab>

      <Box textAlign="center" mb={2}>
        <Typography variant="h5">
          {sceneProps?.selectedMeme?.name}

          <DarkTooltip
            title="Show example meme"
            enterDelay={200}
            placement="top"
          >
            <StyledIconButton
              disableRipple
              size="small"
              onClick={() => setOpenMemeExampleModal(true)}
              sx={{ mt: '-7px' }}
            >
              <InfoIcon sx={{ fontSize: 16 }} />
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

      <WaitingForPlayers
        transitionIn={submittedMeme}
        numReady={playersReady[0]}
        numTotal={playersReady[1]}
      />
    </Stack>
  )
}

export default Caption
