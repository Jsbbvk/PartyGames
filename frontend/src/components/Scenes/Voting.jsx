import { Typography, Box, Stack, Button, Fab } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useContext, useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { grey, orange } from '@mui/material/colors'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import MemesList from '../../constants/memes'
import { SCENES } from '../../constants'
import { useSceneContext } from '../Managers'
import WaitingForPlayers from '../WaitingForPlayers'
import 'react-lazy-load-image-component/src/effects/blur.css'

const StyledBox = styled(Box)(({ selected, voted }) => ({
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
    border: '2px solid #dbdbdb',
    transition:
      'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, opacity 300ms',

    boxShadow: selected
      ? 'rgb(0 0 0 / 20%) 0px 7px 8px -4px, rgb(0 0 0 / 14%) 0px 12px 17px 2px, rgb(0 0 0 / 12%) 0px 5px 22px 4px'
      : 'none',
    opacity: (!voted && selected) || (voted && !selected) ? '0.6' : '1',

    '@media(hover: hover) and (pointer: fine)': {
      '&:hover': {
        cursor: voted ? 'auto' : 'pointer',
        boxShadow:
          voted && !selected
            ? 'none'
            : 'rgb(0 0 0 / 20%) 0px 7px 8px -4px, rgb(0 0 0 / 14%) 0px 12px 17px 2px, rgb(0 0 0 / 12%) 0px 5px 22px 4px',
      },
    },
  },

  '& .caption-button': {
    transition: 'opacity 300ms, background-color 250ms, transform 100ms',
    opacity: !voted && selected ? 1 : 0,
    pointerEvents: !voted && selected ? 'auto' : 'none',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#363636',
    boxShadow: 'none',
    textTransform: 'none',
    color: '#ffffffDE',

    '&:hover': {
      background: grey[900],
      boxShadow: 'none',
    },
    '&:active': {
      boxShadow: 'none',
      transform: 'translate(-50%, -50%) scale(.96)',
    },
  },
}))

const Voting = () => {
  const [selectedMeme, setSelectedMeme] = useState()
  const [votedMeme, setVotedMeme] = useState()
  const { switchToScene } = useSceneContext()

  const onMemeSelect = (selected) => {
    if (votedMeme) return
    if (!selectedMeme || selected.src !== selectedMeme?.src)
      setSelectedMeme(selected)
    else setSelectedMeme(null)
  }

  const onMemeChoiceConfirm = (src) => {
    if (!selectedMeme || src !== selectedMeme?.src) return

    setVotedMeme(selectedMeme)
  }

  return (
    <Stack pt={3} pb={10} alignItems="center">
      <Box
        sx={{
          textAlign: 'center',
          mb: 9,
        }}
      >
        <Typography variant="h6" className="meme-title">
          Your meme
        </Typography>
        <Box mt={1}>
          <LazyLoadImage
            effect="blur"
            src="/images/memes/1.jpg"
            alt="1.jpg"
            width={isMobile ? window.innerWidth * 0.8 : '400px'}
            style={{
              boxShadow:
                'rgb(0 0 0 / 20%) 0px 2px 4px -1px, rgb(0 0 0 / 14%) 0px 4px 5px 0px, rgb(0 0 0 / 12%) 0px 1px 10px 0px',
            }}
          />
        </Box>
      </Box>

      <Typography variant="h5">
        {votedMeme ? 'Voted!' : 'Vote for the funniest meme'}
      </Typography>

      <Stack justifyContent="center" alignItems="center" spacing={3} mt={2}>
        {MemesList.slice(0, 10).map(({ src, name }) => (
          <StyledBox
            key={src}
            selected={selectedMeme?.src === src}
            voted={votedMeme}
          >
            <Box mt={1}>
              <LazyLoadImage
                effect="blur"
                src={`/images/memes/${src}`}
                alt={src}
                width={isMobile ? window.innerWidth * 0.8 : '400px'}
                onClick={() => onMemeSelect({ src, name })}
              />
            </Box>
            <Fab
              variant="extended"
              className="caption-button"
              disableRipple
              onClick={() => onMemeChoiceConfirm(src)}
            >
              Confirm Vote!
            </Fab>
          </StyledBox>
        ))}
      </Stack>

      <WaitingForPlayers
        transitionIn={Boolean(votedMeme)}
        numReady={5}
        numTotal={5}
      />
    </Stack>
  )
}

export default Voting
