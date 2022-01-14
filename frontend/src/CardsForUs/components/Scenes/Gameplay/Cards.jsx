import {
  Stack,
  styled,
  Typography,
  Box,
  Fade,
  Collapse,
  IconButton,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import CheckIcon from '@mui/icons-material/Check'
import { useState, useEffect } from 'react'
import { SwitchTransition, TransitionGroup } from 'react-transition-group'
import { useCardManager } from '../../Hooks'
import {
  useEmitter,
  useListener,
  useGameContext,
} from '../../Managers/GameManager'
// eslint-disable-next-line import/no-cycle
import { useGameplayContext } from './index'
import { GAME_STATES, INFO } from '../../../constants'

const CardRow = styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'selected' && prop !== 'confirmed',
})(({ theme, selected, confirmed }) => ({
  margin: '4px 0',
  padding: '10px 12px',
  cursor: confirmed ? 'auto' : 'pointer',
  color: theme.palette.mode === 'light' ? '#ffffffde' : '#000000de',
  // transition: 'color 250ms ease-in-out, background-color 250ms ease-in-out',
  backgroundColor: (() => {
    const { mode } = theme?.palette
    if (mode === 'light') {
      return selected ? '#3e3e3e' : '#121212'
    }
    return confirmed || selected ? '#fff' : '#bebebe'
  })(),

  '@media(hover: hover) and (pointer: fine)': {
    '&:hover': {
      ...(!confirmed && {
        backgroundColor: theme.palette.mode === 'light' ? '#3e3e3e' : '#fff',
      }),
    },
  },
}))

const StyledIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'selected',
})(({ theme, selected }) => ({
  color: (() => {
    if (selected) return '#66bb6a'
    return theme.palette.mode === 'light' ? '#ffffff8a' : '#0000008a'
  })(),
  // transition: 'color 250ms ease-in-out',
  padding: 0,

  '& > svg': {
    fontSize: '16px',
    transition: 'none',
  },

  '&:hover': {
    backgroundColor: 'inherit',
    color: (() => {
      if (selected) return '#66bb6a'
      return theme.palette.mode === 'light' ? '#ffffffde' : '#000000de'
    })(),
  },
}))

const CardWrapper = styled(Box)({
  overflowY: 'auto',
  alignSelf: 'stretch',

  scrollbarWidth: 'thin',
  scrollbarColor: '#adadad #f1f1f1',

  '&::-webkit-scrollbar': {
    width: 5,
  },

  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
  },

  '&::-webkit-scrollbar-thumb': {
    background: '#adadad',
  },

  '&::-webkit-scrollbar-thumb:hover': {
    background: '#919191',
  },
})

const Cards = () => {
  const { roomId, uuid } = useGameContext()
  const { gameState, setGameState } = useGameplayContext()

  const [info, setInfo] = useState(INFO.skips)
  const [selectedCardId, setSelectedCardId] = useState()
  const { cards: playerCards, skipCard } = useCardManager()
  const [cards, setCards] = useState({})
  const [isCzar, setIsCzar] = useState(false)
  const [confirmedCardId, setConfirmedCardId] = useState()
  const [players, setPlayers] = useState([])

  const emit = useEmitter()

  const getPlayers = () => {
    if (!roomId || !confirmedCardId) return
    emit('get players', { roomId }, (data) => {
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
    if (!players.length) return
    console.log(players)

    if (gameState === GAME_STATES.choosing_card) {
      const numReady = players.reduce(
        (accum, curr) => accum + (curr.ready.chooseCard ? 1 : 0),
        0
      )

      setInfo(INFO.waitingForPlayers(numReady, players.length))
    }
  }, [players])

  useEffect(() => {
    setCards(playerCards)
  }, [playerCards])

  const onCardSelect = (id) => {
    if (id === selectedCardId) setSelectedCardId(null)
    else setSelectedCardId(id)
  }

  const onSkipCard = (id) => {
    if (selectedCardId === id) setSelectedCardId(null)
    skipCard(id, 'white')
  }

  const onConfirmCard = (id) => {
    setConfirmedCardId(id)
    setCards((p) => ({
      ...p,
      white: p.white.filter(({ id: _id }) => _id === id),
    }))
    setInfo(INFO.waitingForPlayers())

    emit('set card', { roomId, uuid, cardId: id, isCzar })
  }

  const Card = (id, text) => (
    <Collapse key={id} sx={{ width: '100%' }}>
      <CardRow
        selected={!confirmedCardId && selectedCardId === id}
        confirmed={confirmedCardId}
        onClick={(e) =>
          !confirmedCardId &&
          typeof e.target.className === 'string' &&
          onCardSelect(id)
        }
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography
          variant="body1"
          dangerouslySetInnerHTML={{ __html: text }}
        />
        {!confirmedCardId && (
          <StyledIconButton
            className="card-icon-button"
            disableRipple
            title={selectedCardId === id ? 'Select' : 'Skip'}
            onClick={() =>
              selectedCardId === id ? onConfirmCard(id) : onSkipCard(id)
            }
            selected={selectedCardId === id}
          >
            {selectedCardId === id ? <CheckIcon /> : <CloseIcon />}
          </StyledIconButton>
        )}
      </CardRow>
    </Collapse>
  )

  return (
    <Stack sx={{ height: '60vh' }}>
      <Box>
        <SwitchTransition mode="out-in">
          <Fade
            key={info.key}
            addEndListener={(node, done) =>
              node.addEventListener('transitionend', done, false)
            }
            timeout={250}
          >
            <Typography variant="body2" sx={{ textAlign: 'center' }}>
              {info.text}
            </Typography>
          </Fade>
        </SwitchTransition>
      </Box>
      <CardWrapper mt={1}>
        <TransitionGroup
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {cards?.white?.map(({ id, text }) => Card(id, text))}
        </TransitionGroup>
      </CardWrapper>
    </Stack>
  )
}

export default Cards
