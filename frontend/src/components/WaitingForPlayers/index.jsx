import { Box, LinearProgress, Slide, Typography } from '@mui/material'
import { useRef } from 'react'

const WaitingForPlayers = ({ transitionIn, numReady, numTotal }) => {
  const wrapperRef = useRef(null)

  return (
    <Box
      ref={wrapperRef}
      sx={{
        position: 'fixed',
        zIndex: 1,
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
      }}
    >
      <Slide in={transitionIn} direction="up" container={wrapperRef.current}>
        <Box
          sx={{
            padding: '15px 40px 25px 40px',
            bgcolor: '#363636',
            borderRadius: '4px',
            color: () => {
              const percentage = numReady / numTotal
              if (percentage < 0.5) return '#d32f2f'
              if (percentage < 1) return '#fbc02d'
              return '#66bb6a'
            },
          }}
        >
          <Box p={1}>
            <Typography variant="h6" sx={{ color: '#ffffffde' }}>
              Waiting for players... {numReady}/{numTotal}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={(numReady / numTotal) * 100}
            color="inherit"
          />
        </Box>
      </Slide>
    </Box>
  )
}

export default WaitingForPlayers
