import { Typography, Box, Stack, Fab } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import ShareIcon from '@mui/icons-material/Share'
import LinkIcon from '@mui/icons-material/Link'
import CheckIcon from '@mui/icons-material/Check'
import { STATES } from '../../constants'
import {
  useEmitter,
  useGameContext,
  useListener,
  useSceneContext,
} from '../Managers'
import WaitingForPlayers from '../WaitingForPlayers'
import 'react-lazy-load-image-component/src/effects/blur.css'

const StyledBox = styled(Box)(({ selected, copiedMeme }) => ({
  position: 'relative',
  maxWidth: '90vw',
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  '& img': {
    opacity: selected ? '0.6 !important' : '1',
    willChange: 'opacity',
    userSelect: 'none',
    cursor: 'pointer',
    boxShadow:
      'rgb(0 0 0 / 20%) 0px 3px 1px -2px, rgb(0 0 0 / 14%) 0px 2px 2px 0px, rgb(0 0 0 / 12%) 0px 1px 5px 0px',
  },

  '& .share-button': {
    transition: 'opacity 300ms, background-color 250ms, transform 100ms',
    opacity: selected ? 1 : 0,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: copiedMeme ? '#07bc0c' : '#363636',
    boxShadow: 'none',
    textTransform: 'none',
    color: '#ffffffDE',
    pointerEvents: selected ? 'auto' : 'none',
    '&:hover': {
      background: copiedMeme ? '#07bc0c' : '#474747',
      boxShadow: 'none',
    },
    '&:active': {
      boxShadow: 'none',
      transform: copiedMeme
        ? 'translate(-50%, -50%)'
        : 'translate(-50%, -50%) scale(.96)',
    },
  },
}))

const StyledFab = styled(Fab)({
  textTransform: 'none',
  boxShadow: 'none',
  color: '#ffffffDE',
  backgroundColor: '#363636',
  transition: 'transform 100ms',
  padding: '20px 30px',

  '&:hover': {
    background: '#474747',
  },
  '&:active': {
    boxShadow: 'none',
    transform: 'scale(.96)',
  },
})

