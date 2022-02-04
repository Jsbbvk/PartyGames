import {
  useEffect,
  useState,
  createContext,
  useContext,
  useCallback,
  useRef,
} from 'react'
import { io } from 'socket.io-client'
import { isMobile } from 'react-device-detect'
import LZString from 'lz-string'
import shuffle from 'lodash/shuffle'
import { SceneManager } from '.'
import { NUMBER_OF_CARD_CHOICES } from '../../constants'
import { ThemeContext } from '../../../App'

const ENDPOINT = 'http://localhost:4001' // process.env.REACT_APP_SOCKET_PORT || 'http://localhost:4001'

const s = io(`${ENDPOINT}/cardsforus`, {
  transports: ['websocket', 'polling', 'flashsocket'],
  closeOnBeforeunload: false,
})

const GameContext = createContext()
export const useGameContext = () => useContext(GameContext)

const GameManager = () => {
  const { setBodyTransition } = useContext(ThemeContext)

  useEffect(() => {
    setBodyTransition(true)
  }, [])

  const [name, setName] = useState()
  const [uuid, setUUID] = useState()
  const [roomId, setRoomId] = useState()

  const reset = () => {
    s.emit('leave socket room', { roomId })
    sessionStorage.setItem('cardsforus:data', '')
    setName(null)
    setUUID(null)
    setRoomId(null)
  }

  const set = ({ name: n, uuid: id, roomId: rmId }) => {
    setName(n)
    setUUID(id)
    setRoomId(rmId)
  }

  // useEffect(() => {
  //   s.on('connect', () => {
  //     if (roomId && uuid) s.emit('reconnect', { uuid, roomId })
  //   })

  //   // handle leaving room upon refresh for desktop
  //   if (isMobile) return

  //   const unload = () => {
  //     s.emit('remove player', { roomId, uuid })
  //   }

  //   window.addEventListener('beforeunload', unload)

  //   // eslint-disable-next-line consistent-return
  //   return () => {
  //     window.removeEventListener('beforeunload', unload)
  //   }
  // }, [roomId, uuid])

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
        set,
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
