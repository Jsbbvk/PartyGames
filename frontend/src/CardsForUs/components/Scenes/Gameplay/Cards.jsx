import { Stack, styled, Typography, Box, Fade, Collapse } from '@mui/material'
import { useState } from 'react'
import { SwitchTransition, TransitionGroup } from 'react-transition-group'

const CardRow = styled(Stack)(({ theme }) => ({
  margin: '4px 0',
  padding: '12px',
  transition: 'color 250ms ease-in-out, background-color 250ms ease-in-out',
  color: theme.palette.mode === 'light' ? '#ffffff' : '#000000de',
  backgroundColor: theme.palette.mode === 'light' ? '#121212' : '#fff',
}))

const CardWrapper = styled(Box)({
  padding: '0 12px',
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
}

const Cards = () => {
  const [info, setInfo] = useState(INFO.waiting)
  const dummyText = 'A sample string that represents a black card'

  const Card = (id, text) => (
    <Collapse key={id} sx={{ width: '100%' }}>
      <CardRow>
        <Typography variant="body1">{text}</Typography>
      </CardRow>
    </Collapse>
  )

  return (
    <Stack sx={{ height: '55vh' }}>
      <Box>
        <button type="button" onClick={() => setInfo(INFO.results)}>
          change
        </button>
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
          {[...new Array(7).keys()].map((i) => Card(i, dummyText))}
        </TransitionGroup>
      </CardWrapper>
    </Stack>
  )
}

export default Cards
