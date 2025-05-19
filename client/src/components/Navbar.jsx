import React from 'react';
import './Navbar.css';
import { useNavigate } from 'react-router';

const Navbar = () => {
    const navigate = useNavigate();

    function handleLogout() {
        document.cookie = "userToken=";
        window.location.reload();
    }

    return (
        <>
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
                    <button className="show-btn" onClick={() => navigate('/allProducts')}>
                        Show All Product
                    </button>
                </div>

                <div className="navbar-right">
                    <button className="logout-btn" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </nav>
            <div className="nav-gap"></div>
        </>
    );
};

export default Navbar;
