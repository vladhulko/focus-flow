import { useState } from 'react'
import { Music, Play, Pause, SkipForward, Volume2, VolumeX, Loader } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion' // eslint-disable-line no-unused-vars
import { useAudio } from '../context/AudioContext'

const MusicPlayer = () => {
  const {
    isPlaying, isLoading, currentTrack, currentTrackIndex,
    tracks, volume, isMuted,
    togglePlay, nextTrack, selectTrack, toggleMute, changeVolume,
  } = useAudio()

  const [showPlayer, setShowPlayer] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setShowPlayer(!showPlayer)}
        className={`glass-button px-4 py-3 flex items-center gap-2 text-sm font-medium
          ${isPlaying ? 'text-accent-pink border-accent-pink/30' : 'text-white/70'}`}
      >
        {isLoading
          ? <Loader size={18} className="animate-spin" />
          : <Music size={18} className={isPlaying ? 'animate-pulse' : ''} />
        }
        {isPlaying && (
          <span className="hidden sm:inline text-xs truncate max-w-25">
            {currentTrack.name}
          </span>
        )}
      </button>

      <AnimatePresence>
        {showPlayer && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 glass-strong p-4 w-64 z-50"
          >
            <div className="mb-3">
              <p className="text-white/50 text-xs uppercase tracking-wider mb-1">
                {isPlaying ? 'Now Playing' : 'Select a Track'}
              </p>
              <p className="text-white font-medium text-sm flex items-center gap-2">
                {currentTrack.name}
                {isLoading && <Loader size={12} className="animate-spin text-white/40" />}
              </p>
            </div>

            <div className="flex items-center justify-between mb-3">
              <button
                onClick={togglePlay}
                className="glass-button p-3 text-white hover:text-accent-pink"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>

              <button
                onClick={nextTrack}
                className="glass-button p-3 text-white/70 hover:text-white"
              >
                <SkipForward size={18} />
              </button>

              <button
                onClick={toggleMute}
                className="glass-button p-3 text-white/70 hover:text-white"
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Volume2 size={14} className="text-white/40" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => changeVolume(parseFloat(e.target.value))}
                className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer
                          [&::-webkit-slider-thumb]:appearance-none
                          [&::-webkit-slider-thumb]:w-3
                          [&::-webkit-slider-thumb]:h-3
                          [&::-webkit-slider-thumb]:rounded-full
                          [&::-webkit-slider-thumb]:bg-accent-pink"
              />
            </div>

            <div className="mt-3 pt-3 border-t border-white/10 max-h-32 overflow-y-auto">
              {tracks.map((track, i) => (
                <button
                  key={track.id}
                  onClick={() => {
                    selectTrack(i)
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all
                    ${i === currentTrackIndex
                      ? 'bg-accent-pink/20 text-accent-pink'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {track.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MusicPlayer
