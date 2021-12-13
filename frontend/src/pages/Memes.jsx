import { Typography, Box, Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
import { isMobile } from 'react-device-detect'
import MemesList from '../constants/memes'

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
  return (
    <Stack py={6} alignItems="center">
      <Typography variant="h4">{MemesList.length} Memes</Typography>
      <Stack justifyContent="center" alignItems="center" spacing={7} mt={4}>
        {MemesList.map(({ src, name }) => (
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
