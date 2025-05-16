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
        <nav className="navbar">
            <div className="navbar-left">
                <div className="left-nav-container">
                    <span> Welcome, {localStorage.getItem('UserName')}</span>
                    <span className='home' onClick={() => navigate('/')}><i class="bi bi-house-door-fill" style={{marginRight:'3px'}}></i>Home</span>
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
    );
};

export default Navbar;
