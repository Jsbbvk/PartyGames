import {
  Stack,
  styled,
  Typography,
  Box,
  Fade,
  Collapse,
  IconButton,
  Fab,
  Slide,
  LinearProgress,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import CheckIcon from '@mui/icons-material/Check'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import { useState, useEffect, useRef } from 'react'
import shuffle from 'lodash/shuffle'
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
  shouldForwardProp: (prop) =>
    prop !== 'selected' && prop !== 'confirmed' && prop !== 'disabled',
})(({ theme, selected, confirmed, disabled }) => ({
  margin: '4px 0',
  padding: '10px 12px',
  cursor: disabled || confirmed ? 'auto' : 'pointer',
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
      ...(!confirmed &&
        !disabled && {
          backgroundColor: theme.palette.mode === 'light' ? '#3e3e3e' : '#fff',
        }),
    },
  },
}))

const StyledIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'selected' && prop !== 'canSkip',
})(({ theme, selected, canSkip }) => ({
  color: (() => {
    if (selected) return '#66bb6a'
    return theme.palette.mode === 'light' ? '#ffffff8a' : '#0000008a'
  })(),
  // transition: 'color 250ms ease-in-out',
  padding: 0,
  pointerEvents: selected || canSkip ? 'auto' : 'none',
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

const StyledButton = styled(Fab)({
  textTransform: 'none',
  boxShadow: 'none',
  color: '#ffffffDE',
  backgroundColor: '#363636',
  transition: 'transform 100ms, background-color 250ms',
  padding: '20px 28px',

  '&:hover': {
    background: '#474747',
  },
  '&:active': {
    boxShadow: 'none',
    transform: 'scale(.96)',
  },
})

/*
  TODO list
  - czar shouldn't be able to skip cards
  - handle reconnection
*/

const Cards = () => {
  const { roomId, uuid } = useGameContext()
  const { gameState, setGameState, players, isCzar } = useGameplayContext()
  const { cards: playerCards, skipCard, hydrateCards } = useCardManager()

  const readyWrapperRef = useRef(null)

  const [info, setInfo] = useState(INFO.skips)
  const [selectedCardId, setSelectedCardId] = useState()
  const [cards, setCards] = useState([])
  const [confirmedCardId, setConfirmedCardId] = useState()
  const [canSkip, setCanSkip] = useState(true)
  const [winnerId, setWinnerId] = useState()
  const [readyNextRound, setReadyNextRound] = useState(false)
  const [playersReady, setPlayersReady] = useState([0, 1])

  const emit = useEmitter()

  const handleChoosingState = () => {
    if (!confirmedCardId) return

    const numReady = players.reduce(
      (accum, curr) => accum + (curr.ready.chooseCard ? 1 : 0),
      0
    )

    setInfo(INFO.waitingForPlayers(numReady, players.length - 1))
  }

  const handleChoosingWinningState = () => {
    // display all cards
    if (
      players.reduce((prev, curr) => (curr.chosenCard ? prev + 1 : prev), 0) !==
      players.length
    )
      return

    const newCards = shuffle(
      players.flatMap((p) =>
        p.isCzar || p._id === uuid
          ? []
          : [{ key: `choosing-${p._id}`, id: p.chosenCard, playerId: p._id }]
      )
    )

    const currPlayer = players.find((p) => p._id === uuid)
    if (!isCzar && currPlayer)
      newCards.unshift({
        key: `choosing-${currPlayer._id}`,
        id: currPlayer.chosenCard,
        playerId: currPlayer._id,
      })

    setCards((prevCards) => {
      if (prevCards.length <= 1) {
        return hydrateCards(
          newCards.map(({ id }) => id),
          'white'
        ).map((c, i) => ({ ...c, ...newCards[i] }))
      }

      return prevCards.filter(
        ({ playerId }) =>
          playerId && newCards.some(({ playerId: _id }) => playerId === _id)
      )
    })

    const czar = players.find((p) => p.isCzar)
    setInfo(
      isCzar ? INFO.czarChooseWinningCard : INFO.waitingForCzar(czar?.name)
    )
    if (isCzar) {
      setConfirmedCardId(null)
      setSelectedCardId(null)
      setCanSkip(false)
    }
  }

  const handleResultState = () => {
    const czar = players.find((p) => p.isCzar)
    if (!czar || !czar.chosenWinner) return

    const newCards = players.flatMap((p) =>
      p.isCzar || p._id === czar.chosenWinner
        ? []
        : [
            {
              key: `results-${p._id}`,
              playerId: p._id,
              id: p.chosenCard,
            },
          ]
    )
    newCards.unshift({
      key: `results-${czar.chosenWinner}`,
      playerId: czar.chosenWinner,
      id: players.find((p) => p._id === czar.chosenWinner)?.chosenCard,
    })

    setCards(
      hydrateCards(
        newCards.map(({ id }) => id),
        'white'
      ).map((c, i) => ({ ...c, ...newCards[i] }))
    )

    setInfo(INFO.results)
    setWinnerId(czar.chosenWinner)
    setConfirmedCardId(null)
  }

  useEffect(() => {
    if (!players.length) return

    if (gameState === GAME_STATES.choosing_card_czar) {
      setCanSkip(!isCzar)
      setCards(playerCards[isCzar ? 'black' : 'white'])
      setInfo(isCzar ? INFO.czarChooseCard : INFO.skips)
    } else if (gameState === GAME_STATES.choosing_card) {
      handleChoosingState()
    } else if (gameState === GAME_STATES.choosing_winning_card) {
      setWinnerId(null)
      setReadyNextRound(false)
      handleChoosingWinningState()
    } else if (gameState === GAME_STATES.results) {
      if (!readyNextRound) {
        setReadyNextRound(false)
        setCanSkip(true)
        handleResultState()
        return
      }

      const numReady = players.reduce(
        (accum, curr) => accum + (curr?.ready?.nextRound ? 1 : 0),
        0
      )
      setPlayersReady([numReady, players.length])

      if (numReady === players.length) {
        // TODO emit change game state
      }
    }
  }, [players, gameState, isCzar, playerCards])

  const onCardSelect = (id) => {
    if (
      confirmedCardId ||
      (!isCzar && gameState !== GAME_STATES.choosing_card) ||
      gameState === GAME_STATES.results
    )
      return
    if (id === selectedCardId) setSelectedCardId(null)
    else setSelectedCardId(id)
  }

  const onSkipCard = (id) => {
    if (selectedCardId === id) setSelectedCardId(null)
    skipCard(id, 'white')
  }

  const onConfirmCard = (id) => {
    setConfirmedCardId(id)

    if (gameState === GAME_STATES.choosing_winning_card) {
      setCards([])
      emit('set winning card', { roomId, id, uuid })
      return
    }

    if (!isCzar) setCards((p) => p.filter(({ id: _id }) => _id === id))
    else setCards([])

    setInfo(INFO.waitingForPlayers())

    emit('set card', { roomId, uuid, cardId: id, isCzar })
  }

  const resetStates = () => {
    setSelectedCardId(null)
    setConfirmedCardId(null)
  }

  const onContinue = () => {
    emit('set player ready', {
      uuid,
      roomId,
      ready: 'ready.nextRound',
      isReady: true,
    })
    setReadyNextRound(true)
    resetStates()
    // if curr player is winner, update themselves to be card czar, and then emit continue game
    // emit('continue game', { roomId, state: GAME_STATES.choosing_card })
  }

  const Card = (key, id, text) => {
    const player =
      gameState === GAME_STATES.results && players.find((p) => p._id === id)
    // TODO add in player name
    return (
      <Collapse key={key} sx={{ width: '100%' }}>
        <CardRow
          selected={
            winnerId === id || (!confirmedCardId && selectedCardId === id)
          }
          confirmed={confirmedCardId}
          onClick={(e) =>
            typeof e.target.className === 'string' && onCardSelect(id)
          }
          disabled={gameState === GAME_STATES.results}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box sx={{ maxWidth: '90%' }}>
            <Typography
              variant="body1"
              dangerouslySetInnerHTML={{ __html: text }}
            />
            {player && player.name && (
              <Typography variant="caption">{`${player.name}${
                player._id === uuid ? ' (You)' : ''
              }`}</Typography>
            )}
          </Box>
          {(() => {
            if (confirmedCardId) return <></>
            if (gameState === GAME_STATES.results)
              return winnerId === id ? (
                <WorkspacePremiumIcon
                  sx={{ color: '#ffcc00', fontSize: '16px' }}
                />
              ) : (
                <Typography variant="caption">
                  {canSkip ? '+5 skips' : ''}
                </Typography>
              )
            return (
              <StyledIconButton
                className="card-icon-button"
                disableRipple
                title={selectedCardId === id ? 'Select' : 'Skip'}
                onClick={() => {
                  if (selectedCardId === id) onConfirmCard(id)
                  else if (canSkip) onSkipCard(id)
                }}
                selected={selectedCardId === id}
                canSkip={canSkip}
              >
                {(() => {
                  if (selectedCardId === id) return <CheckIcon />
                  if (canSkip) return <CloseIcon />
                  return <></>
                })()}
              </StyledIconButton>
            )
          })()}
        </CardRow>
      </Collapse>
    )
  }

  return (
    <>
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
            {cards?.map(({ key, id, text, playerId }) =>
              Card(key ?? id, playerId ?? id, text)
            )}
          </TransitionGroup>
        </CardWrapper>

        <Box ref={readyWrapperRef}>
          {gameState === GAME_STATES.results && (
            <SwitchTransition mode="out-in">
              <Slide
                key={readyNextRound}
                direction="up"
                addEndListener={(node, done) =>
                  node.addEventListener('transitionend', done, false)
                }
                timeout={300}
                container={readyWrapperRef.current}
              >
                <Stack alignItems="center" mt={2.5}>
                  {readyNextRound ? (
                    <Box
                      sx={{
                        padding: '15px 40px 25px 40px',
                        bgcolor: '#363636',
                        borderRadius: '4px',
                        minWidth: '275px',
                        color: () => {
                          const percentage = playersReady[0] / playersReady[1]
                          if (percentage < 0.5) return '#d32f2f'
                          if (percentage < 1) return '#fbc02d'
                          return '#66bb6a'
                        },
                      }}
                    >
                      <Box p={1}>
                        <Typography
                          variant="body1"
                          sx={{ color: '#ffffffde', textAlign: 'center' }}
                        >
                          {playersReady[0] === playersReady[1]
                            ? 'Everyone ready!'
                            : `Waiting for players... ${playersReady[0]}/${playersReady[1]}`}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(playersReady[0] / playersReady[1]) * 100}
                        color="inherit"
                      />
                    </Box>
                  ) : (
                    <StyledButton
                      variant="extended"
                      disableRipple
                      onClick={onContinue}
                    >
                      Continue
                    </StyledButton>
                  )}
                </Stack>
              </Slide>
            </SwitchTransition>
          )}
        </Box>
      </Stack>
    </>
  )
}

export default Cards
