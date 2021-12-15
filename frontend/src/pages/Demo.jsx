import { Typography } from '@mui/material'
import Container from '@mui/material/Container'
import CanvasWorkarea from '../components/Canvas'

const Demo = () => {
  return (
    <Container sx={{ textAlign: 'center', mt: 3 }}>
      <Typography variant="h6">Demo</Typography>
      <CanvasWorkarea />
    </Container>
  )
}

export default Demo
