import { Typography, Box, Stack, Paper } from '@mui/material'
import { styled } from '@mui/material/styles'
import { isMobile } from 'react-device-detect'
import MemesList from '../constants/memes'

const ImagePaper = styled(Paper)({
  padding: 17,
  maxWidth: '90vw',
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',

  '& img': {
    userSelect: 'none',
    border: '2px solid #dbdbdb',
  },
  '&:hover': {
    cursor: 'pointer',
    boxShadow:
      '0px 4px 5px -2px rgb(0 0 0 / 20%), 0px 7px 10px 1px rgb(0 0 0 / 14%), 0px 2px 16px 1px rgb(0 0 0 / 12%)',
  },
})

const Memes = () => {
  return (
    <Stack py={6} alignItems="center">
      <Typography variant="h4">{MemesList.length} Memes</Typography>
      <Stack justifyContent="center" alignItems="center" spacing={2} mt={4}>
        {MemesList.map(({ src, name }) => (
          <ImagePaper elevation={2} key={`${src} ${name}`}>
            <Typography variant="p">{name}</Typography>
            <Box mt={2}>
              <img
                src={`/images/memes/${src}`}
                alt={name}
                width={isMobile ? window.innerWidth * 0.8 : '400px'}
              />
            </Box>
          </ImagePaper>
        ))}
      </Stack>
    </Stack>
  )
}

export default Memes
