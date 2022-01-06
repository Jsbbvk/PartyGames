import { Stack, Container, styled, Typography, Box } from '@mui/material'

const CardRow = styled(Stack)({
  padding: '12px',
  boxShadow:
    'rgb(0 0 0 / 20%) 0px 3px 1px -2px, rgb(0 0 0 / 14%) 0px 2px 2px 0px, rgb(0 0 0 / 12%) 0px 1px 5px 0px',
})

const CardWrapper = styled(Box)({
  padding: '0 12px',
  overflowY: 'auto',
  height: '100%',

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

const Selection = () => {
  const dummyText = 'A sample string that represents a black card'

  const Card = (id, text) => (
    <CardRow key={id}>
      <Typography variant="body1">{text}</Typography>
    </CardRow>
  )

  return (
    <Container maxWidth="sm">
      <Box sx={{ height: '40vh', pt: 10 }}>
        <Typography variant="body1">{dummyText}</Typography>
      </Box>
      <CardWrapper sx={{ height: '50vh' }} spacing={3}>
        {[...new Array(10).keys()].map((i) => Card(i, dummyText))}
      </CardWrapper>
    </Container>
  )
}

export default Selection
