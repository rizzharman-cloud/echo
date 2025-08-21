import React, { useState, useRef, useEffect } from 'react'
import ReactPlayer from 'react-player/youtube'
import { FaYoutube } from "react-icons/fa";
import { LuPanelRightClose } from "react-icons/lu";
import {
    MdFavoriteBorder,
    MdFavorite,
    MdSkipPrevious,
    MdSkipNext,
    MdPlayArrow,
    MdPause,
} from 'react-icons/md'
import { motion } from 'framer-motion'

export default function MusicPlayer({
                                        song,
                                        likedSongs = [],
                                        isLikedPanelActive,
                                        onLikeToggle,
                                        onPrevLikedSong,
                                        onNextLikedSong,
                                    }) {
    const [playedSeconds, setPlayedSeconds] = useState(0)
    const [duration, setDuration] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [autoPlayNextSong, setAutoPlayNextSong] = useState(false)
    const [showVideo, setShowVideo] = useState(false)

    const audioPlayerRef = useRef(null)
    const reelsPlayerRef = useRef(null)


    const hasSong = Boolean(song?.videoId)

    // Provide default values when there's no valid song
    const defaultSong = {
        title: 'Memoies',
        artist: 'Harman',
        imageUrl: 'logo.png',
        videoId: ''
    }

    // Use either the actual song or fallback to the defaults
    const currentSong = hasSong ? song : defaultSong
    const { videoId, title, artist, imageUrl } = currentSong

    // Check if current track is liked
    const isCurrentTrackLiked = likedSongs.some((item) => item.videoId === videoId)

    // Handle auto-play logic (like skipping to next in liked panel
    useEffect(() => {
        if (!hasSong) {
            setIsPlaying(false)
            setAutoPlayNextSong(false)
        } else {
            if (autoPlayNextSong) {
                setIsPlaying(true)
                setAutoPlayNextSong(false)
            } else {
                // Default to paused if not explicitly auto-playing
                setIsPlaying(false)
            }
        }
    }, [song, hasSong, autoPlayNextSong])

    const handlePlayPause = () => {
        if (!hasSong) return
        setIsPlaying((prev) => !prev)
    }

    const handleProgress = (state) => {
        setPlayedSeconds(state.playedSeconds)
    }

    const handleDuration = (dur) => {
        setDuration(dur)
    }

    const handleSeek = (e) => {
        const newTime = parseFloat(e.target.value)
        setPlayedSeconds(newTime)

        if (audioPlayerRef.current) {
            audioPlayerRef.current.seekTo(newTime, 'seconds')
        }
        if (reelsPlayerRef.current) {
            reelsPlayerRef.current.seekTo(newTime, 'seconds')
        }
    }

    const handleTrackEnd = () => {
        if (isPlaying && isLikedPanelActive && onNextLikedSong) {
            setAutoPlayNextSong(true)
            onNextLikedSong()
        }
    }

    // Convert seconds to MM:SS
    const formatTime = (time) => {
        if (!time || isNaN(time)) return '0:00'
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60).toString().padStart(2, '0')
        return `${minutes}:${seconds}`
    }

    return (
        <div className="w-full h-full bg-slate-950/80 backdrop-blur-xl border-t border-slate-700/50 flex items-center text-white px-2 sm:px-4 md:px-8 relative">
            {/* (1) Left Section: Thumbnail, Title/Artist, and Like Button */}
            <div className="flex items-center w-full md:w-[30%] min-w-0">
                {/* Image + Text in one flex row (with possible grow) */}
                <div className="flex items-center min-w-0 flex-grow space-x-2 sm:space-x-4">
                    {/* Thumbnail */}
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-15 h-12 sm:w-16 sm:h-14 object-cover rounded-xl shadow-lg shadow-blue-500/20 border border-slate-600/50 flex-shrink-0"
                    />

                    {/* Title & Artist (truncate so long text doesn't push the button) */}
                    <div className="flex flex-col min-w-0">
                        <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-sm sm:text-lg font-semibold truncate text-slate-100"
                        >
                            {title}
                        </motion.div>
                        <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-xs sm:text-sm text-slate-400 truncate"
                        >
                            {artist}
                        </motion.div>
                    </div>
                </div>

                {/* Like Button (kept separate, so it doesn't shift) */}
                {hasSong && (
                    <div className="flex items-center space-x-2 ml-2 sm:ml-4 flex-shrink-0">
                        <button
                            className="text-blue-400 hover:text-blue-300 transition-all duration-200 hover:scale-110 touch-manipulation"
                            onClick={() => onLikeToggle?.(currentSong, isCurrentTrackLiked)}
                        >
                            {isCurrentTrackLiked ? (
                                <MdFavorite size={20} className="sm:w-6 sm:h-6" />
                            ) : (
                                <MdFavoriteBorder size={20} className="sm:w-6 sm:h-6" />
                            )}
                        </button>
                        
                        {/* Add to Playlist Button - Only visible when signed in */}
                    </div>
                )}
            </div>

            {/* (2) Middle Controls + (3) Seek bar (hidden on mobile) */}
            <div className="hidden md:flex w-[40%] flex-col items-center justify-center">
                {/* Controls row */}
                <div className="flex justify-center items-center space-x-6">
                    {isLikedPanelActive && (
                        <button
                            className="hover:text-blue-400 transition-all duration-200 hover:scale-110"
                            onClick={onPrevLikedSong}
                            disabled={!hasSong}
                        >
                            <MdSkipPrevious size={28} />
                        </button>
                    )}

                    <button
                        className={`bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 hover:scale-105 rounded-xl p-2 shadow-lg shadow-blue-500/25 ${
                            !hasSong ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        onClick={handlePlayPause}
                        disabled={!hasSong}
                    >
                        {isPlaying ? <MdPause size={28} /> : <MdPlayArrow size={28} />}
                    </button>

                    {isLikedPanelActive && (
                        <button
                            className="hover:text-blue-400 transition-all duration-200 hover:scale-110"
                            onClick={onNextLikedSong}
                            disabled={!hasSong}
                        >
                            <MdSkipNext size={28} />
                        </button>
                    )}

                </div>

                {/* Seek bar (desktop only) */}
                <div className="flex items-center space-x-4 mt-3 w-full justify-center">
                    <span className="text-sm text-slate-400">{formatTime(playedSeconds)}</span>
                    <input
                        type="range"
                        className="flex-1 h-2 bg-slate-700 rounded-full cursor-pointer accent-blue-500"
                        min="0"
                        max={duration}
                        step="1"
                        value={playedSeconds}
                        onChange={handleSeek}
                        disabled={!hasSong}
                    />
                    <span className="text-sm text-slate-400">{formatTime(duration)}</span>
                </div>
            </div>

            {/* Video Toggle Button - Right Corner */}
            {hasSong && (
                <div className="hidden md:block absolute top-4 right-4">
                    <button
                        className="text-cyan-400 hover:text-cyan-300 transition-all duration-200 hover:scale-110 bg-slate-900/60 backdrop-blur-sm rounded-full p-2 border border-slate-600/50"
                        onClick={() => setShowVideo((prev) => !prev)}
                    >
                        {showVideo ? <LuPanelRightClose size={24} /> : <FaYoutube size={24} />}
                    </button>
                </div>
            )}

            {/* Mobile Controls */}
            <div className="md:hidden absolute -top-16 left-0 right-0 bg-slate-950/80 backdrop-blur-xl border-t border-slate-700/50 p-3">
                <div className="flex justify-center items-center space-x-6 mb-3">
                    {isLikedPanelActive && (
                        <button
                            className="hover:text-blue-400 transition-all duration-200 hover:scale-110 touch-manipulation"
                            onClick={onPrevLikedSong}
                            disabled={!hasSong}
                        >
                            <MdSkipPrevious size={24} />
                        </button>
                    )}

                    <button
                        className={`bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 hover:scale-105 rounded-xl p-2 shadow-lg shadow-blue-500/25 touch-manipulation ${
                            !hasSong ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        onClick={handlePlayPause}
                        disabled={!hasSong}
                    >
                        {isPlaying ? <MdPause size={24} /> : <MdPlayArrow size={24} />}
                    </button>

                    {isLikedPanelActive && (
                        <button
                            className="hover:text-blue-400 transition-all duration-200 hover:scale-110 touch-manipulation"
                            onClick={onNextLikedSong}
                            disabled={!hasSong}
                        >
                            <MdSkipNext size={24} />
                        </button>
                    )}
                </div>

                {/* Mobile Seek bar */}
                <div className="flex items-center space-x-3">
                    <span className="text-xs text-slate-400 flex-shrink-0">{formatTime(playedSeconds)}</span>
                    <input
                        type="range"
                        className="flex-1 h-2 bg-slate-700 rounded-full cursor-pointer accent-blue-500"
                        min="0"
                        max={duration}
                        step="1"
                        value={playedSeconds}
                        onChange={handleSeek}
                        disabled={!hasSong}
                    />
                    <span className="text-xs text-slate-400 flex-shrink-0">{formatTime(duration)}</span>
                </div>
            </div>

            {/*AUDIO-ONLY PLAYER (hidden visually) */}
            {hasSong && (
                <ReactPlayer
                    ref={audioPlayerRef}
                    url={`https://www.youtube.com/watch?v=${videoId}`}
                    playing={!showVideo && isPlaying}
                    onProgress={handleProgress}
                    onDuration={handleDuration}
                    onEnded={handleTrackEnd}
                    width="0"
                    height="0"
                    config={{
                        youtube: {
                            playerVars: {
                                disablekb: 1
                            }
                        }
                    }}
                />
            )}

            {/* REELS-STYLE VIDEO (Desktop) */}
            {hasSong && (
                <div
                    className={`
            hidden lg:flex fixed 2xl:bottom-20 bottom-[166px] right-0 z-50 transform transition-transform duration-500
            rounded-tl-lg bg-black
            ${showVideo ? 'translate-x-0' : 'translate-x-full'}
            h-[760px] 2xl:h-[1000px] 2xl:w-[50%] w-[30%]
          `}
                >
                    <div className="relative w-full h-full overflow-hidden rounded-tl-lg">
                        <ReactPlayer
                            ref={reelsPlayerRef}
                            url={`https://www.youtube.com/watch?v=${videoId}`}
                            playing={showVideo && isPlaying}
                            onProgress={handleProgress}
                            onDuration={handleDuration}
                            onEnded={handleTrackEnd}
                            width="136%"
                            height="100%"
                            className="absolute top-1/2 left-1/2"
                            style={{
                                transform: 'translate(-50%, -50%) scale(4)',
                                transformOrigin: 'center center'
                            }}
                            config={{
                                youtube: {
                                    playerVars: {
                                        disablekb: 1,
                                        playsinline: 1,
                                        vq: 'hd1080'
                                    }
                                }
                            }}
                        />
                    </div>

                    {/* Title/Artist overlay at bottom of the Reels-style video */}
                    <div className="absolute 2xl:w-full w-full h-[62px] 2xl:h-[7rem] top-[759px] 2xl:top-[890px] z-10 p-2 bg-black/60  text-white overflow-hidden">
                
                        <h3 className="font-semibold text-lg text-yellow-100 text-center">
                            {title || 'Unknown Title'}
                        </h3>
                        <p className="text-sm text-yellow-100 text-center">
                            {artist || 'Unknown Artist'}
                        </p>
                    </div>
                </div>
            )}

        </div>
    )
}