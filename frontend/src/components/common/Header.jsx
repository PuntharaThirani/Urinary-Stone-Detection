import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import NotificationBell from './NotificationBell';
import logo from '../../assets/images/logo-removebg-preview.png';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-blue-500/30 bg-blue-600 shadow-sm">
      <div className="mx-auto flex h-[75px] w-full max-w-7xl items-center justify-between px-4 md:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="UroScan AI Logo"
            className="h-20 w-auto object-contain"
          />
        </Link>

        <div className="flex items-center gap-4">
          <Navbar />
          <NotificationBell />
        </div>
      </div>
    </header>
  );
};

export default Header;
