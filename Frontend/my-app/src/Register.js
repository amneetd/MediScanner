import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'react-phone-number-input/style.css'; 
import PhoneInput from 'react-phone-number-input';  
import './index.css';
import { registerUser } from "./Firebase-Configurations/firestore.js"

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const togglePasswordVisibility2 = () => setShowPassword2(!showPassword2);

  const handleRegister = () => { //validate
    if (!username || !email || !phoneNumber || !password || !confirmPassword) {
      setErrorMessage('Please fill out all fields.');
      return;
    }

    // password match
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    // route if valid
    setErrorMessage('');
    registerUser(username, email, phoneNumber, password);
    navigate('/upload');
  };

  return (
    <div className="mid-container">
      <header>
        <h1>MediScanner Register</h1>
      </header>
      <div className="login-box">
        <div className="login-back2">
          <input 
            type="text" 
            name="username" 
            placeholder="Create a username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
          />
          <input 
            type="text" 
            name="email" 
            placeholder="Enter your email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <PhoneInput
            international
            defaultCountry="CA"
            value={phoneNumber}
            onChange={setPhoneNumber}
            placeholder="Enter your phone number"
          />
          <input 
            type={showPassword ? 'text' : 'password'} 
            name="password" 
            placeholder="Create your password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <i 
            className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} eye-icon`} 
            onClick={togglePasswordVisibility} 
          />
          <input 
            type={showPassword2 ? 'text' : 'password'} 
            name="confirmPassword" 
            placeholder="Confirm your password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
          />
          <i 
            className={`fas ${showPassword2 ? 'fa-eye-slash' : 'fa-eye'} eye-icon2`} 
            onClick={togglePasswordVisibility2} 
          />
          {/* Display error message if any */}
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <button className="registerButton" type="submit" onClick={handleRegister}>
            Register
          </button>
        </div>
      </div>
      <footer>
        <p>2024 MediScanner University of Calgary ENSF Capstone</p>
      </footer>
    </div>
  );
};

export default Register;
