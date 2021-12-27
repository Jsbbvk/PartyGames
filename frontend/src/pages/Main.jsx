import { Container } from '@mui/material'
import { Link } from 'react-router-dom'

const Main = () => {
  return (
    <Container sx={{ mt: 4 }}>
      <Link to="/captionthis">Caption This</Link>
    </Container>
  )
}

export default Main
