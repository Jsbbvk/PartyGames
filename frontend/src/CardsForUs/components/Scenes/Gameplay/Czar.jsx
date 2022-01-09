import { Box, Typography } from '@mui/material'
import { useContext } from 'react'
import { ThemeContext } from '../../../../App'

const Czar = () => {
  const { toggleColorMode } = useContext(ThemeContext)
  const dummyText = 'A sample string that represents a black card'

  return (
    <Box sx={{ height: '40vh', pt: 10 }}>
      <Typography variant="body1">{dummyText}</Typography>
      <button type="button" onClick={toggleColorMode}>
        Toggle!
      </button>
    </Box>
  )
}

export default Czar
