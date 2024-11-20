import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>MediScanner</div>
      <ul style={styles.navLinks}>
        <li style={styles.navItem}>
          <Link to="/upload" style={styles.navLink}>Medication Scan</Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/saved" style={styles.navLink}>Saved Medications</Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/calendar" style={styles.navLink}>Calendar</Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/reminders" style={styles.navLink}>My Reminders</Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/me" style={styles.navLink}>My Profile</Link>
        </li>
      </ul>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '30px',
    backgroundColor: '#f7a1e9',
    color: 'white',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  navLinks: {
    listStyleType: 'none',
    display: 'flex',
    margin: 0,
    padding: 0,
  },
  navItem: {
    marginLeft: '50px',
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '20px',
  },
};

export default Navbar;
