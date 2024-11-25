/**
 * this page is not functional --> add functionality to edit profile, log out, etc.
 */

import React from 'react';

const UserProfile = () => {
  const exUser = {
    name: "x",
    email: "x",
    phone: "xxx-"
  };

  return (
    <div style={styles.container}>
    <div style={styles.section}>
      <h1 style={styles.name}>{exUser.name}</h1>
      <p style={styles.info}>Email: {exUser.email}</p>
      <p style={styles.info}>Phone: {exUser.phone}</p>
      <br/>
      <div style={styles.buttons}>
          <button style={styles.button}>Edit Profile</button>
          <button style={styles.buttonLogout}>Log Out</button>
        </div>
    </div>
  </div>
);
};

const styles = {
container: {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: '#f4f4f4',
},
section: {
  width: '300px',
  textAlign: 'center',
  padding: '20px',
  backgroundColor: 'white',
  borderRadius: '10px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
},
name: {
  fontSize: '24px',
  color: '#333',
  marginBottom: '10px',
},
info: {
  fontSize: '16px',
  color: '#555',
  marginBottom: '5px',
},
buttons: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  button: {
    padding: '10px 15px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    flex: 1,
    margin: '0 5px',
  },
  buttonLogout: {
    padding: '10px 15px',
    backgroundColor: '#DC3545',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    flex: 1,
    margin: '0 5px',
  }
};

export default UserProfile;
