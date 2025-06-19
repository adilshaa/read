import React from 'react';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';

const Header = () => {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#333', color: 'white' }}>
      <div className="logo">
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem' }}>Islamic Quiz App</Link>
      </div>
      <nav>
        <Link to="/" style={{ color: 'white', marginRight: '1rem' }}>Home</Link>
        <SignedIn>
          <Link to="/admin" style={{ color: 'white', marginRight: '1rem' }}>Admin</Link>
        </SignedIn>
      </nav>
      <div>
        <SignedOut>
          <Link to="/sign-in" style={{ color: 'white', marginRight: '0.5rem' }}>Sign In</Link>
          <Link to="/sign-up" style={{ color: 'white' }}>Sign Up</Link>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </header>
  );
};

export default Header;
