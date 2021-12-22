import { useEffect, useState } from 'react'

const useSocketEmitter = ({ socket, endpoint, values, cb }) => {
  useEffect(() => {
    socket.emit(endpoint, values, cb)
  }, [])
}

export default useSocketEmitter
