/**
 * fix the functionality
 */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from './Firebase-Configurations/firebaseConfig';  

const UserProfile = () => {
  const [user, setUser] = useState(null);  
  const navigate = useNavigate();

  useEffect(() => {
    // Check for the authenticated user
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser({
          name: currentUser.displayName ,
          email: currentUser.email,
        });
      } else {
        setUser(null);  // user is logged out
        navigate('/login');  // redirect to login for now
      }
    });

    return () => unsubscribe(); // cleanup
  }, [navigate]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log('Logged out successfully');
        navigate('/login');  // redirect to login after logging out
      })
      .catch((error) => {
        console.error('Error logging out: ', error);
      });
  };

  if (!user) {
    return <div>Loading...</div>; //this part isn't really needed
  }

  return (
    <div style={styles.container}>
      <div style={styles.section}>
        <h1 style={styles.name}>{user.name}</h1>
        <p style={styles.info}>Email: {user.email}</p>
        <br />
        <div style={styles.buttons}>
          <button style={styles.buttonLogout} onClick={handleLogout}>Log Out</button>
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
