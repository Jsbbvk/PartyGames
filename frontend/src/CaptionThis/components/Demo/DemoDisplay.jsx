import { Fab, Stack, styled, Typography } from '@mui/material'
import { grey } from '@mui/material/colors'
import { isMobile } from 'react-device-detect'
// eslint-disable-next-line import/no-cycle
import { useDemoContext } from './DemoManager'

const StyledFab = styled(Fab)({
  textTransform: 'none',
  boxShadow: 'none',
  color: '#ffffffDE',
  backgroundColor: '#363636',
  transition: 'transform 100ms',
  '&:hover': {
    background: '#474747',
  },
  '&:active': {
    boxShadow: 'none',
    transform: 'scale(.96)',
  },
})

const DemoDisplay = () => {
  const { switchToScene, sceneProps } = useDemoContext()

  const handleOnSubmit = () => {
    switchToScene('selection')
  }

  return (
    <Stack alignItems="center" mt={4} spacing={3}>
      <Typography variant="h6">Your captioned meme</Typography>
      <img
        alt="captioned meme"
        src={sceneProps?.url}
        width={isMobile ? window.innerWidth * 0.8 : '500px'}
        style={{
          boxShadow:
            'rgb(0 0 0 / 20%) 0px 3px 1px -2px, rgb(0 0 0 / 14%) 0px 2px 2px 0px, rgb(0 0 0 / 12%) 0px 1px 5px 0px',
        }}
      />
      <StyledFab variant="extended" onClick={handleOnSubmit} disableRipple>
        Caption another meme
      </StyledFab>
    </Stack>
  )
}

export default DemoDisplay
