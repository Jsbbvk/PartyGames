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
  styled,
  Typography,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useMemo, useState, forwardRef, useRef } from 'react'

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

const StyledModalBox = styled(Box)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#ffffff',
  boxShadow: 24,
  padding: 32,
  width: '90vw',
  maxWidth: '600px',
  height: '80vh',
  maxHeight: '800px',
})

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const Menu = () => {
  const [openMenu, setOpenMenu] = useState(false)

  const MenuModal = useMemo(
    () => (
      <Dialog
        open={openMenu}
        onClose={() => setOpenMenu(false)}
        TransitionComponent={Transition}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ textAlign: 'center' }}>Players</DialogTitle>
        <DialogContent>
          <DialogContentText>Jonathon Spencer</DialogContentText>
          <DialogContentText>Jonathon Spencer</DialogContentText>
          <DialogContentText>Jonathon Spencer</DialogContentText>
          <DialogContentText>Jonathon Spencer</DialogContentText>
          <DialogContentText>Jonathon Spencer</DialogContentText>
        </DialogContent>
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
