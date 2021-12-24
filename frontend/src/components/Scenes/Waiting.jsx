import { Box } from '@mui/material'
import { useEffect } from 'react'
import { useGameContext, useSceneContext } from '../Managers'

const Waiting = () => {
  const { switchToScene, setSceneProps } = useSceneContext()
  const { name, uuid, roomId } = useGameContext()

  useEffect(() => {
    setSceneProps({ hideMenu: true })
  }, [])

  return (
    <Box>
      {name} {uuid} {roomId}
    </Box>
  )
}

export default Waiting
