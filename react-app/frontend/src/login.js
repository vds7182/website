import React, { useState } from 'react';
import { auth, signInWithEmailAndPassword } from './backend/firebase-config'; // Make sure the path matches your firebase.js file
import './login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in:', userCredential.user);
      alert('Login successful!');
    } catch (error) {
      console.error('Login failed:', error.message);
      alert('Error logging in: ' + error.message);
    }
  };

  return (
    <div className="app">
      <div className="login-form">
        <h2>Вход</h2>
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
        <button className="login-button" onClick={handleLogin}>
          Увійти
        </button>
      </div>
    </div>
  );
}

export default Login;
