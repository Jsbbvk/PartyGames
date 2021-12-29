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
import { Helmet } from 'react-helmet-async'
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
    <>
      <Helmet prioritizeSeoTags>
        <title>Memes - Caption This!</title>
        <link
          rel="canonical"
          href="https://partygames.social/captionthis/memes"
        />
        <meta
          name="description"
          content="Caption This! is a party game where friends caption 
          popular meme templates and then vote for the funniest one. 
          With over 250+ memes, there's no limit on how dank one can make their meme!"
        />
        <meta property="og:title" content="Memes - Caption This!" />
        <meta property="og:site_name" content="Party Games" />
        <meta
          property="og:url"
          content="https://partygames.social/captionthis/memes"
        />
        <meta
          property="og:description"
          content="Memes list of Caption This!, a party game where friends caption 
          popular meme templates and then vote for the funniest one. 
          With over 250+ memes, there's no limit on how dank one can make their meme!"
        />
        <meta property="og:type" content="website" />

        <link
          rel="apple-touch-icon-precomposed"
          sizes="57x57"
          href="/captionthis/apple-touch-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="114x114"
          href="/captionthis/apple-touch-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="72x72"
          href="/captionthis/apple-touch-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="144x144"
          href="/captionthis/apple-touch-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="60x60"
          href="/captionthis/apple-touch-icon-60x60.png"
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="120x120"
          href="/captionthis/apple-touch-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="76x76"
          href="/captionthis/apple-touch-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="152x152"
          href="/captionthis/apple-touch-icon-152x152.png"
        />
        <link
          rel="icon"
          type="image/png"
          href="/captionthis/favicon-196x196.png"
          sizes="196x196"
        />
        <link
          rel="icon"
          type="image/png"
          href="/captionthis/favicon-96x96.png"
          sizes="96x96"
        />
        <link
          rel="icon"
          type="image/png"
          href="/captionthis/favicon-32x32.png"
          sizes="32x32"
        />
        <link
          rel="icon"
          type="image/png"
          href="/captionthis/favicon-16x16.png"
          sizes="16x16"
        />
        <link
          rel="icon"
          type="image/png"
          href="/captionthis/favicon-128.png"
          sizes="128x128"
        />
      </Helmet>
      <Stack py={6} alignItems="center">
        <ScrollToTop top={100} duration={250} />

        <Typography variant="h4">
          {MemesList.length} Memes{' '}
          <span style={{ fontSize: '0.4em' }}>...and more to come!</span>
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
              <Typography variant="body1">{name}</Typography>
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
    </>
  )
}

export default Memes
