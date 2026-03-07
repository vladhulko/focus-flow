import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { Howl } from 'howler'

const AudioContext = createContext()

// eslint-disable-next-line react-refresh/only-export-components
export const useAudio = () => {
  const context = useContext(AudioContext)
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider')
  }
  return context
}

const TRACKS = [
  { id: 1, name: 'Lofi Hip Hop Radio', url: 'https://streams.ilovemusic.de/iloveradio17.mp3', type: 'stream' },
  { id: 2, name: 'Chillhop Radio', url: 'https://streams.fluxfm.de/Chillhop/mp3-320/audio/', type: 'stream' },
  { id: 3, name: 'Jazz Radio', url: 'https://streams.ilovemusic.de/iloveradio14.mp3', type: 'stream' },
  { id: 4, name: 'Ambient Radio', url: 'https://streams.ilovemusic.de/iloveradio15.mp3', type: 'stream' },
  { id: 5, name: 'Chillout Radio', url: 'https://streams.ilovemusic.de/iloveradio21.mp3', type: 'stream' },
]

export const AudioProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('focusflow-volume')
    return saved !== null ? parseFloat(saved) : 0.4
  })
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const howlRef = useRef(null)
  const currentTrack = TRACKS[currentTrackIndex]

  useEffect(() => {
    localStorage.setItem('focusflow-volume', volume)
  }, [volume])

  const destroyHowl = useCallback(() => {
    if (howlRef.current) {
      howlRef.current.unload()
      howlRef.current = null
    }
  }, [])

  const playTrack = useCallback((trackIndex) => {
    destroyHowl()

    const track = TRACKS[trackIndex]
    if (!track || !track.url) return

    setIsLoading(true)

    const howl = new Howl({
      src: [track.url],
      html5: true,
      volume: isMuted ? 0 : volume,
      loop: track.type !== 'stream',
      onplay: () => {
        setIsPlaying(true)
        setIsLoading(false)
      },
      onpause: () => setIsPlaying(false),
      onstop: () => setIsPlaying(false),
      onloaderror: () => {
        setIsLoading(false)
        console.warn(`Failed to load track: ${track.name}`)
      },
      onplayerror: () => {
        setIsLoading(false)
        howl.once('unlock', () => howl.play())
      },
    })

    howlRef.current = howl
    howl.play()
  }, [destroyHowl, isMuted, volume])

  useEffect(() => {
    if (howlRef.current) {
      howlRef.current.volume(isMuted ? 0 : volume)
    }
  }, [volume, isMuted])

  const togglePlay = useCallback(() => {
    if (!howlRef.current) {
      playTrack(currentTrackIndex)
      return
    }

    if (isPlaying) {
      howlRef.current.pause()
    } else {
      howlRef.current.play()
    }
  }, [isPlaying, playTrack, currentTrackIndex])

  const nextTrack = useCallback(() => {
    const nextIdx = (currentTrackIndex + 1) % TRACKS.length
    setCurrentTrackIndex(nextIdx)
    if (isPlaying || howlRef.current) {
      playTrack(nextIdx)
    }
  }, [currentTrackIndex, isPlaying, playTrack])

  const selectTrack = useCallback((index) => {
    setCurrentTrackIndex(index)
    playTrack(index)
  }, [playTrack])

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev)
  }, [])

  const changeVolume = useCallback((newVol) => {
    setVolume(newVol)
    if (isMuted) setIsMuted(false)
  }, [isMuted])

  const stopMusic = useCallback(() => {
    destroyHowl()
    setIsPlaying(false)
  }, [destroyHowl])

  useEffect(() => {
    return () => destroyHowl()
  }, [destroyHowl])

  const value = {
    isPlaying,
    isLoading,
    currentTrack,
    currentTrackIndex,
    tracks: TRACKS,
    volume,
    isMuted,
    togglePlay,
    nextTrack,
    selectTrack,
    toggleMute,
    changeVolume,
    stopMusic,
  }

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
}