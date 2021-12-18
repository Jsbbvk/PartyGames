import { Typography, Box, Stack, Button, Fab } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useContext, useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { grey, orange } from '@mui/material/colors'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import MemesList from '../../constants/memes'
import { SCENES } from '../../constants'
import { useSceneContext } from '../Managers'
import WaitingForPlayers from '../WaitingForPlayers'
import 'react-lazy-load-image-component/src/effects/blur.css'

const StyledBox = styled(Box)(() => ({
  position: 'relative',
  maxWidth: '90vw',
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',

  '& img': {
    willChange: 'opacity',
    userSelect: 'none',
    boxShadow:
      'rgb(0 0 0 / 20%) 0px 3px 1px -2px, rgb(0 0 0 / 14%) 0px 2px 2px 0px, rgb(0 0 0 / 12%) 0px 1px 5px 0px',
  },
}))

const StyledFab = styled(Fab)({
  textTransform: 'none',
  boxShadow: 'none',
  color: '#ffffffDE',
  backgroundColor: '#363636',
  transition: 'transform 100ms',

  '&:hover': {
    background: grey[900],
  },
  '&:active': {
    boxShadow: 'none',
    transform: 'scale(.96)',
  },
})

const Results = () => {
  const [ready, setReady] = useState(false)
  const { switchToScene } = useSceneContext()

  return (
    <Stack pt={3} pb={10} alignItems="center">
      <Typography variant="h5">Results</Typography>

      <Stack justifyContent="center" alignItems="center" spacing={10} mt={5}>
        {MemesList.slice(0, 10).map(({ src, name }, i) => (
          <StyledBox key={src}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ width: '100%' }}
            >
              <Typography
                variant="p"
                sx={{
                  maxWidth: '75%',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                }}
              >
                12345678901234556790asdfasdfasd
              </Typography>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ color: '#1e88e5' }}
              >
                <Typography variant="p" sx={{ color: '#000000de' }}>
                  {10 - i}
                </Typography>
                <ThumbUpIcon />
              </Stack>
            </Stack>
            <Box mt={1}>
              <LazyLoadImage
                effect="blur"
                src={`/images/memes/${src}`}
                alt={src}
                width={isMobile ? window.innerWidth * 0.8 : '400px'}
              />
            </Box>
            {i < 2 && (
              <Typography
                variant="p"
                sx={{ fontWeight: 600, textAlign: 'right', width: '100%' }}
              >
                +1 point
              </Typography>
            )}
          </StyledBox>
        ))}
      </Stack>

      <Box
        sx={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1,
        }}
      >
        <StyledFab
          variant="extended"
          disableRipple
          onClick={() => setReady(true)}
        >
          Continue
        </StyledFab>
      </Box>

      <WaitingForPlayers transitionIn={ready} numReady={5} numTotal={5} />
    </Stack>
  )
}

export default Results
