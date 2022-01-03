import { Slide, Box } from '@mui/material'
import { SwitchTransition } from 'react-transition-group'

const SwitchSlide = ({ firstChild, secondChild, switched, keys, ...props }) => {
  return (
    <SwitchTransition mode="out-in">
      <Slide key={keys} {...props}>
        <Box>{switched ? secondChild : firstChild} </Box>
      </Slide>
    </SwitchTransition>
  )
}

export default SwitchSlide
