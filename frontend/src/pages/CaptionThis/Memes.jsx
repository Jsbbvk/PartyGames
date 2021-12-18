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
} from '@mui/material'
import { useState } from 'react'
import { isMobile } from 'react-device-detect'
import CloseIcon from '@mui/icons-material/Close'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import ScrollToTop from '../../components/ScrollToTop'
import MemesList from '../../constants/memes'
import 'react-lazy-load-image-component/src/effects/blur.css'

const StyledBox = styled(Box)({
  maxWidth: '90vw',
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',

  '& img': {
    userSelect: 'none',
    boxShadow:
      'rgb(0 0 0 / 20%) 0px 3px 1px -2px, rgb(0 0 0 / 14%) 0px 2px 2px 0px, rgb(0 0 0 / 12%) 0px 1px 5px 0px',
  },
})

const Memes = () => {
  const [query, setQuery] = useState('')

  const onSearchChange = (e) => setQuery(e.target.value || '')

  return (
    <Stack py={6} alignItems="center">
      <ScrollToTop top={100} duration={250} />

      <Typography variant="h4">{MemesList.length} Memes</Typography>
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
          <StyledBox key={`${src} ${name}`}>
            <Typography variant="p">{name}</Typography>
            <Box mt={1}>
              <LazyLoadImage
                src={`/images/memes/${src}`}
                alt={name}
                width={isMobile ? window.innerWidth * 0.8 : '400px'}
                effect="blur"
              />
            </Box>
          </StyledBox>
        ))}
      </Stack>
    </Stack>
  )
}

export default Memes
