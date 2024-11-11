import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import CompanyLogo from '../assets/CompanyLogo.svg';
import SideMenu from '../assets/Sidemenu.svg';
import User from '../assets/User.svg';
import '../styles/Header.css';

const Header: React.FC = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <header>
      <div className="header-container">
        <div className="side-menu" onClick={toggleDropdown}>
          <div className="menu-icon">
            <img src={SideMenu} alt="Menu" />
          </div>
          {dropdownVisible && (
            <div className="dropdown-menu">
              <ul>
                <li onClick={() => navigate('/dashboard')}>Dashboard</li>
                <li onClick={() => navigate('/')}>Clientes</li>
                <li onClick={() => navigate('/oportunidades')}>Oportunidades</li>
                <li onClick={() => navigate('/seguimiento')}>Seguimiento</li>
              </ul>
            </div>
          )}
        </div>

        <div className="logo">
          <Link to="/">
            <img src={CompanyLogo} alt="Company Logo" />
          </Link>
        </div>

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
