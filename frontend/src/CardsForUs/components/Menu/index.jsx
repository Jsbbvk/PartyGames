import {
  Box,
  Dialog,
  Fab,
  Fade,
  Slide,
  Stack,
  styled,
  Typography,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useMemo, useState, forwardRef, useEffect } from 'react'
import { useEmitter, useGameContext, useSceneContext } from '../Managers'
import { SCENES, STATES } from '../../constants'

const StyledFab = styled(Fab)({
  position: 'fixed',
  right: '20px',
  top: '20px',
  textTransform: 'none',
  zIndex: 2,
  backgroundColor: '#ffffff',
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
})

const StyledButton = styled(Fab)({
  textTransform: 'none',
  boxShadow: 'none',
  color: '#ffffffDE',
  backgroundColor: '#363636',
  transition: 'transform 100ms',
  padding: '0 24px',

  '&:hover': {
    background: '#474747',
  },
  '&:active': {
    boxShadow: 'none',
    transform: 'scale(.96)',
  },
})

const PlayerWrapper = styled(Box)({
  marginTop: 24,
  overflowY: 'auto',
  height: '70%',

  scrollbarWidth: 'thin',
  scrollbarColor: '#adadad #f1f1f1',

  '&::-webkit-scrollbar': {
    width: 5,
  },

  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
  },

  '&::-webkit-scrollbar-thumb': {
    background: '#adadad',
  },

  '&::-webkit-scrollbar-thumb:hover': {
    background: '#919191',
  },

  '& > div:nth-of-type(even)': {
    backgroundColor: '#f0f0f0',
  },
})

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const Menu = ({ show, players, getPlayers }) => {
  const [openMenu, setOpenMenu] = useState(false)

  const { uuid, roomId, reset } = useGameContext()
  const { switchToScene } = useSceneContext()
  const emit = useEmitter()

  const Player = (name, id, score) => (
    <Stack
      alignItems="center"
      direction="row"
      justifyContent="space-between"
      p={0.75}
      key={id}
    >
      <Typography
        variant="body1"
        sx={{
          maxWidth: '75%',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        }}
      >
        {name}
        {uuid === id ? ' (You)' : ''}
      </Typography>
      <Typography variant="body1">{score}</Typography>
    </Stack>
  )

  useEffect(() => {
    if (show) getPlayers()
    else setOpenMenu(false)
  }, [show])

  const leaveGame = () => {
    emit('remove player', { roomId, uuid }, ({ error }) => {
      if (error && process.env.REACT_APP_NODE_ENV === 'development')
        console.log(error)
      reset()
      switchToScene(SCENES.intro)
    })
  }

  const endGame = () =>
    emit('set room state', { roomId, state: STATES.waiting })

  const MenuModal = useMemo(
    () => (
      <Dialog
        open={openMenu}
        onClose={() => setOpenMenu(false)}
        TransitionComponent={Transition}
        fullWidth
        maxWidth="xs"
      >
        <Stack
          justifyContent="space-between"
          pt={4}
          pb={{ xs: 3, md: 6 }}
          px={{ xs: 2, md: 5 }}
          sx={{ height: '87vh', maxHeight: '600px' }}
        >
          <Box sx={{ height: '90%' }}>
            <Typography variant="h5" sx={{ textAlign: 'center' }}>
              Players
            </Typography>
            <PlayerWrapper>
              {players.map(({ name: playerName, _id: playerId, points }) =>
                Player(playerName, playerId, points)
              )}
            </PlayerWrapper>
          </Box>
          <Stack
            direction="row"
            justifyContent="space-evenly"
            alignItems="center"
          >
            <StyledButton variant="extended" disableRipple onClick={leaveGame}>
              Leave
            </StyledButton>
            <StyledButton variant="extended" disableRipple onClick={endGame}>
              End Game
            </StyledButton>
          </Stack>
        </Stack>
      </Dialog>
    ),
    [openMenu, players]
  )

  return (
    <>
      {MenuModal}
      <Slide direction="left" in={show} timeout={350}>
        <StyledFab
          disableRipple
          title="Menu"
          size="small"
          onClick={() => setOpenMenu(true)}
        >
          <MenuIcon sx={{ fontSize: 20 }} />
        </StyledFab>
      </Slide>
    </>
  )
}

export default Menu
