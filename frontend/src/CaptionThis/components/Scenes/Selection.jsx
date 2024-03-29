import { Typography, Box, Stack, Fab } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { SCENES } from '../../constants'
import { useSceneContext, useEmitter, useGameContext } from '../Managers'
import 'react-lazy-load-image-component/src/effects/blur.css'

const StyledBox = styled(Box)(({ selected }) => ({
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
    transition:
      'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, opacity 300ms !important',
    boxShadow: selected
      ? 'rgb(0 0 0 / 20%) 0px 7px 8px -4px, rgb(0 0 0 / 14%) 0px 12px 17px 2px, rgb(0 0 0 / 12%) 0px 5px 22px 4px'
      : 'rgb(0 0 0 / 20%) 0px 3px 1px -2px, rgb(0 0 0 / 14%) 0px 2px 2px 0px, rgb(0 0 0 / 12%) 0px 1px 5px 0px',
    opacity: selected ? '0.6 !important' : '1',

    '@media(hover: hover) and (pointer: fine)': {
      '&:hover': {
        cursor: 'pointer',
        boxShadow:
          'rgb(0 0 0 / 20%) 0px 7px 8px -4px, rgb(0 0 0 / 14%) 0px 12px 17px 2px, rgb(0 0 0 / 12%) 0px 5px 22px 4px',
      },
    },
  },

  '& .caption-button': {
    pointerEvents: selected ? 'auto' : 'none',
    transition: 'opacity 300ms, background-color 250ms, transform 100ms',
    opacity: selected ? 1 : 0,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#363636',
    boxShadow: 'none',
    textTransform: 'none',
    color: '#ffffffDE',
    '&:hover': {
      background: '#474747',
      boxShadow: 'none',
    },
    '&:active': {
      boxShadow: 'none',
      transform: 'translate(-50%, -50%) scale(.96)',
    },
  },
}))

const Selection = () => {
  const [selectedMeme, setSelectedMeme] = useState()
  const { switchToScene, setSceneProps, setShowMenu } = useSceneContext()
  const { uuid, roomId, memeChoices } = useGameContext()

  const emit = useEmitter()

  useEffect(() => {
    setShowMenu(true)

    emit('set player ready', {
      uuid,
      roomId,
      ready: 'ready.captioning',
      isReady: false,
    })
  }, [])

  const onMemeSelect = (selected) => {
    if (!selectedMeme || selected.src !== selectedMeme?.src)
      setSelectedMeme(selected)
    else setSelectedMeme(null)
  }

  const onMemeChoiceConfirm = (src) => {
    if (!selectedMeme || src !== selectedMeme?.src) return
    switchToScene(SCENES.caption, { selectedMeme })
  }

  // TODO add example modal for memes

  return (
    <>
      <Stack pt={3} pb={10} alignItems="center">
        <Typography variant="h5">Select your meme</Typography>
        <Stack justifyContent="center" alignItems="center" spacing={7} mt={4}>
          {memeChoices.map(({ src, name }) => (
            <StyledBox key={src} selected={selectedMeme?.src === src}>
              <Typography variant="body1" className="meme-title">
                {name}
              </Typography>
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
                Caption This!
              </Fab>
            </StyledBox>
          ))}
        </Stack>
      </Stack>
    </>
  )
}

export default Selection
