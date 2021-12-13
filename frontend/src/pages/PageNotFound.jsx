import { Box, Stack, Typography } from '@mui/material'

const PageNotFound = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
      }}
    >
      <Typography variant="h6">404 Page Not Found</Typography>
      <Stack justifyContent="center" mt={3}>
        <img
          src={`/images/lost${Math.random() > 0.5 ? '1' : '2'}.gif`}
          alt="lost"
          width="400px"
        />
      </Stack>
    </Box>
  )
}

export default PageNotFound
