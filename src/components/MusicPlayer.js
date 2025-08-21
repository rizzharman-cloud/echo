import React, { useState, useRef, useEffect } from 'react'
import ReactPlayer from 'react-player/youtube'
import { FaYoutube } from "react-icons/fa";
import { LuPanelRightClose } from "react-icons/lu";
import { MdExpandMore, MdExpandLess, MdClose } from 'react-icons/md';
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
    const [showFullPagePlayer, setShowFullPagePlayer] = useState(false)

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
        <div className="w-full h-full bg-gradient-to-r from-slate-950/90 via-slate-900/90 to-slate-950/90 backdrop-blur-2xl border-t border-cyan-500/30 flex items-center text-white px-2 sm:px-4 md:px-8 relative overflow-hidden">
            {/* Futuristic glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/10 to-purple-500/5 animate-pulse" />
            
            {/* (1) Left Section: Thumbnail, Title/Artist, and Like Button */}
            <div className="flex items-center w-full md:w-[30%] min-w-0 relative z-10">
                {/* Image + Text in one flex row (with possible grow) */}
                <div 
                    className="flex items-center min-w-0 flex-grow space-x-2 sm:space-x-3 md:cursor-default"
                    onClick={() => {
                        // Only toggle on mobile (md:hidden)
                        if (window.innerWidth < 768) {
                            setShowFullPagePlayer(true);
                        }
                    }}
                >
                    {/* Thumbnail */}
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-cover rounded-2xl shadow-lg shadow-cyan-500/20 border border-slate-600/50 flex-shrink-0"
                    />

                    {/* Title & Artist (truncate so long text doesn't push the button) */}
                    <div className="flex flex-col min-w-0">
                        <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-xs sm:text-sm md:text-lg font-semibold truncate text-slate-100"
                        >
                            {title}
                        </motion.div>
                        <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-xs text-slate-400 truncate"
                        >
                            {artist}
                        </motion.div>
                        {/* Mobile tap indicator */}
                        <div className="md:hidden text-xs text-cyan-400/60 truncate">
                            Tap to open full player
                        </div>
                    </div>
                </div>

                {/* Like Button (kept separate, so it doesn't shift) */}
                {hasSong && (
                    <div className="flex items-center space-x-1 sm:space-x-2 ml-2 sm:ml-3 flex-shrink-0">
                        <button
                            className="text-pink-400 hover:text-pink-300 transition-all duration-200 hover:scale-110 touch-manipulation p-2 rounded-xl hover:bg-pink-500/10"
                            onClick={() => onLikeToggle?.(currentSong, isCurrentTrackLiked)}
                        >
                            {isCurrentTrackLiked ? (
                                <MdFavorite size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
                            ) : (
                                <MdFavoriteBorder size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
                            )}
                        </button>
                        
                        {/* Add to Playlist Button - Only visible when signed in */}
                    </div>
                )}
            </div>

            {/* (2) Middle Controls + (3) Seek bar (hidden on mobile) */}
            <div className="hidden md:flex w-[40%] flex-col items-center justify-center relative z-10">
                {/* Controls row */}
                <div className="flex justify-center items-center space-x-4 lg:space-x-6">
                    {isLikedPanelActive && (
                        <button
                            className="hover:text-cyan-400 transition-all duration-200 hover:scale-110 p-2 rounded-xl hover:bg-cyan-500/10"
                            onClick={onPrevLikedSong}
                            disabled={!hasSong}
                        >
                            <MdSkipPrevious size={24} className="lg:w-7 lg:h-7" />
                        </button>
                    )}

                    <button
                        className={`bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 hover:scale-105 rounded-2xl p-2 lg:p-3 shadow-lg shadow-cyan-500/25 ${
                            !hasSong ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        onClick={handlePlayPause}
                        disabled={!hasSong}
                    >
                        {isPlaying ? <MdPause size={24} className="lg:w-7 lg:h-7" /> : <MdPlayArrow size={24} className="lg:w-7 lg:h-7" />}
                    </button>

                    {isLikedPanelActive && (
                        <button
                            className="hover:text-cyan-400 transition-all duration-200 hover:scale-110 p-2 rounded-xl hover:bg-cyan-500/10"
                            onClick={onNextLikedSong}
                            disabled={!hasSong}
                        >
                            <MdSkipNext size={24} className="lg:w-7 lg:h-7" />
                        </button>
                    )}

                </div>

                {/* Seek bar (desktop only) */}
                <div className="flex items-center space-x-3 lg:space-x-4 mt-3 w-full justify-center">
                    <span className="text-sm text-slate-400">{formatTime(playedSeconds)}</span>
                    <input
                        type="range"
                        className="flex-1 h-2 bg-slate-700 rounded-full cursor-pointer accent-cyan-500"
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
                <div className="hidden lg:block absolute top-4 right-4 z-10">
                    <button
                        className="text-cyan-400 hover:text-cyan-300 transition-all duration-200 hover:scale-110 bg-slate-900/70 backdrop-blur-sm rounded-2xl p-2 border border-slate-600/50 shadow-lg"
                        onClick={() => setShowVideo((prev) => !prev)}
                    >
                        {showVideo ? <LuPanelRightClose size={24} /> : <FaYoutube size={24} />}
                    </button>
                </div>
            )}

            {/* Full Page Mobile Player */}
            {showFullPagePlayer && (
                <motion.div 
                    className="md:hidden fixed bg-gradient-to-br from-slate-950 via-slate-900 to-black flex flex-col"
                    initial={{ y: "100%" }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "100%" }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    style={{ 
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        width: '100vw',
                        height: '100vh',
                        minHeight: '100vh',
                        maxHeight: '100vh',
                        zIndex: 99999,
                        overflow: 'hidden'
                    }}
                >
                    {/* Background Effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-purple-500/10" />
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `
                                linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
                            `,
                            backgroundSize: '30px 30px'
                        }} />
                    </div>

                    {/* Close Button */}
                    <div className="relative z-10 flex justify-end p-4">
                        <button
                            onClick={() => setShowFullPagePlayer(false)}
                            className="bg-slate-800/80 backdrop-blur-sm rounded-full p-4 text-slate-300 hover:text-white hover:bg-slate-700/80 transition-all duration-200 shadow-lg"
                        >
                            <MdClose size={28} />
                        </button>
                    </div>

                    {/* Song Image - Center */}
                    <div className="relative z-10 flex-1 flex items-center justify-center px-8 py-4">
                        <div className="relative">
                            <img
                                src={imageUrl}
                                alt={title}
                                className="w-80 h-80 object-cover rounded-3xl shadow-2xl shadow-cyan-500/30 border-2 border-cyan-500/40"
                            />
                            {/* Glow effect behind image */}
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-3xl blur-2xl -z-10 scale-125" />
                        </div>
                    </div>

                    {/* Song Info - Below Image */}
                    <div className="relative z-10 px-8 pb-6">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-white mb-3 leading-tight">
                                {title}
                            </h1>
                            <p className="text-xl text-slate-300">
                                {artist}
                            </p>
                        </div>

                        {/* Seek Bar */}
                        <div className="mb-6">
                            <input
                                type="range"
                                className="w-full h-3 bg-slate-700 rounded-full cursor-pointer accent-cyan-500"
                                min="0"
                                max={duration}
                                step="1"
                                value={playedSeconds}
                                onChange={handleSeek}
                                disabled={!hasSong}
                            />
                            <div className="flex justify-between mt-2 text-sm text-slate-400 font-mono">
                                <span>{formatTime(playedSeconds)}</span>
                                <span>{formatTime(duration)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Controls - Bottom */}
                    <div className="relative z-10 bg-slate-900/60 backdrop-blur-xl border-t border-cyan-500/40 p-8 pb-12">
                        <div className="flex justify-center items-center space-x-10">
                            {/* Like Button */}
                            <button
                                className="text-pink-400 hover:text-pink-300 transition-all duration-200 hover:scale-110 p-3 rounded-full hover:bg-pink-500/10"
                                onClick={() => onLikeToggle?.(currentSong, isCurrentTrackLiked)}
                            >
                                {isCurrentTrackLiked ? (
                                    <MdFavorite size={32} />
                                ) : (
                                    <MdFavoriteBorder size={32} />
                                )}
                            </button>

                            {/* Previous Button */}
                            {isLikedPanelActive && (
                                <button
                                    className="text-cyan-400 hover:text-cyan-300 transition-all duration-200 hover:scale-110 p-3 rounded-full hover:bg-cyan-500/10"
                                    onClick={onPrevLikedSong}
                                    disabled={!hasSong}
                                >
                                    <MdSkipPrevious size={36} />
                                </button>
                            )}

                            {/* Play/Pause Button */}
                            <button
                                className={`bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 hover:scale-105 rounded-full p-5 shadow-2xl shadow-cyan-500/40 ${
                                    !hasSong ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                onClick={handlePlayPause}
                                disabled={!hasSong}
                            >
                                {isPlaying ? <MdPause size={40} /> : <MdPlayArrow size={40} />}
                            </button>

                            {/* Next Button */}
                            {isLikedPanelActive && (
                                <button
                                    className="text-cyan-400 hover:text-cyan-300 transition-all duration-200 hover:scale-110 p-3 rounded-full hover:bg-cyan-500/10"
                                    onClick={onNextLikedSong}
                                    disabled={!hasSong}
                                >
                                    <MdSkipNext size={36} />
                                </button>
                            )}

                            {/* Video Toggle */}
                            <button
                                className="text-red-400 hover:text-red-300 transition-all duration-200 hover:scale-110 p-3 rounded-full hover:bg-red-500/10"
                                onClick={() => setShowVideo(!showVideo)}
                            >
                                <FaYoutube size={32} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Mobile Controls - Removed old implementation */}
            {false && (
                <motion.div 
                    className="md:hidden absolute -top-32 left-0 right-0 bg-gradient-to-r from-slate-950/95 via-slate-900/95 to-slate-950/95 backdrop-blur-2xl border-t border-cyan-500/30 p-4 rounded-t-2xl shadow-2xl z-50"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="flex justify-center items-center space-x-8 mb-4">
                        {isLikedPanelActive && (
                            <button
                                className="hover:text-cyan-400 transition-all duration-200 hover:scale-110 touch-manipulation p-3 rounded-xl hover:bg-cyan-500/10"
                                onClick={onPrevLikedSong}
                                disabled={!hasSong}
                            >
                                <MdSkipPrevious size={28} />
                            </button>
                        )}

                        <button
                            className={`bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 hover:scale-105 rounded-2xl p-4 shadow-lg shadow-cyan-500/25 touch-manipulation ${
                                !hasSong ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            onClick={handlePlayPause}
                            disabled={!hasSong}
                        >
                            {isPlaying ? <MdPause size={32} /> : <MdPlayArrow size={32} />}
                        </button>

                        {isLikedPanelActive && (
                            <button
                                className="hover:text-cyan-400 transition-all duration-200 hover:scale-110 touch-manipulation p-3 rounded-xl hover:bg-cyan-500/10"
                                onClick={onNextLikedSong}
                                disabled={!hasSong}
                            >
                                <MdSkipNext size={28} />
                            </button>
                        )}
                    </div>

                    {/* Enhanced Mobile Seek bar */}
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-slate-400 flex-shrink-0 font-mono">{formatTime(playedSeconds)}</span>
                        <input
                            type="range"
                            className="flex-1 h-3 bg-slate-700 rounded-full cursor-pointer accent-cyan-500"
                            min="0"
                            max={duration}
                            step="1"
                            value={playedSeconds}
                            onChange={handleSeek}
                            disabled={!hasSong}
                        />
                        <span className="text-sm text-slate-400 flex-shrink-0 font-mono">{formatTime(duration)}</span>
                    </div>
                </motion.div>
            )}

            {/* Mobile Expand/Collapse Button - Removed */}
            {false && (
            <div className="md:hidden absolute -top-16 left-1/2 transform -translate-x-1/2 z-40">
                <button
                    className="bg-gradient-to-r from-cyan-500/80 to-blue-500/80 hover:from-cyan-600/90 hover:to-blue-600/90 transition-all duration-200 hover:scale-110 rounded-full p-2 shadow-lg shadow-cyan-500/25 backdrop-blur-sm border border-cyan-400/30"
                    onClick={() => setShowFullPagePlayer(!showFullPagePlayer)}
                >
                    {showFullPagePlayer ? <MdExpandLess size={20} /> : <MdExpandMore size={20} />}
                </button>
            </div>
            )}

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
            hidden xl:flex fixed 2xl:bottom-20 bottom-[166px] right-0 z-50 transform transition-transform duration-500
            rounded-tl-2xl bg-black
            ${showVideo ? 'translate-x-0' : 'translate-x-full'}
            h-[600px] xl:h-[760px] 2xl:h-[1000px] w-[25%] xl:w-[30%] 2xl:w-[40%]
          `}
                >
                    <div className="relative w-full h-full overflow-hidden rounded-tl-2xl">
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
                    <div className="absolute w-full h-[50px] xl:h-[62px] 2xl:h-[7rem] bottom-0 z-10 p-2 bg-black/70 backdrop-blur-sm text-white overflow-hidden">
                
                        <h3 className="font-semibold text-sm xl:text-lg text-yellow-100 text-center truncate">
                            {title || 'Unknown Title'}
                        </h3>
                        <p className="text-xs xl:text-sm text-yellow-100 text-center truncate">
                            {artist || 'Unknown Artist'}
                        </p>
                    </div>
                </div>
            )}

        </div>
    )
}