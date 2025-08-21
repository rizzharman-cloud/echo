// LikedSongs.js
import React from 'react'
import { MdArrowUpward, MdArrowDownward, MdPlaylistAdd } from 'react-icons/md'

export default function LikedSongs({ songs, onSelectSong, onReorder, user, onAddToPlaylist }) {
    if (!songs || songs.length === 0) {
        return (
            <div className="p-4">
                <p className="text-lg font-bold">No liked songs yet.</p>
            </div>
        )
    }

    return (
        <div className="p-3 sm:p-4 md:p-6">
            <h2 className="text-xl sm:text-2xl mb-4 font-bold text-slate-100">Your Liked Songs</h2>
            <ul className="space-y-3 sm:space-y-4">
                {songs.map((song, index) => (
                    <li
                        key={song.videoId}
                        className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/30 p-3 sm:p-4 rounded-xl flex items-center justify-between min-h-16 hover:bg-slate-800/60 transition-all duration-200 hover:scale-[1.02] shadow-lg"
                    >
                        {/* Click song to select and play */}
                        <div
                            className="cursor-pointer overflow-hidden flex-1 min-w-0 mr-3"
                            onClick={() => onSelectSong(song)}
                        >
                            {/* Truncate the song title */}
                            <div className="font-semibold text-base sm:text-lg truncate text-slate-100">{song.title}</div>
                            <div className="text-sm text-slate-400 truncate">{song.artist}</div>
                        </div>

                        {/* Up/Down arrows for reordering */}
                        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                            {/* Add to Playlist Button - Only visible when signed in */}
                            {user && onAddToPlaylist && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onAddToPlaylist(song);
                                    }}
                                    className="p-1 rounded hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-300 transition-all duration-200 hover:scale-110 touch-manipulation"
                                    aria-label="Add to Playlist"
                                >
                                    <MdPlaylistAdd size={18} className="sm:w-5 sm:h-5"/>
                                </button>
                            )}
                            
                            {/* Move Up */}
                            <button
                                onClick={() => onReorder(index, index - 1)}
                                disabled={index === 0}
                                className={`p-1 rounded ${
                                    index === 0
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 transition-all duration-200 hover:scale-110 touch-manipulation"
                                }`}
                            >
                                <MdArrowUpward size={18} className="sm:w-5 sm:h-5"/>
                            </button>

                            {/* Move Down */}
                            <button
                                onClick={() => onReorder(index, index + 1)}
                                disabled={index === songs.length - 1}
                                className={`p-1 rounded ${
                                    index === songs.length - 1
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 transition-all duration-200 hover:scale-110 touch-manipulation"
                                }`}
                            >
                                <MdArrowDownward size={18} className="sm:w-5 sm:h-5"/>
                            </button>
                        </div>
                    </li>

                ))}
            </ul>
        </div>
    )
}
