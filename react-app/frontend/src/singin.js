import React, { useState } from 'react';
import { auth, createUserWithEmailAndPassword } from './backend/firebase-config'; // Update the import path based on firebase.js location
import './login.css';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User signed up:', userCredential.user);
      alert('Sign-up successful!');
    } catch (error) {
      console.error('Sign-up error:', error.message);
      alert('Error during sign-up: ' + error.message);
    }
  };

  return (
    <div className="app">
      <div className="login-form">
        <h2>Регистрация</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="login-button" onClick={handleSignUp}>
          Зареєструватися
        </button>
      </div>
    </div>
  );
}

export default SignUp;
