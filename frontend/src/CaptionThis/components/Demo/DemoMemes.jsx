import {
  Typography,
  Box,
  Stack,
  Input,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  styled,
  Fab,
} from '@mui/material'
import { useState } from 'react'
import { isMobile } from 'react-device-detect'
import CloseIcon from '@mui/icons-material/Close'
import { LazyLoadImage } from 'react-lazy-load-image-component'
// eslint-disable-next-line import/no-cycle
import { useDemoContext } from './DemoManager'
import ScrollToTop from '../ScrollToTop'
import MemesList from '../../constants/memes'
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
    transition: 'opacity 300ms, background-color 250ms, transform 100ms',
    opacity: selected ? 1 : 0,
    position: 'absolute',
    pointerEvents: selected ? 'auto' : 'none',
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

const DemoMemes = () => {
  const [query, setQuery] = useState('')
  const [selectedMeme, setSelectedMeme] = useState()
  const { switchToScene } = useDemoContext()

  const onSearchChange = (e) => setQuery(e.target.value || '')

  const onMemeSelect = (selected) => {
    if (!selectedMeme || selected.src !== selectedMeme?.src)
      setSelectedMeme(selected)
    else setSelectedMeme(null)
  }

  const onMemeChoiceConfirm = (src) => {
    if (!selectedMeme || src !== selectedMeme?.src) return
    switchToScene('caption', { selectedMeme })
  }

  return (
    <Stack pb={6} alignItems="center">
      <ScrollToTop top={100} duration={250} />

      <Typography variant="h6" sx={{ mt: 2 }}>
        Choose your meme to caption
      </Typography>
      <Box my={3}>
        <FormControl
          sx={{ width: '300px', maxWidth: '90vw' }}
          variant="standard"
        >
          <InputLabel htmlFor="search-field">Search for a meme</InputLabel>
          <Input
            id="search-field"
            onChange={onSearchChange}
            value={query}
            autoComplete="off"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="clear search field"
                  onClick={() => setQuery('')}
                  edge="end"
                  disableRipple
                >
                  <CloseIcon />
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      </Box>
      <Stack justifyContent="center" alignItems="center" spacing={7} mt={4}>
        {MemesList.filter(({ name }) =>
          name
            .toLowerCase()
            .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
            .includes(
              query.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
            )
        ).map(({ src, name }) => (
          <StyledBox
            key={`${src} ${name}`}
            selected={selectedMeme?.src === src}
          >
            <Typography variant="body1">{name}</Typography>
            <Box mt={1}>
              <LazyLoadImage
                src={`/images/memes/${src}`}
                alt={name}
                width={isMobile ? window.innerWidth * 0.8 : '400px'}
                effect="blur"
                onClick={() => onMemeSelect({ src, name })}
              />
              <Fab
                variant="extended"
                className="caption-button"
                disableRipple
                onClick={() => onMemeChoiceConfirm(src)}
              >
                Caption This!
              </Fab>
            </Box>
          </StyledBox>
        ))}
      </Stack>
    </Stack>
  )
}

export default DemoMemes
