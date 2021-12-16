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
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import ScrollToTop from 'react-scroll-to-top'
import MemesList from '../../constants/memes'

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

const Memes = () => {
  const [query, setQuery] = useState('')

  const onSearchChange = (e) => setQuery(e.target.value || '')

  return (
    <Stack py={6} alignItems="center">
      <ScrollToTop
        smooth
        component={<KeyboardArrowUpIcon />}
        title="Scroll to top"
        top={100}
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          boxShadow: 'none',
          backgroundColor: '#363636',
          color: '#ffffffDE',
        }}
      />
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
              <img
                src={`/images/memes/${src}`}
                alt={name}
                width={isMobile ? window.innerWidth * 0.8 : '400px'}
              />
            </Box>
          </StyledBox>
        ))}
      </Stack>
    </Stack>
  )
}

export default Memes
