import React, { useEffect, useState } from 'react';
import './Navbar.css';
import { useNavigate } from 'react-router';
import DeleteConfirmDialog from './DeleteConfirmDialog';

const Navbar = () => {
    const navigate = useNavigate();
    const [isLogoutClicked, setIsLogoutClicked] = useState(false);
    const [isOnline, setIsOnline] = useState(navigator.onLine)

    useEffect(() => {
        window.addEventListener('offline', () => setIsOnline(false))
        window.addEventListener('online', () => setIsOnline(true))

        return () => {
            window.removeEventListener('offline', () => setIsOnline(false))
            window.removeEventListener('online', () => setIsOnline(true))
        }
    }, [])

    function handleLogout() {
        document.cookie = "userToken=";
        window.location.reload();
    }

    return (
        <>
            {isLogoutClicked &&
                <DeleteConfirmDialog
                    isOpen={isLogoutClicked}
                    onCancel={() => setIsLogoutClicked(false)}
                    propmt={'Are you sure? You want to logout.'}
                    onConfirm={handleLogout}
                    titleTxt={'Logout Confirmation'}
                    cancelTxt={'Cancel'}
                    doneTxt={'Logout'} />}

            <div className="nav-space"></div>
            <nav className="navbar">
                <div className="navbar-left">
                    <div className="left-nav-container">
                        <span className='welcome-text'> Welcome, {localStorage.getItem('UserName')}</span>
                        <span className='home' onClick={() => navigate('/')} style={{ margin: 'auto 12px' }}>
                            <i className="bi bi-house-door-fill" style={{ marginRight: '3px' }}></i>
                            Home</span>
                    </div>
                </div>

                <div className="navbar-center">
                    <button className="show-btn center" onClick={() => navigate('/allProducts')}>
                        Show All Product
                    </button>
                </div>

                <div className="navbar-right">
                    <button className="logout-btn" onClick={() => setIsLogoutClicked(true)}>
                        Logout
                    </button>
                </div>
            </nav>
            {!isOnline && <p className='offline-msg'>Can't connect to network !</p>}
            <div className="nav-gap" style={{top: !isOnline ? '76px' : '51px'}}></div>
        </>
    );
};

export default Navbar;
