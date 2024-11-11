import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import CompanyLogo from '../assets/CompanyLogo.svg';
import SideMenu from '../assets/Sidemenu.svg';
import User from '../assets/User.svg';
import '../styles/Header.css';

const Header: React.FC = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleMenuClick = () => {
        setShowDropdown((prev) => !prev);
    };

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header>
            <div className="header-container">
                {/* Side menu */}
                <div className="side-menu" onClick={handleMenuClick}>
                    <div className="menu-icon">
                        <img src={SideMenu} alt="Menu" />
                    </div>
                    {showDropdown && (
                        <div className="dropdown-menu" ref={dropdownRef}>
                            <ul>
                                <li onClick={() => navigate('/')}>Dashboard</li>
                                <li onClick={() => navigate('/clientes')}>Clientes</li>
                                <li onClick={() => navigate('/oportunidades')}>Oportunidades</li>
                                <li onClick={() => navigate('/seguimiento')}>Seguimiento</li>
                            </ul>
                        </div>
                    )}
                </div>

                {/* Logo */}
                <div className="logo">
                    <Link to="/">
                    <img src={CompanyLogo} alt="Company Logo" />
                    </Link>
                </div>

                {/* Account */}
                <div className="account-cart">
                    <a className="account-link">
                        <img src={User} alt="My Account" />
                        <span>My Account</span>
                    </a>
                </div>
            </div>
        </header>
    );
};

export default Header;
