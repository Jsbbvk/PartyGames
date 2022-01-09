import { Container } from '@mui/material'
import Cards from './Cards'
import Czar from './Czar'

const Gameplay = () => {
  return (
    <Container maxWidth="sm" sx={{ p: 0 }}>
      <Czar />
      <Cards />
    </Container>
  )
}

export default Gameplay
