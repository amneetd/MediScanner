import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const NewNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <nav style={styles.navbar}>
        <button style={styles.hamburger} onClick={toggleMenu}>
          ☰
        </button>
        <div style={styles.logo}>MediScanner</div>
      </nav>
      <div style={{ ...styles.sideMenu, transform: menuOpen ? 'translateX(0)' : 'translateX(-100%)' }}>
        <button style={styles.closeHamburger} onClick={toggleMenu}>
          ☰
        </button>
        <ul style={styles.navLinks}>
          <li style={styles.navItem}>
            <Link to="/upload" style={styles.navLink} onClick={toggleMenu}>Medication Scan</Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/saved" style={styles.navLink} onClick={toggleMenu}>Saved Medications</Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/calendar" style={styles.navLink} onClick={toggleMenu}>Calendar</Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/reminders" style={styles.navLink} onClick={toggleMenu}>My Reminders</Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/me" style={styles.navLink} onClick={toggleMenu}>My Profile</Link>
          </li>
        </ul>
      </div>
    </>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#6b82ff',
    color: 'white',
    position: 'relative',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginLeft: 'auto',
  },
  hamburger: {
    fontSize: '24px',
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
  },
  closeHamburger: {
    fontSize: '24px',
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    position: 'absolute',
    top: '20px',
    left: '20px',
  },
  sideMenu: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '250px',
    height: '100%',
    backgroundColor: '#6b83ff',
    color: 'white',
    padding: '20px',
    boxShadow: '2px 0 5px rgba(0, 0, 0, 0.5)',
    transition: 'transform 0.3s ease',
    zIndex: 1000,
  },
  navLinks: {
    listStyleType: 'none',
    padding: '60px 0 0', // Add padding to push links below the hamburger icon
  },
  navItem: {
    marginBottom: '20px',
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '18px',
  },
};

export default NewNavbar;
