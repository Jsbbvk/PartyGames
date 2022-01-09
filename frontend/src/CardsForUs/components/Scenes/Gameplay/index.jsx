import { Container } from '@mui/material'
import Cards from './Cards'
import Czar from './Czar'

const Gameplay = () => {
  return (
    <Container maxWidth="sm">
      <Czar />
      <Cards />
    </Container>
  )
}

export default Gameplay
