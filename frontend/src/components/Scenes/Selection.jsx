import { Grid, Typography, Box, Stack, Paper } from '@mui/material'
import { styled } from '@mui/material/styles'
import { isMobile } from 'react-device-detect'
import Memes from '../../constants/memes'

const Img = styled('img')({})

const ImagePaper = styled(Paper)({
  padding: 17,
  '& > img': {
    userSelect: 'none',
  },
  '&:hover': {
    cursor: 'pointer',
    'box-shadow':
      '0px 4px 5px -2px rgb(0 0 0 / 20%), 0px 7px 10px 1px rgb(0 0 0 / 14%), 0px 2px 16px 1px rgb(0 0 0 / 12%)',
  },
})

const Selection = () => {
  return (
    <Stack py={3} alignItems="center">
      <Typography variant="h5">Select your meme</Typography>
      <Grid container spacing={2} mt={4}>
        {[...Array(100).keys()].map((i) => (
          <Grid item key={`meme ${i}`} sm={12}>
            <Stack alignItems="center">
              <ImagePaper elevation={2}>
                <Img
                  src={`/images/memes/${Memes[i].src}`}
                  alt={Memes[i].name}
                  width={isMobile ? '300px' : '400px'}
                />
              </ImagePaper>
            </Stack>
          </Grid>
        ))}
      </Grid>
    </Stack>
  )
}

export default Selection
