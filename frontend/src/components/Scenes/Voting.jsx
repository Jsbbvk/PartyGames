import { Typography, Box, Stack, Fab, styled } from '@mui/material'
import { useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import shuffle from 'lodash/shuffle'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import { STATES } from '../../constants'
import {
  useEmitter,
  useGameContext,
  useListener,
  useSceneContext,
} from '../Managers'
import WaitingForPlayers from '../WaitingForPlayers'

import 'react-lazy-load-image-component/src/effects/blur.css'

const StyledBox = styled(Box)(({ selected, voted }) => ({
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
    transition:
      'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, opacity 300ms !important',

    boxShadow: selected
      ? 'rgb(0 0 0 / 20%) 0px 7px 8px -4px, rgb(0 0 0 / 14%) 0px 12px 17px 2px, rgb(0 0 0 / 12%) 0px 5px 22px 4px'
      : 'rgb(0 0 0 / 20%) 0px 3px 1px -2px, rgb(0 0 0 / 14%) 0px 2px 2px 0px, rgb(0 0 0 / 12%) 0px 1px 5px 0px',
    opacity:
      (!voted && selected) || (voted && !selected) ? '0.6 !important' : '1',

    '@media(hover: hover) and (pointer: fine)': {
      '&:hover': {
        cursor: voted ? 'auto' : 'pointer',
        boxShadow:
          voted && !selected
            ? 'none'
            : 'rgb(0 0 0 / 20%) 0px 7px 8px -4px, rgb(0 0 0 / 14%) 0px 12px 17px 2px, rgb(0 0 0 / 12%) 0px 5px 22px 4px',
      },
    },
  },

  '& .caption-button': {
    transition: 'opacity 300ms, background-color 250ms, transform 100ms',
    opacity: !voted && selected ? 1 : 0,
    pointerEvents: !voted && selected ? 'auto' : 'none',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#0288d1',
    boxShadow: 'none',
    textTransform: 'none',
    color: '#ffffffDE',

    '&:hover': {
      backgroundColor: '#0277bd',
      boxShadow: 'none',
    },
    '&:active': {
      boxShadow: 'none',
      transform: 'translate(-50%, -50%) scale(.96)',
    },
  },
}))

const Voting = () => {
  const [selectedMemeId, setSelectedMemeId] = useState()
  const [votedMemeId, setVotedMemeId] = useState()
  const [players, setPlayers] = useState([])
  const [currMemeUrl, setCurrMemeUrl] = useState()
  const [playersReady, setPlayersReady] = useState([0, 1])

  const [playerMemes, setPlayerMemes] = useState([])

  const { switchToScene, setShowMenu } = useSceneContext()
  const { uuid, roomId } = useGameContext()

  const emit = useEmitter()

  const getPlayers = () => {
    emit('get players', { roomId, includeMemeUrl: true }, (data) => {
      const { players: roomPlayers, error } = data
      if (error) {
        if (process.env.REACT_APP_NODE_ENV === 'development') console.log(error)
        return
      }

      setPlayers(roomPlayers)
    })
  }

  useListener('update players', getPlayers)

  useEffect(() => {
    setShowMenu(true)
    getPlayers()
  }, [])

  useEffect(() => {
    if (!players.length) return

    if (!playerMemes || !playerMemes.length) {
      setPlayerMemes(
        shuffle(
          players.map(({ _id: playerId, memeUrl: url }) => ({
            playerId,
            url,
          }))
        )
      )
    } else if (playerMemes.length !== players.length) {
      setPlayerMemes((prev) =>
        prev.filter(({ playerId }) =>
          players.some(({ _id }) => _id === playerId)
        )
      )
    }

    if (!selectedMemeId && currMemeUrl) return

    let memeAvailable = false
    let numReady = 0

    players.forEach((p) => {
      if (p._id === selectedMemeId || p._id === votedMemeId)
        memeAvailable = true

      if (p._id === uuid && !currMemeUrl) {
        setCurrMemeUrl(p.memeUrl)
      }

      if (p.ready?.voting) numReady += 1
    })

    setPlayersReady([numReady, players.length])

    if (!memeAvailable) {
      setSelectedMemeId(null)
      setVotedMemeId(null)
      setPlayersReady([0, 1])

      emit('set player ready', {
        uuid,
        roomId,
        ready: 'ready.voting',
        isReady: false,
      })
    }
  }, [players])

  useEffect(() => {
    if (playersReady[0] > 0 && playersReady[0] === playersReady[1]) {
      emit('set room state', { roomId, state: STATES.results })
    }
  }, [playersReady])

  const onMemeSelect = (selectedId) => {
    if (votedMemeId) return
    if (!selectedMemeId || selectedId !== selectedMemeId)
      setSelectedMemeId(selectedId)
    else setSelectedMemeId(null)
  }

  const onMemeChoiceConfirm = (selectedId) => {
    if (!selectedMemeId || selectedId !== selectedMemeId) return

    setVotedMemeId(selectedMemeId)
    emit('set player vote', {
      uuid,
      roomId,
      votedPlayer: selectedMemeId,
    })
  }

  return (
    <Stack pt={3} pb={10} alignItems="center">
      <Box
        sx={{
          textAlign: 'center',
          mb: 9,
        }}
      >
        <Typography variant="h6" className="meme-title">
          Your meme
        </Typography>
        <Box mt={1}>
          <LazyLoadImage
            effect="blur"
            src={currMemeUrl}
            alt="Your meme"
            width={isMobile ? window.innerWidth * 0.8 : '400px'}
            style={{
              boxShadow:
                'rgb(0 0 0 / 20%) 0px 2px 4px -1px, rgb(0 0 0 / 14%) 0px 4px 5px 0px, rgb(0 0 0 / 12%) 0px 1px 10px 0px',
            }}
          />
        </Box>
      </Box>

      <Typography variant="h5">
        {votedMemeId ? 'Voted!' : 'Vote for the funniest meme'}
      </Typography>

      <Stack justifyContent="center" alignItems="center" spacing={3} mt={2}>
        {playerMemes.map(
          ({ playerId, url }) =>
            playerId !== uuid && (
              <StyledBox
                key={playerId}
                selected={selectedMemeId === playerId}
                voted={votedMemeId}
              >
                <Box mt={1}>
                  <LazyLoadImage
                    effect="blur"
                    src={url}
                    alt="Meme"
                    width={isMobile ? window.innerWidth * 0.8 : '400px'}
                    onClick={() => onMemeSelect(playerId)}
                  />
                </Box>
                <Fab
                  className="caption-button"
                  disableRipple
                  onClick={() => onMemeChoiceConfirm(playerId)}
                  title="Vote?"
                >
                  <ThumbUpIcon />
                </Fab>
              </StyledBox>
            )
        )}
      </Stack>

      <WaitingForPlayers
        transitionIn={Boolean(votedMemeId)}
        numReady={playersReady[0]}
        numTotal={playersReady[1]}
      />
    </Stack>
  )
}

export default Voting
