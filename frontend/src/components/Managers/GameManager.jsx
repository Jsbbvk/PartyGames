import {
  useEffect,
  useState,
  createContext,
  useContext,
  useCallback,
  useRef,
} from 'react'
import { io } from 'socket.io-client'
import { SceneManager } from '.'

const ENDPOINT = process.env.REACT_APP_SOCKET_PORT || 'http://localhost:4001'

const s = io(ENDPOINT, {
  transports: ['websocket', 'polling', 'flashsocket'],
})

const GameContext = createContext()
export const useGameContext = () => useContext(GameContext)

const GameManager = () => {
  const [name, setName] = useState()
  const [uuid, setUUID] = useState()
  const [roomId, setRoomId] = useState()

  const reset = () => {
    setName(null)
    setUUID(null)
    setRoomId(null)
  }

  // TODO handle players leaving in the middle

  return (
    <GameContext.Provider
      value={{
        socket: s,
        name,
        uuid,
        setName,
        setUUID,
        roomId,
        setRoomId,
        reset,
      }}
    >
      <SceneManager />
    </GameContext.Provider>
  )
}

export const useListener = (event, cb) => {
  const { socket } = useGameContext()

  const callbackRef = useRef(cb)
  callbackRef.current = cb

  useEffect(() => {
    function socketHandler(...args) {
      if (callbackRef.current) {
        callbackRef.current.apply(this, args)
      }
    }

    socket?.on(event, socketHandler)

    return () => socket.off(event, socketHandler)
  }, [socket, event])
}

export const useOnceListener = (event, cb) => {
  const { socket } = useGameContext()

  const callbackRef = useRef(cb)
  callbackRef.current = cb

  useEffect(() => {
    function socketHandler(...args) {
      if (callbackRef.current) {
        callbackRef.current.apply(this, args)
      }
    }

    socket?.once(event, socketHandler)

    return () => socket.off(event, socketHandler)
  }, [socket, event])
}

export const useEmitter = () => {
  const { socket } = useGameContext()
  return useCallback(
    (event, data, cb) => socket?.emit(event, data, cb),
    [socket]
  )
}

export default GameManager
