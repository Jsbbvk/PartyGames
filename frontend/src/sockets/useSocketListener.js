import { useEffect, useState } from 'react'

const useSocketListener = ({ socket, endpoint }) => {
  const [data, setData] = useState()
  useEffect(() => {
    socket.on(endpoint, (d) => {
      setData(d)
    })
  }, [])

  return data
}

export default useSocketListener