const Results = () => {
  const [ready, setReady] = useState(false)
  const { setShowMenu } = useSceneContext()
  const { uuid, roomId } = useGameContext()

  const [players, setPlayers] = useState([])
  const [playersReady, setPlayersReady] = useState([0, 1])
  const [selectedMemeId, setSelectedMemeId] = useState()
  const [copiedMeme, setCopiedMeme] = useState(false)
  const [memeFiles, setMemeFiles] = useState({})

  const emit = useEmitter()

  const calculatePlayerPoints = (roomPlayers) => {
    const pointMap = new Map()

    roomPlayers.forEach(({ votedPlayer }) => {
      pointMap.set(votedPlayer, pointMap.get(votedPlayer) + 1 || 1)
    })

    let maxPoints = 0
    pointMap.forEach((point) => {
      maxPoints = Math.max(maxPoints, point)
    })

    setPlayers(
      roomPlayers
        .map((player) => ({
          ...player,
          numVotes: pointMap.get(player._id) || 0,
          earnedPoint: maxPoints === (pointMap.get(player._id) || 0),
        }))
        .sort((a, b) => b.numVotes - a.numVotes)
    )

    if ((pointMap.get(uuid) || 0) === maxPoints) {
      emit('add point to player', { roomId, uuid })
    }
  }

  const getPlayers = () => {
    emit('get players', { roomId, includeMemeUrl: !players.length }, (data) => {
      const { players: roomPlayers, error } = data

      if (error) {
        if (process.env.REACT_APP_NODE_ENV === 'development') console.log(error)
        return
      }

      if (!players.length) {
        calculatePlayerPoints(roomPlayers)
      }

      if (!ready) return

      const numReady = roomPlayers.reduce(
        (accum, curr) => accum + (curr?.ready?.results ? 1 : 0),
        0
      )

      setPlayersReady([numReady, roomPlayers.length])
    })
  }

  useListener('update players', getPlayers)

  useEffect(() => {
    setShowMenu(true)
    getPlayers()
  }, [])

  const onReady = () => {
    setReady(true)
    emit('set player ready', {
      uuid,
      roomId,
      ready: 'ready.results',
      isReady: true,
    })
  }

  useEffect(() => {
    if (playersReady[0] > 0 && playersReady[0] === playersReady[1]) {
      emit('continue game', { roomId, state: STATES.captioning })
    }
  }, [playersReady])

  const createImageFile = async (dataURL) => {
    // const arr = dataURL.split(',')
    // const mime = arr[0].match(/:(.*?);/)[1]
    // const bstr = atob(arr[1])
    // let n = bstr.length
    // const u8arr = new Uint8Array(n)
    // // eslint-disable-next-line no-plusplus
    // while (n--) {
    //   u8arr[n] = bstr.charCodeAt(n)
    // }
    const blob = await (await fetch(dataURL)).blob()
    return new File([blob], 'meme.png', {
      type: 'image/png',
    })
  }

  const shareImage = async (id, dataURL) => {
    if (isMobile && (!navigator || !navigator.canShare)) return

    let file
    if (memeFiles[id]) file = memeFiles[id]
    else {
      file = await createImageFile(dataURL)
      setMemeFiles((p) => ({ ...p, [id]: file }))
    }

    if (isMobile) {
      if (!navigator.canShare({ files: [file] })) return
      navigator.share({
        title: 'Caption This Meme',
        text: 'Share this meme!',
        files: [file],
      })
    } else {
      navigator.clipboard.write([
        // eslint-disable-next-line no-undef
        new ClipboardItem({
          'image/png': file,
        }),
      ])
      setCopiedMeme(true)
    }
  }

  useEffect(() => {
    if (!copiedMeme) return

    const timeout = setTimeout(() => setCopiedMeme(false), 600)

    // eslint-disable-next-line consistent-return
    return () => {
      clearTimeout(timeout)
    }
  }, [copiedMeme])

  const onMemeSelect = (selectedId) => {
    if (!selectedMemeId || selectedId !== selectedMemeId) {
      setCopiedMeme(false)
      setSelectedMemeId(selectedId)
    } else setSelectedMemeId(null)
  }

  return (
    <Stack pt={3} pb={10} alignItems="center">
      <Typography variant="h5">Results</Typography>
      <Typography variant="body2">
        Click on a meme to {isMobile ? 'share' : 'copy'}!
      </Typography>

      <Stack justifyContent="center" alignItems="center" spacing={10} mt={5}>
        {players.map(
          ({ name, _id: playerId, memeUrl, numVotes, earnedPoint }) => (
            <StyledBox
              key={playerId}
              selected={selectedMemeId === playerId}
              copiedMeme={copiedMeme}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ width: '100%' }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    maxWidth: '75%',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                  }}
                >
                  {name}
                  {playerId === uuid ? ' (You)' : ''}
                </Typography>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ color: '#1e88e5' }}
                >
                  <Typography variant="body1" sx={{ color: '#000000de' }}>
                    {numVotes}
                  </Typography>
                  <ThumbUpIcon />
                </Stack>
              </Stack>
              <Box mt={1}>
                <LazyLoadImage
                  effect="blur"
                  src={memeUrl}
                  alt="Meme"
                  width={isMobile ? window.innerWidth * 0.8 : '400px'}
                  onClick={() => onMemeSelect(playerId)}
                />
                <Fab
                  className="share-button"
                  disableRipple
                  onClick={() =>
                    !copiedMeme &&
                    selectedMemeId === playerId &&
                    shareImage(playerId, memeUrl)
                  }
                >
                  {(() => {
                    if (isMobile) return <ShareIcon />
                    if (copiedMeme) return <CheckIcon />
                    return <LinkIcon />
                  })()}
                </Fab>
              </Box>

              {earnedPoint && (
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 600, textAlign: 'right', width: '100%' }}
                >
                  +1 point
                </Typography>
              )}
            </StyledBox>
          )
        )}
      </Stack>

      <Box
        sx={{
          position: 'fixed',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1,
        }}
      >
        <StyledFab variant="extended" disableRipple onClick={onReady}>
          Continue
        </StyledFab>
      </Box>

      <WaitingForPlayers
        transitionIn={ready}
        numReady={playersReady[0]}
        numTotal={playersReady[1]}
      />
    </Stack>
  )
}

export default Results
