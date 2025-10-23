// File: `src/pages/signup.tsx`
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../CSS/Signup.css';

const Signup: React.FC = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('');
    const navigate = useNavigate();

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (newPassword !== retypePassword) {
            alert('Passwords do not match');
            return;
        }
        console.log('Signup', { email });
        alert('Signup submitted (demo)');
        // replace with real signup then:
        // setUser({...}); navigate('/home');
    };

    return (
        <main className="login-page">
            <h1 className="brand">Cloud Control</h1>

            <form className="login-form" onSubmit={onSubmit} aria-label="Signup form">
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
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                />

                <input
                    className="pill-input"
                    type="password"
                    placeholder="Retype New Password"
                    value={retypePassword}
                    onChange={(e) => setRetypePassword(e.target.value)}
                    required
                    autoComplete="new-password"
                />

                <button
                    className="pill-input"
                    type="button"
                    onClick={() => navigate('/mfa')}
                >
                    Enable MFA
                </button>

                <button className="pill-button" type="submit">Register</button>

                <div style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'center' }}>
                    <Link to="/login" className="home-button">Go to login screen</Link>
                </div>
            </form>
        </main>
    );
};

export default Signup;

