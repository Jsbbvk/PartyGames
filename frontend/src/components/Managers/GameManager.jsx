import {
  useEffect,
  useState,
  createContext,
  useContext,
  useCallback,
} from 'react'
import { io } from 'socket.io-client'
import { SceneManager } from '.'

const ENDPOINT = 'http://localhost:4001'

const GameContext = createContext()
export const useGameContext = () => useContext(GameContext)

const GameManager = () => {
  const [socket, setSocket] = useState()

  useEffect(() => {
    const s = io(ENDPOINT, {
      transports: ['websocket', 'polling', 'flashsocket'],
    })
    console.log(s)
    setSocket(s)
    return () => s.close()
  }, [])

  const emit = (endpoint, data, cb) => {
    socket?.emit(endpoint, data, cb)
  }

  const on = (endpoint, cb) => {
    socket?.on(endpoint, cb)
  }

  return (
    <GameContext.Provider value={{ emit, on }}>
      <SceneManager />
    </GameContext.Provider>
  )
}

export default GameManager
