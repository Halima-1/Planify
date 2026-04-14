import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { BiCalendarEvent, BiLogOut, BiUserCircle, BiMenu, BiX, BiSun, BiMoon } from 'react-icons/bi';
import './Header.scss';

function Header() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
            setIsMenuOpen(false);
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <>
            <div 
                className={`nav-backdrop ${isMenuOpen ? 'active' : ''}`} 
                onClick={() => setIsMenuOpen(false)}
            />
            
            <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
                <div className="header-container">
                    <Link to="/" className="logo">
                        <BiCalendarEvent className="logo-icon" />
                        <span className="gradient-text">Planify</span>
                    </Link>

                    {user ? (
                        <>
                            <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
                                <NavLink to="/" end onClick={() => setIsMenuOpen(false)}>Dashboard</NavLink>
                                <div className="mobile-only">
                                    <button onClick={toggleTheme} className="theme-toggle-mobile">
                                        {theme === 'light' ? <BiMoon /> : <BiSun />} {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                                    </button>
                                    <button onClick={handleLogout} className="logout-btn-mobile">
                                        <BiLogOut /> Log Out
                                    </button>
                                </div>
                            </nav>

                            <div className="user-section">
                                <button onClick={toggleTheme} className="theme-toggle-desktop" title="Toggle Theme">
                                    {theme === 'light' ? <BiMoon /> : <BiSun />}
                                </button>
                                
                                <div className="user-profile">
                                    <BiUserCircle className="user-icon" />
                                    <span className="user-email">{user.email?.split('@')[0]}</span>
                                </div>

                                <button onClick={handleLogout} className="logout-btn desktop-only" title="Log Out">
                                    <BiLogOut />
                                </button>

                                <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                    {isMenuOpen ? <BiX /> : <BiMenu />}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="auth-links">
                            <Link to="/login" className="login-link">Sign In</Link>
                            <Link to="/register" className="btn-primary">Get Started</Link>
                        </div>
                    )}
                </div>
            </header>
        </>
    );
}

export default Header;
