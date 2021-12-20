/* eslint-disable no-bitwise */
import {
  Box,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  Fade,
  Modal,
  Slide,
  Stack,
  styled,
  Typography,
  useMediaQuery,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useMemo, useState, forwardRef } from 'react'
import { grey } from '@mui/material/colors'

const StyledFab = styled(Fab)({
  position: 'fixed',
  right: '20px',
  top: '20px',
  textTransform: 'none',
  zIndex: 2,
  backgroundColor: '#ffffff',
  boxShadow:
    'rgb(0 0 0 / 20%) 0px 3px 1px -2px, rgb(0 0 0 / 14%) 0px 2px 2px 0px, rgb(0 0 0 / 12%) 0px 1px 5px 0px',

  '&:hover': {
    backgroundColor: '#f8f8f8',
  },

  '&:active': {
    boxShadow:
      'rgb(0 0 0 / 20%) 0px 3px 5px -1px, rgb(0 0 0 / 14%) 0px 6px 10px 0px, rgb(0 0 0 / 12%) 0px 1px 18px 0px',
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
  padding: '8px 16px',
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

  // TODO alternate bg colors for each child
})

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const Menu = () => {
  const [openMenu, setOpenMenu] = useState(false)
  const isSM = useMediaQuery('sm')

  const Player = (name, score, isPlayer) => (
    <Stack alignItems="center" direction="row" justifyContent="space-between">
      <Typography
        variant="p"
        sx={{
          maxWidth: '75%',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        }}
      >
        {name}
        {isPlayer ? ' (You)' : ''}
      </Typography>
      <Typography variant="p">{score}</Typography>
    </Stack>
  )

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
          sx={{ height: '80vh', maxHeight: '550px' }}
        >
          <Box sx={{ height: '90%' }}>
            <Typography variant="h5" sx={{ textAlign: 'center' }}>
              Players
            </Typography>
            <PlayerWrapper>
              {Player('First Fisher', (Math.random() * 10) | 0)}
              {Player('asdf sfdasdfsa', (Math.random() * 10) | 0)}
              {Player('saf asfd isadf', (Math.random() * 10) | 0)}
              {Player('asdf asdf asd', (Math.random() * 10) | 0, true)}
              {Player('asdfasf sdfasdfr', (Math.random() * 10) | 0)}
              {Player('Jonathan Fisher', (Math.random() * 10) | 0)}
              {Player('Jasdfi  asdfsher', (Math.random() * 10) | 0)}
              {Player('Joiuuiup qo er', (Math.random() * 10) | 0)}
              {Player('asdf jkas sr', (Math.random() * 10) | 0)}
            </PlayerWrapper>
          </Box>
          <Stack
            direction="row"
            justifyContent="space-evenly"
            alignItems="center"
          >
            <StyledButton variant="extended" disableRipple>
              Leave
            </StyledButton>
            <StyledButton variant="extended" disableRipple>
              End Game
            </StyledButton>
          </Stack>
        </Stack>
      </Dialog>
    ),
    [openMenu]
  )

  return (
    <>
      {MenuModal}
      <Slide direction="left" in timeout={350}>
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
