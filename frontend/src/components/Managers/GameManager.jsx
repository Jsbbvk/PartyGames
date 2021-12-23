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

const ENDPOINT = 'http://localhost:4001'

const s = io(ENDPOINT, {
  transports: ['websocket', 'polling', 'flashsocket'],
})

const GameContext = createContext()
export const useGameContext = () => useContext(GameContext)

const GameManager = () => {
  return (
    <GameContext.Provider value={{ socket: s }}>
      <SceneManager />
    </GameContext.Provider>
  )
}

export const useListener = (event, cb) => {
  const { socket } = useGameContext()

  const callbackRef = useRef(cb)
  callbackRef.current = cb

  useEffect(() => {
    function socketHandler(_this, ...args) {
      if (callbackRef.current) {
        callbackRef.current.apply(_this, args)
      }
    }

    socket?.on(event, socketHandler)

    return () => socket.off(event, socketHandler)
  }, [socket, event])
}

export const useEmitter = (event) => {
  const { socket } = useGameContext()
  return useCallback(
    (data, cb) => socket?.emit(event, data, cb),
    [socket, event]
  )
}

export default GameManager
