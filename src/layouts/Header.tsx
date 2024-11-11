import React from 'react';
import { Link } from 'react-router-dom'; // Import the Link component from react-router-dom
import CompanyLogo from '../assets/CompanyLogo.svg';
import SideMenu from '../assets/Sidemenu.svg';
import User from '../assets/User.svg';
import '../styles/Header.css';


const Header: React.FC = () => {
  return (
    <header>
      <div className="header-container">
        {/* Sidemenu */}
        <div className="side-menu">
          <div className="menu-icon">
            <img src={SideMenu} alt="Menu" />
          </div>
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