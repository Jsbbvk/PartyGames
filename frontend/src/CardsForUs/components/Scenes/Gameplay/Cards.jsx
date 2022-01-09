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
import { useState, useEffect } from 'react'
import { SwitchTransition, TransitionGroup } from 'react-transition-group'
import shuffle from 'lodash/shuffle'

const CardRow = styled(Stack)(({ theme, selected }) => ({
  margin: '4px 0',
  padding: '10px 12px',
  transition: 'color 250ms ease-in-out, background-color 250ms ease-in-out',
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

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.mode === 'light' ? '#ffffff8a' : '#0000008a',
  transition: 'color 250ms ease-in-out',
  padding: 0,

  '& > svg': {
    fontSize: '16px',
    transition: 'none',
  },

  '&:hover': {
    backgroundColor: 'inherit',
    color: theme.palette.mode === 'light' ? '#ffffffde' : '#000000de',
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

const CARDS = [...new Array(10).keys()]

const Cards = () => {
  const [info, setInfo] = useState(INFO.skips)
  const [selectedCard, setSelectedCard] = useState()
  const [cards, setCards] = useState([])

  const dummyText = 'A sample string that represents a black card'

  useEffect(() => {
    setCards(CARDS.slice(0, 7))
  }, [])

  const onCardSelect = (id) => {
    if (id === selectedCard) setSelectedCard(null)
    else setSelectedCard(id)
  }

  const onSkipCard = (id) => {
    const newCard = shuffle(CARDS).find((cId) => !cards.includes(cId))
    setCards((p) => [...p.filter((cId) => id !== cId), newCard])
  }

  const Card = (id, text) => (
    <Collapse key={id} sx={{ width: '100%' }}>
      <CardRow
        selected={selectedCard === id}
        onClick={() => onCardSelect(id)}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography variant="body1">{text}</Typography>
        <StyledIconButton
          disableRipple
          title="Skip"
          onClick={() => onSkipCard(id)}
        >
          <CloseIcon />
        </StyledIconButton>
      </CardRow>
    </Collapse>
  )

  return (
    <Stack sx={{ height: '55vh' }}>
      <Box>
        {/* <button type="button" onClick={() => setInfo(INFO.results)}>
          change
        </button> */}
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
          {cards.map((i) => Card(i, `${dummyText} ${i}`))}
        </TransitionGroup>
      </CardWrapper>
    </Stack>
  )
}

export default Cards
