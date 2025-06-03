// Navbar.jsx
import React, { useEffect, useState } from 'react';
import './Navbar.css';
import { useNavigate } from 'react-router';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import { FaBoxOpen } from "react-icons/fa";
import { FiLogOut } from 'react-icons/fi';

const Navbar = () => {
    const navigate = useNavigate();
    const [isLogoutClicked, setIsLogoutClicked] = useState(false);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOffline = () => setIsOnline(false);
        const handleOnline = () => setIsOnline(true);
        window.addEventListener('offline', handleOffline);
        window.addEventListener('online', handleOnline);
        return () => {
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('online', handleOnline);
        };
    }, []);

    const handleLogout = () => {
        document.cookie = "userToken=";
        window.location.reload();
    };

    return (
        <>
            {isLogoutClicked && (
                <DeleteConfirmDialog
                    isOpen={isLogoutClicked}
                    onCancel={() => setIsLogoutClicked(false)}
                    propmt="Are you sure? You want to logout."
                    onConfirm={handleLogout}
                    titleTxt="Confirm Logout"
                    cancelTxt="Cancel"
                    doneTxt="Logout"
                />
            )}

            <nav className="navbar">
                <div className="navbar-left">
                    {/* <span className="navbar-logo">🛍️ Admin Panel</span> */}
                    <span className="navbar-welcome navbar-logo">Welcome, {localStorage.getItem('UserName')}</span>
                    <div className="navbar-links">
                        <span className="nav-link" onClick={() => navigate('/')}>
                            <i className="bi bi-house-door-fill"></i> Home
                        </span>
                        <span className="nav-link" onClick={() => navigate('/allProducts')}>
                            <FaBoxOpen style={{marginTop: '0px', fontSize:'1.1rem'}}/> All Products
                        </span>
                    </div>
                </div>

                <div className="navbar-right">
                    <button className="logout-button" onClick={() => setIsLogoutClicked(true)}>
                       <FiLogOut/> Logout
                    </button>
                </div>
            </nav>

            {!isOnline && <div className="offline-banner">⚠️ No Internet Connection</div>}
        </>
    );
};

export default Navbar;
