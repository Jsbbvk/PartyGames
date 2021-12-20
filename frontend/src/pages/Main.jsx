import { Container } from '@mui/material'
import { Link } from 'react-router-dom'

const Main = () => {
  return (
    <Container sx={{ mt: 4 }}>
      <Link to="/captionthis">Caption This (in dev)</Link>
      <br />
      <Link to="/captionthis/demo">Caption This (Demo)</Link>
    </Container>
  )
}

export default Main
