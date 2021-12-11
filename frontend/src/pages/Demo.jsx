import { Typography } from '@mui/material'
import Container from '@mui/material/Container'
import { useRef } from 'react'
import Canvas from '../components/Canvas'

const Demo = () => {
  const canvasRef = useRef(null)

  return (
    <Container>
      <Typography variant="h6">Demo</Typography>
      <Canvas ref={canvasRef} />
    </Container>
  )
}

export default Demo
