import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/LoginSignup.css';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Demo login behavior — replace with real auth later
    console.log('Login attempt', { username });
    alert('Logged in (demo)');
  };

  return (
    <main className="login-page">
      <h1 className="brand">Cloud Control</h1>

      <form className="login-form" onSubmit={onSubmit} aria-label="Login form">
        <input
          className="pill-input"
          type="text"
          placeholder="User Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
        />

        <input
          className="pill-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        <button className="pill-button" type="submit">Login</button>

        <button
          type="button"
          className="pill-button secondary"
          onClick={() => navigate('/loginsignup')}
          aria-label="Go to register"
        >
          Register
        </button>

        <button
          type="button"
          className="pill-button"
          onClick={() => alert('Forgot password flow (demo)')}
        >
          Forgot Password
        </button>
      </form>
    </main>
  );
};

export default LoginPage;

