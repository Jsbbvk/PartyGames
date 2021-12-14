import { Typography, Box, Stack, Button } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useContext, useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import shuffle from 'lodash/shuffle'
import { useCookies } from 'react-cookie'
import LZString from 'lz-string'
import MemesList from '../../constants/memes'
import { NUMBER_OF_MEME_CHOICES, SCENES } from '../../constants'
import { useSceneContext } from '../Managers'

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
    border: '2px solid #dbdbdb',
    transition:
      'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, opacity 300ms',

    boxShadow: selected
      ? 'rgb(0 0 0 / 20%) 0px 7px 8px -4px, rgb(0 0 0 / 14%) 0px 12px 17px 2px, rgb(0 0 0 / 12%) 0px 5px 22px 4px'
      : 'none',
    opacity: selected ? '0.6' : '1',
    '@media(hover: hover) and (pointer: fine)': {
      '&:hover': {
        cursor: 'pointer',
        boxShadow:
          'rgb(0 0 0 / 20%) 0px 7px 8px -4px, rgb(0 0 0 / 14%) 0px 12px 17px 2px, rgb(0 0 0 / 12%) 0px 5px 22px 4px',
      },
    },
  },

  '& .caption-button': {
    transition: 'opacity 300ms, background-color 250ms',
    opacity: selected ? 1 : 0,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#f3c957',
    textTransform: 'none',
    padding: '8px 18px',
    color: 'rgba(0, 0, 0, 0.87)',
    // width: 85,
    // height: 85,
    // borderRadius: '50%',
    boxShadow: '3px 3px 0 0 rgba(0, 0, 0, 0.14)',

    '&:hover': {
      backgroundColor: '#fdd25b',
    },
  },
}))

const Selection = () => {
  const [cookies, setCookie] = useCookies(['UnusedMemes'])
  const [memeChoices, setMemeChoices] = useState([])
  const [selectedMeme, setSelectedMeme] = useState()
  const { switchToScene } = useSceneContext()

  useEffect(() => {
    let availableMemes = LZString.decompressFromEncodedURIComponent(
      cookies.UnusedMemes
    )

    if (!availableMemes) availableMemes = MemesList.map(({ src }) => src)
    else availableMemes = availableMemes.split('/')

    const shuffledMemesList = shuffle(availableMemes)
    let memes = shuffledMemesList.slice(0, NUMBER_OF_MEME_CHOICES)
    let restMemes = shuffledMemesList.slice(NUMBER_OF_MEME_CHOICES)

    if (memes.length < NUMBER_OF_MEME_CHOICES) {
      // add more memes
      const memesList = shuffle(
        MemesList.flatMap(({ src }) => (memes.includes(src) ? [] : [src]))
      )

      restMemes = memesList.slice(NUMBER_OF_MEME_CHOICES - memes.length)
      memes = [
        ...memes,
        ...memesList.slice(0, NUMBER_OF_MEME_CHOICES - memes.length),
      ]
    }

    memes = memes.map((src) => ({
      src,
      name: MemesList.flatMap(({ src: s, name }) =>
        s === src ? [name] : []
      )[0],
    }))

    const compressedMemeList = LZString.compressToEncodedURIComponent(
      restMemes.join('/')
    )

    setMemeChoices(memes)
    setCookie('UnusedMemes', compressedMemeList, {
      path: '/',
    })
  }, [])

  const onMemeSelect = (selected) => {
    if (!selectedMeme || selected.src !== selectedMeme?.src)
      setSelectedMeme(selected)
    else setSelectedMeme(null)
  }

  const onMemeChoiceConfirm = (src) => {
    if (!selectedMeme || src !== selectedMeme?.src) return
    switchToScene(SCENES.caption, selectedMeme)
  }

  return (
    <>
      <Stack pt={3} pb={10} alignItems="center">
        <Typography variant="h5">Select your meme</Typography>
        <Stack justifyContent="center" alignItems="center" spacing={7} mt={4}>
          {memeChoices.map(({ src, name }) => (
            <StyledBox key={src} selected={selectedMeme?.src === src}>
              <Typography variant="p" className="meme-title">
                {name}
              </Typography>
              <Box mt={1}>
                <img
                  src={`/images/memes/${src}`}
                  alt={src}
                  width={isMobile ? window.innerWidth * 0.8 : '400px'}
                  onClick={() => onMemeSelect({ src, name })}
                />
              </Box>
              <Button
                variant="contained"
                className="caption-button"
                disableRipple
                onClick={() => onMemeChoiceConfirm(src)}
              >
                Caption This!
              </Button>
            </StyledBox>
          ))}
        </Stack>
      </Stack>
    </>
  )
}

export default Selection
