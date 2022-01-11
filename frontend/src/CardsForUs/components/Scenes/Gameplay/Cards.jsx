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

const CardRow = styled(Stack)(({ theme, selected }) => ({
  margin: '4px 0',
  padding: '10px 12px',
  // transition: 'color 250ms ease-in-out, background-color 250ms ease-in-out',
  color: theme.palette.mode === 'light' ? '#ffffffde' : '#000000de',
  backgroundColor: (() => {
    const { mode } = theme?.palette
    if (mode === 'light') {
      return selected ? '#3e3e3e' : '#121212'
    }
    return selected ? '#fff' : '#bebebe'
  })(),
  cursor: 'pointer',

  '@media(hover: hover) and (pointer: fine)': {
    '&:hover': {
      backgroundColor: theme.palette.mode === 'light' ? '#3e3e3e' : '#fff',
    },
  },
}))

const StyledIconButton = styled(IconButton)(({ theme, selected }) => ({
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

const INFO = {
  czar: 'You are the Card Czar',
  waiting: 'Waiting for Card Czar',
  waiting_czar: 'Waiting for players',
  results: 'Results',
  empty: '',
  skips: 'Skips left: ',
}

const Cards = () => {
  const [info, setInfo] = useState(INFO.skips)
  const [selectedCardId, setSelectedCardId] = useState()
  const [cards, skipCard] = useCardManager()

  useEffect(() => {}, [])

  const onCardSelect = (id) => {
    if (id === selectedCardId) setSelectedCardId(null)
    else setSelectedCardId(id)
  }

  const onSkipCard = (id) => {
    if (selectedCardId === id) setSelectedCardId(null)
    skipCard(id, 'white')
  }

  const onConfirmCard = (id) => {}

  const Card = (id, text) => (
    <Collapse key={id} sx={{ width: '100%' }}>
      <CardRow
        selected={selectedCardId === id}
        onClick={(e) =>
          typeof e.target.className === 'string' && onCardSelect(id)
        }
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography
          variant="body1"
          dangerouslySetInnerHTML={{ __html: text }}
        />
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
      </CardRow>
    </Collapse>
  )

  return (
    <Stack sx={{ height: '60vh' }}>
      <Box>
        <SwitchTransition mode="out-in">
          <Fade
            key={info}
            addEndListener={(node, done) =>
              node.addEventListener('transitionend', done, false)
            }
            timeout={250}
          >
            <Typography variant="body2" sx={{ textAlign: 'center' }}>
              {info}
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
          {cards.white.map(({ id, text }) => Card(id, text))}
        </TransitionGroup>
      </CardWrapper>
    </Stack>
  )
}

export default Cards
