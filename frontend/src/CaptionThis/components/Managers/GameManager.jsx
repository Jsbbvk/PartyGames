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
import { useCookies } from 'react-cookie'
import shuffle from 'lodash/shuffle'
import { SceneManager } from '.'
import MemesList from '../../constants/memes'
import { NUMBER_OF_MEME_CHOICES } from '../../constants'

// https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-20-04
const ENDPOINT = process.env.REACT_APP_SOCKET_PORT || 'http://localhost:4001'

const s = io(ENDPOINT, {
  transports: ['websocket', 'polling', 'flashsocket'],
  closeOnBeforeunload: false,
})

const GameContext = createContext()
export const useGameContext = () => useContext(GameContext)

const GameManager = () => {
  const [cookies, setCookies] = useCookies(['UnusedMemes', 'UsedMemes'])
  const [memeChoices, setMemeChoices] = useState([])
  const [numMemeChoices, setNumMemeChoices] = useState(NUMBER_OF_MEME_CHOICES)

  const [name, setName] = useState()
  const [uuid, setUUID] = useState()
  const [roomId, setRoomId] = useState()

  const reset = () => {
    s.emit('leave socket room', { roomId })
    sessionStorage.setItem('captionthis:data', '')
    setName(null)
    setUUID(null)
    setRoomId(null)
  }

  const getMemes = () => {
    const memes = LZString.decompressFromUTF16(cookies.UsedMemes)
    if (!memes) return
    setMemeChoices(
      memes.split('/').map((src) => ({
        src,
        name: MemesList.find(({ src: memeSrc }) => memeSrc === src).name,
      }))
    )
  }

  const refreshMemes = () => {
    let availableMemes = LZString.decompressFromUTF16(cookies.UnusedMemes)

    if (!availableMemes) availableMemes = MemesList.map(({ src }) => src)
    else availableMemes = availableMemes.split('/')

    const shuffledMemesList = shuffle(availableMemes)
    let memes = shuffledMemesList.slice(0, numMemeChoices)
    let restMemes = shuffledMemesList.slice(numMemeChoices)

    if (memes.length < numMemeChoices) {
      // add more memes
      const memesList = shuffle(
        MemesList.flatMap(({ src }) => (memes.includes(src) ? [] : [src]))
      )

      restMemes = memesList.slice(numMemeChoices - memes.length)
      memes = [...memes, ...memesList.slice(0, numMemeChoices - memes.length)]
    }

    const memeObjects = memes.map((src) => ({
      src,
      name: MemesList.find(({ src: memeSrc }) => memeSrc === src).name,
    }))

    const compressedMemeList = LZString.compressToUTF16(restMemes.join('/'))

    setMemeChoices(memeObjects)
    setCookies('UnusedMemes', compressedMemeList, {
      path: '/',
    })
    setCookies('UsedMemes', LZString.compressToUTF16(memes.join('/')), {
      path: '/',
    })
  }

  const set = ({ name: n, uuid: id, roomId: rmId }) => {
    setName(n)
    setUUID(id)
    setRoomId(rmId)
  }

  useEffect(() => {
    getMemes()

    s.on('update number meme choices', (data) => {
      if (!data) return
      const { numMemes } = data
      setNumMemeChoices(numMemes)
    })
  }, [])

  useEffect(() => {
    s.on('connect', () => {
      if (roomId && uuid) s.emit('reconnect', { uuid, roomId })
    })

    // handle leaving room upon refresh for desktop
    if (isMobile) return

    const unload = () => {
      s.emit('remove player', { roomId, uuid })
    }

    window.addEventListener('beforeunload', unload)

    // eslint-disable-next-line consistent-return
    return () => {
      window.removeEventListener('beforeunload', unload)
    }
  }, [roomId, uuid])

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
        memeChoices,
        refreshMemes,
        numMemeChoices,
        setNumMemeChoices,
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
