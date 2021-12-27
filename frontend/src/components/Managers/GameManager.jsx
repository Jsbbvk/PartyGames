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
  closeOnBeforeunload: false,
})

const GameContext = createContext()
export const useGameContext = () => useContext(GameContext)

const GameManager = () => {
  const [name, setName] = useState()
  const [uuid, setUUID] = useState()
  const [roomId, setRoomId] = useState()

  useEffect(() => {
    s.on('connect', () => {
      if (roomId && uuid) s.emit('reconnect', { uuid, roomId })
    })
  }, [roomId, uuid])

  const reset = () => {
    s.emit('leave socket room', { roomId })
    setName(null)
    setUUID(null)
    setRoomId(null)
  }

  useEffect(() => {
    const unload = () => {
      s.emit('remove player', { roomId, uuid })
    }

    window.addEventListener('beforeunload', unload)

    return () => {
      window.removeEventListener('beforeunload', unload)
    }
  }, [roomId, uuid])

  useEffect(() => {
    // const onBlur = () => {
    //   s.emit('blur')
    // }
    // const onFocus = () => {
    //   s.emit('focus')
    // }
    // const onVisibility = (e) => {
    //   s.emit('visibility', document.visibilityState)
    // }
    // const pagehide = () => s.emit('pagehide')
    // // window.addEventListener('blur', onBlur)
    // // window.addEventListener('focus', onFocus)
    // // window.addEventListener('pagehide', pagehide)
    // // window.addEventListener('visibilitychange', onVisibility)
    // return () => {
    //   window.removeEventListener('blur', onBlur)
    //   window.removeEventListener('focus', onFocus)
    // }
  }, [])

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
