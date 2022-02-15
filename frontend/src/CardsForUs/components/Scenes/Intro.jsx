import {
  Box,
  Fab,
  IconButton,
  Stack,
  styled,
  Typography,
  Zoom,
  useMediaQuery,
} from '@mui/material'
import { useEffect, useContext } from 'react'
import GitHubIcon from '@mui/icons-material/GitHub'
import { isMobile } from 'react-device-detect'
import { useNavigate } from 'react-router-dom'
import { useSceneContext } from '../Managers'
import { SCENES } from '../../constants'
import { useWindowDimensions } from '../Hooks'

import { ThemeContext } from '../../../App'

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
  boxShadow: 'none',
  color: '#ffffffDE',
  backgroundColor: '#363636',
  transition: 'transform 100ms',
  fontSize: '1.5rem',
  padding: '35px 72px',
  borderRadius: '40px',

  '&:hover': {
    background: '#474747',
  },
  '&:active': {
    boxShadow: 'none',
    transform: 'scale(.96)',
  },
})

const StyledIconButton = styled(IconButton)({
  padding: 0,
  color: '#000000de',
})

const Card = styled(Box)({
  width: '100%',
  height: '100%',
  border: '2px solid #000000a2',
  borderRadius: '14px',
  position: 'absolute',
  backgroundColor: '#fff',
  cursor: 'pointer',
  padding: '40px 30px',
  transition: 'transform 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
})

const Intro = () => {
  const { switchToScene, sceneProps, setSceneProps, setShowMenu } =
    useSceneContext()
  const { toggleColorMode } = useContext(ThemeContext)
  const { width, height } = useWindowDimensions()

  const xs = useMediaQuery((theme) => theme.breakpoints.down('xs'))

  useEffect(() => {
    setShowMenu(false)
    toggleColorMode('light')
  }, [])

  return (
    <Box textAlign="center" py={10}>
      <Typography variant="h3">Cards For Us</Typography>

      <Typography variant="body1" sx={{ mt: 1 }}>
        <i>(not) Cards Against Humanity</i>
      </Typography>

      <Zoom in timeout={700}>
        <Stack alignItems="center">
          <Box
            sx={{
              mt: { xs: 7, md: 10 },
              mb: { xs: 10, sm: 12, md: 7.5 },
              position: 'relative',
              height: 0.3 * width * 1.4,
              width: 0.3 * width,
              maxHeight: '420px',
              maxWidth: '300px',
              minWidth: '160px',
              minHeight: '220px',
            }}
          >
            <Card
              sx={{
                left: '50%',
                transform: 'translate(-25%, 15px) rotate(10deg)',
                backgroundColor: '#000',
                color: '#fff',
                '&:hover': {
                  transform: 'translate(-10%, -5px) rotate(5deg) scale(1.1)',
                },
              }}
              onClick={() => switchToScene(SCENES.join)}
            >
              <Typography
                sx={{
                  fontSize: { xs: '2rem', sm: '3rem' },
                }}
              >
                Join
              </Typography>
            </Card>

            <Card
              sx={{
                left: '50%',
                transform: ' translate(-85%, 5px) rotate(350deg)',
                '&:hover': {
                  transform: 'translate(-80%, -15px) rotate(355deg) scale(1.1)',
                },
              }}
              onClick={() => switchToScene(SCENES.host)}
            >
              <Typography
                sx={{
                  fontSize: { xs: '2rem', sm: '3rem' },
                }}
              >
                Host
              </Typography>
            </Card>
          </Box>
        </Stack>
      </Zoom>

      <Box
        sx={{
          mt: { xs: 5, md: 8 },
        }}
      >
        <Typography variant="body2">By Jacob Zhang</Typography>
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
