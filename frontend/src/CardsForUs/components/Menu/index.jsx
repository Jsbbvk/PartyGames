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

const StyledFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  right: '20px',
  top: '20px',
  textTransform: 'none',
  zIndex: 2,
  color: theme.palette.mode === 'light' ? '#000000de' : '#fff',
  backgroundColor: theme.palette.mode === 'light' ? '#ffffff' : '#363636',
  boxShadow:
    'rgb(0 0 0 / 20%) 0px 3px 1px -2px, rgb(0 0 0 / 14%) 0px 2px 2px 0px, rgb(0 0 0 / 12%) 0px 1px 5px 0px',
  transition:
    'transform 200ms, background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'light' ? '#f8f8f8' : '#3f3f3f',
  },

  '&:active': {
    transform: 'scale(0.93)',
    boxShadow:
      'rgb(0 0 0 / 20%) 0px 3px 1px -2px, rgb(0 0 0 / 14%) 0px 2px 2px 0px, rgb(0 0 0 / 12%) 0px 1px 5px 0px',
  },
}))

const StyledButton = styled(Fab)(({ theme }) => ({
  textTransform: 'none',
  boxShadow: 'none',
  color: '#ffffffDE',
  backgroundColor: theme.palette.mode === 'light' ? '#363636' : '#4d4d4d',
  transition:
    'transform 150ms, background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
  padding: '0 24px',

  '&:hover': {
    background: theme.palette.mode === 'light' ? '#474747' : '#565656',
  },
  '&:active': {
    boxShadow: 'none',
    transform: 'scale(.96)',
  },
}))

const PlayerWrapper = styled(Box)(({ theme }) => ({
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

  '& > div': {
    transition: 'background-color 250ms ease-in-out, color 250ms ease-in-out',
  },

  '& > div:first-of-type': {
    borderRadius: '5px 5px 0 0',
  },

  '& > div:last-of-type': {
    borderRadius: '0 0 5px 5px',
  },

  '& > div:nth-of-type(odd)': {
    backgroundColor:
      theme.palette.mode === 'light' ? 'hsl(0, 0%, 93%)' : 'hsl(0, 0%, 26%)',
  },

  '& > div:nth-of-type(even)': {
    backgroundColor:
      theme.palette.mode === 'light' ? 'hsl(0, 0%, 87%)' : '#545454',
  },
}))

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const Menu = ({ show, players, getPlayers }) => {
  const [openMenu, setOpenMenu] = useState(false)

  const { uuid, roomId, reset } = useGameContext()
  const { switchToScene } = useSceneContext()
  const emit = useEmitter()

  const Player = (name, id, score, isCzar) => (
    <Stack
      alignItems="baseline"
      direction="row"
      justifyContent="space-between"
      p={1}
      key={id}
    >
      <Box sx={{ maxWidth: '75%' }}>
        <Typography
          variant="body1"
          sx={{
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
        >
          {name}
          {uuid === id ? ' (You)' : ''}
        </Typography>
        {isCzar && (
          <Typography
            variant="caption"
            component="span"
            sx={{ fontSize: '0.65rem' }}
          >
            Czar
          </Typography>
        )}
      </Box>
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
              {players.map(
                ({ name: playerName, _id: playerId, points, isCzar }) =>
                  Player(playerName, playerId, points, isCzar)
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
