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
                Welcome, {localStorage.getItem('UserName')}
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
