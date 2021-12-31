import { Container } from '@mui/material'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

const Main = () => {
  return (
    <>
      <Helmet>
        <link rel="icon" type="image/png" href="/logo16.png" />
        <meta
          name="description"
          content="Collection of popular party games for social hangouts!"
        />
      </Helmet>
      <Container sx={{ mt: 4 }}>
        <Link to="/captionthis">Caption This</Link>
      </Container>
    </>
  )
}

export default Main
