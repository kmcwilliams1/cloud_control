import React, { useState } from 'react';
import '../CSS/Signup.css';

const ForgotPassword: React.FC = () => {

    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle forgot password logic here
        console.log('Forgot Password requested for:', email);
        alert('If this email is registered, a password reset link has been sent. (demo)');

    }
    return (
        <main className="login-page">
            <h1 className="brand">Cloud Control</h1>

            <form className="login-form" onSubmit={handleSubmit} aria-label="Forgot Password Form">
                <input
                    className="pill-input"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                />

                <button className="pill-button" type="submit">Reset Password</button>
            </form>
        </main>
    );
};
export default ForgotPassword;