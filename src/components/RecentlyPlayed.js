// src/components/RecentlyPlayed.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { FaTrash } from 'react-icons/fa';
import { MdPlaylistAdd } from 'react-icons/md';

export default function RecentlyPlayed({ songs, onSelectSong, onDeleteSong, user, onAddToPlaylist }) {
    if (!songs.length) {
        return null; 
    }

    return (
        <div className="mt-6 p-3 sm:p-4 md:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-slate-100">Recently Played</h2>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
                {songs.map((song) => (
                    <div
                        key={song.videoId}
                        className="relative bg-gradient-to-b h-44 sm:h-48 md:h-52 from-slate-800/60 to-slate-900/80 backdrop-blur-sm border border-slate-700/30 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/20"
                    >
                        <div
                            className="cursor-pointer h-full"
                            onClick={() => onSelectSong(song)} // Set as current song
                        >
                            <img
                                src={song.imageUrl || 'https://via.placeholder.com/150'}
                                alt={song.title}
                                className="w-full h-28 sm:h-32 md:h-36 object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 bg-slate-900/80 backdrop-blur-sm">
                                <p className="text-xs sm:text-sm font-semibold truncate text-slate-100">{song.title}</p>
                                <p className="text-xs text-slate-400 truncate">{song.artist}</p>
                            </div>
                        </div>
                        
                        {/* Action buttons */}
                        <div className="absolute bottom-11 sm:bottom-12 right-1 sm:right-2 flex space-x-1">
                            {/* Add to Playlist Button - Only visible when signed in */}
                            {user && onAddToPlaylist && (
                                <button
                                    className="text-cyan-400 bg-slate-900/60 backdrop-blur-sm rounded-full p-1 sm:p-1.5 hover:bg-slate-800/80 hover:text-cyan-300 transition-all duration-200 hover:scale-110 border border-slate-600/50"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onAddToPlaylist(song);
                                    }}
                                    aria-label="Add to Playlist"
                                >
                                    <MdPlaylistAdd size={14} />
                                </button>
                            )}
                            
                            {/* Delete Button */}
                            <button
                                className="text-red-400 bg-slate-900/60 backdrop-blur-sm rounded-full p-1 sm:p-1.5 hover:bg-slate-800/80 hover:text-red-300 transition-all duration-200 hover:scale-110 border border-slate-600/50"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    console.log(`Attempting to delete song with videoId: ${song.videoId}`);
                                    onDeleteSong(song.videoId);
                                }}
                                aria-label="Delete Song"
                            >
                                <FaTrash size={12} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

RecentlyPlayed.propTypes = {
    songs: PropTypes.arrayOf(
        PropTypes.shape({
            videoId: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            artist: PropTypes.string.isRequired,
            imageUrl: PropTypes.string,
        })
    ).isRequired,
    onSelectSong: PropTypes.func.isRequired,
    onDeleteSong: PropTypes.func.isRequired, 
    user: PropTypes.object,
    onAddToPlaylist: PropTypes.func,
};
