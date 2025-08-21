import React, { useState } from "react";
import { motion } from "framer-motion";
import { MdPlaylistPlay, MdDelete, MdEdit, MdAdd, MdArrowBack, MdPlayArrow } from "react-icons/md";
import { deletePlaylist, updatePlaylist } from "../firebase";
import { toast } from "react-hot-toast";

export default function PlaylistsPanel({ playlists, setPlaylists, onSelectSong, onCreatePlaylist, refreshPlaylists }) {
    const [viewingPlaylist, setViewingPlaylist] = useState(null);
    const [editingPlaylist, setEditingPlaylist] = useState(null);
    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");

    const handleDeletePlaylist = async (playlistId, playlistName) => {
        if (!window.confirm(`Are you sure you want to delete "${playlistName}"?`)) {
            return;
        }

        try {
            await deletePlaylist(playlistId);
            setPlaylists(prev => prev.filter(p => p.id !== playlistId));
            
            // Refresh playlists to ensure consistency
            if (refreshPlaylists) {
                await refreshPlaylists();
            }
            
            toast.success("Playlist deleted successfully!", {
                position: "top-right",
            });
        } catch (error) {
            console.error("Error deleting playlist:", error);
            toast.error("Failed to delete playlist.", {
                position: "top-right",
            });
        }
    };

    const handleEditPlaylist = (playlist) => {
        setEditingPlaylist(playlist.id);
        setEditName(playlist.name);
        setEditDescription(playlist.description || "");
    };

    const handleSaveEdit = async () => {
        if (!editName.trim()) {
            toast.error("Please enter a playlist name.", {
                position: "top-right",
            });
            return;
        }

        try {
            await updatePlaylist(editingPlaylist, {
                name: editName.trim(),
                description: editDescription.trim(),
            });

            setPlaylists(prev => 
                prev.map(p => 
                    p.id === editingPlaylist 
                        ? { ...p, name: editName.trim(), description: editDescription.trim() }
                        : p
                )
            );

            // Refresh playlists to ensure consistency
            if (refreshPlaylists) {
                await refreshPlaylists();
            }

            toast.success("Playlist updated successfully!", {
                position: "top-right",
            });
            setEditingPlaylist(null);
        } catch (error) {
            console.error("Error updating playlist:", error);
            toast.error("Failed to update playlist.", {
                position: "top-right",
            });
        }
    };

    const handleCancelEdit = () => {
        setEditingPlaylist(null);
        setEditName("");
        setEditDescription("");
    };

    const handleViewPlaylist = (playlist) => {
        setViewingPlaylist(playlist);
    };

    const handleBackToPlaylists = () => {
        setViewingPlaylist(null);
    };

    const handleSongClick = (song, index) => {
        onSelectSong && onSelectSong(song);
    };

    // If viewing a specific playlist, show its songs
    if (viewingPlaylist) {
        return (
            <div className="p-3 sm:p-4 md:p-6">
                <div className="flex items-center mb-4">
                    <button
                        onClick={handleBackToPlaylists}
                        className="mr-4 p-2 hover:bg-slate-700/50 rounded-lg transition-all duration-200 hover:scale-110"
                    >
                        <MdArrowBack size={24} className="text-blue-400" />
                    </button>
                    <div>
                        <h2 className="text-xl sm:text-2xl font-semibold text-slate-100">{viewingPlaylist.name}</h2>
                        {viewingPlaylist.description && (
                            <p className="text-slate-400 text-sm">{viewingPlaylist.description}</p>
                        )}
                        <p className="text-slate-500 text-xs">
                            {viewingPlaylist.songs.length} song{viewingPlaylist.songs.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                </div>

                {viewingPlaylist.songs.length === 0 ? (
                    <div className="text-center py-12">
                        <MdPlaylistPlay size={64} className="mx-auto text-slate-600 mb-4" />
                        <p className="text-slate-400 text-lg">No songs in this playlist yet</p>
                        <p className="text-slate-500 text-sm">Add songs to this playlist from the music player or search results!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
                        {viewingPlaylist.songs.map((song, index) => (
                            <motion.div
                                key={`${song.videoId}-${index}`}
                                className="relative bg-gradient-to-b h-44 sm:h-48 md:h-52 from-slate-800/60 to-slate-900/80 backdrop-blur-sm border border-slate-700/30 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/20 cursor-pointer"
                                onClick={() => handleSongClick(song, index)}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
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
                                <div className="absolute top-2 right-2">
                                    <div className="bg-slate-900/60 backdrop-blur-sm rounded-full p-1.5 border border-slate-600/50">
                                        <MdPlayArrow size={16} className="text-blue-400" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    if (!playlists || playlists.length === 0) {
        return (
            <div className="p-3 sm:p-4 md:p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl sm:text-2xl font-semibold text-slate-100">Your Playlists</h2>
                    <button
                        onClick={onCreatePlaylist}
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 py-2 px-4 rounded-xl flex items-center space-x-2 transition-all duration-200 hover:scale-105 shadow-lg shadow-blue-500/25"
                    >
                        <MdAdd size={20} />
                        <span className="hidden sm:inline">Create Playlist</span>
                    </button>
                </div>
                <div className="text-center py-12">
                    <MdPlaylistPlay size={64} className="mx-auto text-slate-600 mb-4" />
                    <p className="text-slate-400 text-lg mb-4">No playlists yet</p>
                    <p className="text-slate-500 text-sm">Create your first playlist to organize your favorite songs!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-3 sm:p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-100">Your Playlists</h2>
                <button
                    onClick={onCreatePlaylist}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 py-2 px-4 rounded-xl flex items-center space-x-2 transition-all duration-200 hover:scale-105 shadow-lg shadow-blue-500/25"
                >
                    <MdAdd size={20} />
                    <span className="hidden sm:inline">Create Playlist</span>
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {playlists.map((playlist) => (
                    <motion.div
                        key={playlist.id}
                        className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/30 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/20"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {editingPlaylist === playlist.id ? (
                            <div className="p-4">
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="w-full p-2 mb-2 bg-slate-700/60 border border-slate-600/50 rounded-lg focus:outline-none focus:border-blue-500/50 transition-all duration-200 text-slate-100"
                                />
                                <textarea
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    placeholder="Description (optional)"
                                    className="w-full p-2 mb-3 bg-slate-700/60 border border-slate-600/50 rounded-lg focus:outline-none focus:border-blue-500/50 transition-all duration-200 text-slate-100 placeholder-slate-400 resize-none"
                                    rows="2"
                                />
                                <div className="flex space-x-2">
                                    <button
                                        onClick={handleSaveEdit}
                                        className="flex-1 bg-green-500 hover:bg-green-600 py-1 px-2 rounded-lg text-sm transition-all duration-200"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={handleCancelEdit}
                                        className="flex-1 bg-slate-600 hover:bg-slate-500 py-1 px-2 rounded-lg text-sm transition-all duration-200"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="h-32 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                                    <MdPlaylistPlay size={48} className="text-blue-400" />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-lg truncate text-slate-100 mb-1">{playlist.name}</h3>
                                    {playlist.description && (
                                        <p className="text-sm text-slate-400 mb-2 line-clamp-2">{playlist.description}</p>
                                    )}
                                    <p className="text-xs text-slate-500 mb-3">
                                        {playlist.songs.length} song{playlist.songs.length !== 1 ? 's' : ''}
                                    </p>
                                    
                                    <div className="flex items-center justify-between">
                                        <button
                                            onClick={() => handleViewPlaylist(playlist)}
                                            disabled={playlist.songs.length === 0}
                                            className="bg-blue-500 hover:bg-blue-600 py-1 px-3 rounded-lg text-sm transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            View Songs
                                        </button>
                                        
                                        <div className="flex space-x-1">
                                            <button
                                                onClick={() => handleEditPlaylist(playlist)}
                                                className="p-1 text-slate-400 hover:text-blue-400 transition-all duration-200 hover:scale-110"
                                            >
                                                <MdEdit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeletePlaylist(playlist.id, playlist.name)}
                                                className="p-1 text-slate-400 hover:text-red-400 transition-all duration-200 hover:scale-110"
                                            >
                                                <MdDelete size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}