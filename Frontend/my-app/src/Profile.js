// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { signOut } from 'firebase/auth';
// import { auth } from './Firebase-Configurations/firebaseConfig';  

// const UserProfile = () => {
//   const [user, setUser] = useState(null);  
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Check for the authenticated user
//     const unsubscribe = auth.onAuthStateChanged((currentUser) => {
//       if (currentUser) {
//         setUser({
//           name: currentUser.displayName ,
//           email: currentUser.email,
//         });
//       } else {
//         setUser(null);  // user is logged out
//         navigate('/login');  // redirect to login for now
//       }
//     });

//     return () => unsubscribe(); // cleanup
//   }, [navigate]);

//   const handleLogout = () => {
//     signOut(auth)
//       .then(() => {
//         console.log('Logged out successfully');
//         navigate('/login');  // redirect to login after logging out
//       })
//       .catch((error) => {
//         console.error('Error logging out: ', error);
//       });
//   };

//   if (!user) {
//     return <div>Loading...</div>; //this part isn't really needed
//   }

//   return (
//     <div style={styles.container}>
//       <div style={styles.section}>
//         <h1 style={styles.name}>{user.name}</h1>
//         <p style={styles.info}>Email: {user.email}</p>
//         <br />
//         <div style={styles.buttons}>
//           <button style={styles.buttonLogout} onClick={handleLogout}>Log Out</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     minHeight: '100vh',
//     backgroundColor: '#f4f4f4',
//   },
//   section: {
//     width: '300px',
//     textAlign: 'center',
//     padding: '20px',
//     backgroundColor: 'white',
//     borderRadius: '10px',
//     boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//   },
//   name: {
//     fontSize: '24px',
//     color: '#333',
//     marginBottom: '10px',
//   },
//   info: {
//     fontSize: '16px',
//     color: '#555',
//     marginBottom: '5px',
//   },
//   buttons: {
//     display: 'flex',
//     justifyContent: 'space-between',
//   },
//   button: {
//     padding: '10px 15px',
//     backgroundColor: '#007BFF',
//     color: 'white',
//     border: 'none',
//     borderRadius: '5px',
//     cursor: 'pointer',
//     flex: 1,
//     margin: '0 5px',
//   },
//   buttonLogout: {
//     padding: '10px 15px',
//     backgroundColor: '#DC3545',
//     color: 'white',
//     border: 'none',
//     borderRadius: '5px',
//     cursor: 'pointer',
//     flex: 1,
//     margin: '0 5px',
//   }
// };

// export default UserProfile;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from './Firebase-Configurations/firebaseConfig';
import { FiUser, FiMail } from 'react-icons/fi';

// Consistent color scheme
const colors = {
  primary: '#848f6b',
  secondary: '#99311c',
  background: '#f8f9fa',
  cardBackground: '#ffffff',
  text: '#333333',
  lightText: '#6c757d',
  border: '#e9ecef',
  hover: '#f1f3f5',
};

const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    //minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: colors.background,
    padding: '100px 0px 0px 0px',
  },
  profileCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
    border: `1px solid ${colors.border}`,
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: colors.primary,
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0 auto 20px',
    fontSize: '32px',
  },
  name: {
    color: colors.text,
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '10px',
  },
  infoContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '8px',
    color: colors.lightText,
  },
  infoIcon: {
    color: colors.primary,
  },
  logoutButton: {
    backgroundColor: colors.secondary,
    color: 'white',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '30px',
    width: '100%',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#7a2618',
    },
  },
  loadingText: {
    textAlign: 'center',
    color: colors.text,
  },
};

const UserProfile = () => {
  const [user, setUser] = useState(null);  
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setIsLoading(false);
      if (currentUser) {
        setUser({
          name: currentUser.displayName || currentUser.email.split('@')[0],
          email: currentUser.email,
        });
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out: ', error);
      alert('Logout failed. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingText}>Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingText}>No user data available</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.profileCard}>
        <div style={styles.avatar}>
          <FiUser size={32} />
        </div>
        
        <h1 style={styles.name}>{user.name}</h1>
        
        <div style={styles.infoContainer}>
          <FiMail style={styles.infoIcon} />
          <span>{user.email}</span>
        </div>

        <button 
          onClick={handleLogout} 
          style={styles.logoutButton}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default UserProfile;