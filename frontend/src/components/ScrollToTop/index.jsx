import { useEffect, useState } from 'react'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { Fab, Zoom, styled, Box } from '@mui/material'

const StyledFab = styled(Fab)({
  boxShadow: 'none',
  backgroundColor: '#363636',
  color: '#FFFFFFDE',
  transition: 'transform 100ms',

  '&:hover': {
    backgroundColor: '#363636',
  },

  '&:active': {
    boxShadow: 'none',
    transform: 'scale(0.94)',
  },
})

const ScrollToTop = ({ top, duration }) => {
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      if (window.pageYOffset > top) {
        setShowButton(true)
      } else {
        setShowButton(false)
      }
    }

    window.addEventListener('scroll', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const scrollToTop = () => {
    const startingY = window.pageYOffset
    const diff = -startingY
    let start

    window.requestAnimationFrame(function step(timestamp) {
      if (!start) start = timestamp
      const time = timestamp - start
      const percent = Math.min(time / duration, 1)

      window.scrollTo(0, startingY + diff * percent)

      if (time < duration) {
        window.requestAnimationFrame(step)
      }
    })
  }

  return (
    <Zoom in={showButton}>
      <Box sx={{ position: 'fixed', bottom: 40, right: 40, zIndex: 2 }}>
        <StyledFab disableRipple onClick={scrollToTop} title="Scroll to top">
          <KeyboardArrowUpIcon />
        </StyledFab>
      </Box>
    </Zoom>
  )
}

export default ScrollToTop
