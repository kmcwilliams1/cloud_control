// File: `src/pages/login.tsx`
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../CSS/Login.css';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Login', { email });
        alert('Login submitted (demo)');
        // replace with real auth then:
        // setUser({...}); navigate('/home');
    };

    return (
        <main className="login-page">
            <h1 className="brand">Cloud Control</h1>

            <form className="login-form" onSubmit={onSubmit} aria-label="Login form">
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
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                />

                <button className="pill-button" type="submit">Login</button>

                <div style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'center' }}>

                    <Link to="/forgotpassword" className="home-button">Forgot Password</Link>
                </div>
            </form>
        </main>
    );
};

export default Login;

