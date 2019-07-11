import React from 'react';
import { Link } from '@reach/router';
import { useAuth } from '../context/auth';
import analyticsIcon from '../images/analytics-icon.svg';
import logo from '../images/property-pulse-logo.svg';
import settingsIcon from '../images/settings-icon.svg';
import './layout.css';

function Layout({ children }) {
  const { logout } = useAuth();
  return (
    <div className="app">
      <header className="header">
        <div className="header__inner">
          <img className="logo" src={logo} alt="Property Pulse" />
          <button className="button button__hollow" onClick={logout}>
            Sign out
          </button>
        </div>
      </header>
      <div className="main">
        <div className="menu">
          <Link to="/dashboard" className="menu__link">
            <div className="menu__item">
              <img className="menu__item-icon" src={analyticsIcon} alt="Analytics Icon" />
              Analytics
            </div>
          </Link>
          <Link to="/settings" className="menu__link">
            <div className="menu__item">
              <img className="menu__item-icon" src={settingsIcon} alt="Settings Icon" />
              Settings
            </div>
          </Link>
        </div>
        <div className="content">{children}</div>
      </div>
    </div>
  );
}

export default Layout;
