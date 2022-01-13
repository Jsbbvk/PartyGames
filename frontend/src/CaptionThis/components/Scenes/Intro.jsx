import {
  Box,
  Fab,
  IconButton,
  Stack,
  styled,
  Tooltip,
  Typography,
} from '@mui/material'
import { useEffect } from 'react'
import GitHubIcon from '@mui/icons-material/GitHub'
import DevicesIcon from '@mui/icons-material/Devices'
import BallotIcon from '@mui/icons-material/Ballot'
import CelebrationIcon from '@mui/icons-material/Celebration'
import { useNavigate } from 'react-router-dom'
import { useSceneContext } from '../Managers'
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

const StyledButton = styled(Fab)({
  textTransform: 'none',
  margin: '0 25px',
  color: '#ffffffde',
  fontSize: '1.5rem',
  position: 'relative',
  borderRadius: '50%',
  maxWidth: 125,
  maxHeight: 125,
  width: '30vw',
  height: '30vw',
  background: '#f00000',
  boxShadow: '0 11px 0 0 #8C0606',
  border: 'none',
  top: '2%',
  transition: 'all .2s ease',
  '&:hover': {
    background: '#f00000',
    boxShadow: '0 11px 0 0 #8C0606',
  },

  '&:active': {
    boxShadow: '0 1px 1px 1px #8C0606',
    top: '10%',
  },
})

const StyledIconButton = styled(IconButton)({
  padding: 0,
  color: '#000000de',
})

const Intro = () => {
  const { switchToScene, sceneProps, setSceneProps, setShowMenu } =
    useSceneContext()

  const navigate = useNavigate()

  useEffect(() => {
    setShowMenu(false)
  }, [])

  return (
    <Box textAlign="center">
      <Typography variant="h3">Caption This!</Typography>

      <Typography variant="body1" sx={{ mt: 1 }}>
        <i>How dank are you?</i>
      </Typography>

      <Box sx={{ mt: { xs: 3, md: 10 }, height: '150px' }}>
        <StyledButton
          disableRipple
          variant="extended"
          onClick={() => switchToScene(SCENES.host)}
        >
          Host
        </StyledButton>
        <StyledButton
          disableRipple
          variant="extended"
          onClick={() => switchToScene(SCENES.join)}
        >
          Join
        </StyledButton>
      </Box>

      <Stack alignItems="center" mt={{ xs: 3, md: 7 }}>
        <img
          src="/images/captionthis/struggle.jpg"
          alt="struggle"
          width="200"
        />
      </Stack>

      <Box
        sx={{
          mt: { xs: 5, md: 8 },
        }}
      >
        <Stack
          spacing={2}
          my={2}
          direction="row"
          alignItems="center"
          justifyContent="center"
        >
          <Tooltip title="Demo" placement="top">
            <StyledFab
              disableRipple
              size="small"
              onClick={() => navigate('/captionthis/demo')}
            >
              <DevicesIcon sx={{ fontSize: 18 }} />
            </StyledFab>
          </Tooltip>
          <Tooltip title="Memes List" placement="top">
            <StyledFab
              disableRipple
              size="small"
              onClick={() => navigate('/captionthis/memes')}
            >
              <BallotIcon sx={{ fontSize: 18 }} />
            </StyledFab>
          </Tooltip>
          <Tooltip title="?" placement="top">
            <StyledFab
              disableRipple
              size="small"
              onClick={() =>
                window.open(
                  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                  '_blank'
                )
              }
            >
              <CelebrationIcon sx={{ fontSize: 18 }} />
            </StyledFab>
          </Tooltip>
        </Stack>
        <Typography variant="body2">
          By Jacob Zhang{' '}
          <a
            href="/images/captionthis/credits.jpg"
            target="_blank"
            style={{ fontSize: '0.7em' }}
          >
            ...and friends
          </a>
        </Typography>
        <StyledIconButton
          disableRipple
          title="Github Repo"
          onClick={() =>
            window.open('https://github.com/Jsbbvk/PartyGames', '_blank')
          }
        >
          <GitHubIcon />
        </StyledIconButton>
      </Box>
    </Box>
  )
}

export default Intro
