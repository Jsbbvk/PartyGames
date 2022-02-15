import GitHub from '@mui/icons-material/GitHub'
import {
  Box,
  Container,
  IconButton,
  Stack,
  styled,
  Typography,
} from '@mui/material'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'

const StyledCard = styled(Stack)(({ disabled }) => ({
  maxWidth: '300px',
  width: '90vw',
  padding: '20px',
  borderRadius: 7,
  opacity: disabled ? 0.4 : 1,
  cursor: disabled ? 'auto' : 'pointer',
  boxShadow:
    'rgb(0 0 0 / 20%) 0px 3px 1px -2px, rgb(0 0 0 / 14%) 0px 2px 2px 0px, rgb(0 0 0 / 12%) 0px 1px 5px 0px',

  transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',

  '&:hover': {
    boxShadow: disabled
      ? 'rgb(0 0 0 / 20%) 0px 3px 1px -2px, rgb(0 0 0 / 14%) 0px 2px 2px 0px, rgb(0 0 0 / 12%) 0px 1px 5px 0px'
      : 'rgb(0 0 0 / 20%) 0px 2px 4px -1px, rgb(0 0 0 / 14%) 0px 4px 5px 0px, rgb(0 0 0 / 12%) 0px 1px 10px 0px',
  },
}))

const Main = () => {
  const navigate = useNavigate()

  const Card = ({ src, title, description, navigateTo, disabled = false }) => (
    <StyledCard
      alignItems="center"
      spacing={2}
      onClick={() => navigate(navigateTo)}
      disabled={disabled}
    >
      <Typography variant="h6">{title}</Typography>
      <img
        src={src}
        alt="cover"
        width="200"
        draggable="false"
        style={{ userSelect: 'none' }}
      />
      <Typography variant="caption">{description}</Typography>
    </StyledCard>
  )

  return (
    <>
      <Helmet>
        <link
          rel="icon"
          type="image/png"
          href="/partygames/favicon-32x32.png"
          sizes="32x32"
        />
        <link
          rel="icon"
          type="image/png"
          href="/partygames/favicon-16x16.png"
          sizes="16x16"
        />
        <meta
          name="description"
          content="Collection of popular party games for social hangouts!"
        />
      </Helmet>
      <Container sx={{ mt: 4, mb: 5 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={2}
          mt={10}
        >
          <img src="/images/partygames/popper.png" alt="popper" width="32" />
          <Typography variant="h4" sx={{ textAlign: 'center' }}>
            Party Games
          </Typography>
          <img
            src="/images/partygames/popper.png"
            alt="popper"
            width="32"
            style={{ transform: 'scaleX(-1)' }}
          />
        </Stack>
        <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
          Collection of party games to enjoy in social hangouts!
        </Typography>

        <Stack alignItems="center" mt={5} spacing={4}>
          {Card({
            src: '/images/partygames/captionthis-cover.png',
            title: 'Caption This!',
            description:
              'Players compete with each other to see who is the best at captioning memes!',
            navigateTo: '/captionthis',
          })}
          {Card({
            src: '/images/partygames/cardsforus-cover.png',
            title: 'Cards For Us',
            description: 'Cards Against Humanity clone',
            navigateTo: '/cardsforus',
          })}
        </Stack>

        <Stack alignItems="center">
          <Typography
            variant="caption"
            component="p"
            sx={{ textAlign: 'center', mt: 10 }}
          >
            By Jacob Zhang
          </Typography>
          <IconButton
            disableRipple
            title="Github Repo"
            onClick={() =>
              window.open('https://github.com/Jsbbvk/PartyGames', '_blank')
            }
            sx={{ padding: 0, color: '#000000de' }}
          >
            <GitHub />
          </IconButton>
        </Stack>
      </Container>
    </>
  )
}

export default Main
