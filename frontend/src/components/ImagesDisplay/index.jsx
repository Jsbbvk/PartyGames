import { Box } from '@mui/material'
import { useEffect, useState } from 'react'
import memes from '../../constants/memes'

const ImagesDisplay = () => {
  const [imgSrc, setImgSrc] = useState(memes[0].src)

  const switchImage = () => {
    setImgSrc(memes[Math.floor(Math.random() * memes.length)].src)
  }

  useEffect(() => {
    switchImage()
  }, [])

  return (
    <Box>
      <img alt="meme" src={`/images/memes/${imgSrc}`} height="50" />
    </Box>
  )
}

export default ImagesDisplay
