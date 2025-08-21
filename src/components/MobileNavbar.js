// src/components/MobileNavbar.jsx
import React from 'react';
import { MdHome, MdPerson, MdFavorite, MdLogin, MdPlaylistPlay } from 'react-icons/md';
import { CiLogout } from 'react-icons/ci';
import PropTypes from 'prop-types';

export default function MobileNavbar({ activePanel,
                                         setActivePanel,
                                         user,          
                                         onSignIn,      
                                         onSignOut,     
                                     }) {
    // Helper function to toggle the panel
    const togglePanel = (panel) =>
        setActivePanel(activePanel === panel ? null : panel);

    return (
        <nav className="h-16 bg-slate-950/90 backdrop-blur-xl border-t border-slate-700/50 text-white flex justify-around items-center md:hidden">
            {/* Home Button */}
            <button
                className={`hover:text-blue-400 transition-all duration-200 hover:scale-110 ${
                    activePanel === 'home' ? 'text-blue-400 bg-blue-500/20 rounded-lg p-2' : 'p-2'
                }`}
                onClick={() => togglePanel('home')}
                aria-label="Home"
            >
                <MdHome size={24} />
            </button>

            {/* Liked Songs Button */}
            <button
                className={`hover:text-blue-400 transition-all duration-200 hover:scale-110 ${
                    activePanel === 'liked' ? 'text-blue-400 bg-blue-500/20 rounded-lg p-2' : 'p-2'
                }`}
                onClick={() => togglePanel('liked')}
                aria-label="Liked Songs"
            >
                <MdFavorite size={24} />
            </button>

            {/* Playlists Button - Only visible when signed in */}
            {user && (
                <button
                    className={`hover:text-blue-400 transition-all duration-200 hover:scale-110 ${
                        activePanel === 'playlists' ? 'text-blue-400 bg-blue-500/20 rounded-lg p-2' : 'p-2'
                    }`}
                    onClick={() => togglePanel('playlists')}
                    aria-label="Playlists"
                >
                    <MdPlaylistPlay size={24} />
                </button>
            )}

            {/* Profile Button */}
            <button
                className={`hover:text-blue-400 transition-all duration-200 hover:scale-110 ${
                    activePanel === 'profile' ? 'text-blue-400 bg-blue-500/20 rounded-lg p-2' : 'p-2'
                }`}
                onClick={() => togglePanel('profile')}
                aria-label="Profile"
            >
                <MdPerson size={24} />
            </button>

            {/* Sign-In / Sign-Out Button */}
            <button
                className="hover:text-blue-400 transition-all duration-200 hover:scale-110 p-2"
                onClick={user ? onSignOut : onSignIn}
                aria-label={user ? "Sign Out" : "Sign In"}
            >
                {user ? <CiLogout size={24} /> : <MdLogin size={24} />}
            </button>
        </nav>
    );
}

MobileNavbar.propTypes = {
    activePanel: PropTypes.string.isRequired,
    setActivePanel: PropTypes.func.isRequired,
    user: PropTypes.object,               
    onSignIn: PropTypes.func.isRequired,  
    onSignOut: PropTypes.func.isRequired, 
};
