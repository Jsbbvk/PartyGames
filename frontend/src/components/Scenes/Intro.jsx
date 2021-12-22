import { Box, Fab, IconButton, Stack, styled, Typography } from '@mui/material'
import { useEffect } from 'react'
import GitHubIcon from '@mui/icons-material/GitHub'
import { useSceneContext } from '../Managers'

const StyledButton = styled(Fab)({
  textTransform: 'none',
  boxShadow: 'none',
  color: '#ffffffDE',
  backgroundColor: '#363636',
  transition: 'transform 100ms',
  padding: '28px 56px',
  fontSize: '1.5rem',

  '&:hover': {
    background: '#474747',
  },
  '&:active': {
    boxShadow: 'none',
    transform: 'scale(.96)',
  },
})

const StyledIconButton = styled(IconButton)({
  padding: 0,
  color: '#000000de',
})

const Intro = () => {
  const { switchToScene, sceneProps, setSceneProps } = useSceneContext()

  useEffect(() => {
    setSceneProps({ hideMenu: true })
  }, [])

  return (
    <Box textAlign="center">
      <Typography variant="h3">Caption This!</Typography>
      <Typography variant="body1">
        <i>How dank are you?</i>
      </Typography>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={10}
        mt={20}
      >
        <StyledButton disableRipple variant="extended">
          Host
        </StyledButton>
        <StyledButton disableRipple variant="extended">
          Join
        </StyledButton>
      </Stack>
      {/*  TODO put links to demo and memes list */}
      <Box
        sx={{
          position: 'fixed',
          bottom: '28px',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <Typography variant="body2">By Jacob Zhang</Typography>
        <StyledIconButton
          disableRipple
          title="Github Repo"
          onClick={() =>
            window.open('https://github.com/Jsbbvk/PartyGames', '_blank')
          }
        >
          <GitHubIcon />
        </StyledIconButton>
      </Box>
    </Box>
  )
}

export default Intro
