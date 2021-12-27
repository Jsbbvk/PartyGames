import {
  Typography,
  Box,
  Stack,
  Button,
  Fab,
  getTableSortLabelUtilityClass,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { useContext, useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { grey, orange } from '@mui/material/colors'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import MemesList from '../../constants/memes'
import { SCENES, STATES } from '../../constants'
import {
  useEmitter,
  useGameContext,
  useListener,
  useSceneContext,
} from '../Managers'
import WaitingForPlayers from '../WaitingForPlayers'
import 'react-lazy-load-image-component/src/effects/blur.css'

const StyledBox = styled(Box)(() => ({
  position: 'relative',
  maxWidth: '90vw',
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',

  '& img': {
    willChange: 'opacity',
    userSelect: 'none',
    boxShadow:
      'rgb(0 0 0 / 20%) 0px 3px 1px -2px, rgb(0 0 0 / 14%) 0px 2px 2px 0px, rgb(0 0 0 / 12%) 0px 1px 5px 0px',
  },
}))

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

const Results = () => {
  const [ready, setReady] = useState(false)
  const { switchToScene } = useSceneContext()
  const { uuid, roomId } = useGameContext()

  const [players, setPlayers] = useState([])
  const [playerPoints, setPlayerPoints] = useState()
  const [playersReady, setPlayersReady] = useState([0, 1])

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

  return (
    <Stack pt={3} pb={10} alignItems="center">
      <Typography variant="h5">Results</Typography>

      <Stack justifyContent="center" alignItems="center" spacing={10} mt={5}>
        {players.map(
          ({ name, _id: playerId, memeUrl, numVotes, earnedPoint }) => (
            <StyledBox key={playerId}>
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
                />
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
