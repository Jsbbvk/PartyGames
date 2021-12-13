import { Typography, Box, Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import shuffle from 'lodash/shuffle'
import { useCookies } from 'react-cookie'
import LZString from 'lz-string'
import MemesList from '../../constants/memes'
import { NUMBER_OF_MEME_CHOICES } from '../../constants'

const StyledBox = styled(Box)({
  maxWidth: '90vw',
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',

  '& img': {
    userSelect: 'none',
    border: '2px solid #dbdbdb',
    transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    '&:hover': {
      cursor: 'pointer',
      boxShadow:
        '0px 4px 5px -2px rgb(0 0 0 / 20%), 0px 7px 10px 1px rgb(0 0 0 / 14%), 0px 2px 16px 1px rgb(0 0 0 / 12%)',
    },
  },
})

const Selection = () => {
  const [memeChoices, setMemeChoices] = useState([])
  const [cookies, setCookie] = useCookies(['UnusedMemes'])

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
      console.log(memes.length)
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

    const compressedMemeList = LZString.compressToEncodedURIComponent(
      restMemes.join('/')
    )

    setMemeChoices(memes)
    setCookie('UnusedMemes', compressedMemeList, {
      path: '/',
    })
  }, [])

  return (
    <Stack py={3} alignItems="center">
      <Typography variant="h5">Select your meme</Typography>
      <Stack justifyContent="center" alignItems="center" spacing={7} mt={4}>
        {memeChoices.map((src) => (
          <StyledBox key={src}>
            <Box mt={1}>
              <img
                src={`/images/memes/${src}`}
                alt={src}
                width={isMobile ? window.innerWidth * 0.8 : '400px'}
              />
            </Box>
          </StyledBox>
        ))}
      </Stack>
    </Stack>
  )
}

export default Selection
