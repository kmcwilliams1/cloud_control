import React, { useState } from 'react';
import '../CSS/LoginSignup.css';

const LoginSignup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [lastPassword, setLastPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // For now just log and show a tiny confirmation — wire up real auth later
    // Keep message minimal to avoid leaking values in prod
    console.log('Submit', { email });
    alert('Form submitted (demo)');
  };

  return (
    <main className="login-page">
      <h1 className="brand">Cloud Control</h1>

      <form className="login-form" onSubmit={onSubmit} aria-label="Login or signup form">
        <input
          className="pill-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <input
          className="pill-input"
          type="password"
          placeholder="Last Known Password"
          value={lastPassword}
          onChange={(e) => setLastPassword(e.target.value)}
          autoComplete="current-password"
        />

        <input
          className="pill-input"
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          autoComplete="new-password"
        />

        <input
          className="pill-input"
          type="password"
          placeholder="Retype New Password"
          value={retypePassword}
          onChange={(e) => setRetypePassword(e.target.value)}
          autoComplete="new-password"
        />

        <button className="pill-button" type="submit">Submit</button>
      </form>
    </main>
  );
};

export default LoginSignup;
