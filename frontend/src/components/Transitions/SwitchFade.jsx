import { Fade, Box } from '@mui/material'
import { SwitchTransition } from 'react-transition-group'

const SwitchFade = ({ firstChild, secondChild, switched, keys, ...props }) => {
  return (
    <SwitchTransition mode="out-in">
      <Fade key={keys} {...props}>
        <Box>{switched ? secondChild : firstChild} </Box>
      </Fade>
    </SwitchTransition>
  )
}

export default SwitchFade
