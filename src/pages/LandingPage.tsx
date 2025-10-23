import React from 'react';
import { Link } from 'react-router-dom';
import '../CSS/LandingPage.css';

const LandingPage: React.FC = () => {
    return (
        <main className="home-container" role="main">
            <h1 className="home-title">Cloud Control</h1>

            <div className="home-actions">
                <Link to="/login" className="home-button">Login</Link>
                <Link to="/Signup" className="home-button">Signup</Link>
                <Link to="/forgotpassword" className="home-button">Forgot Password</Link>

            </div>
        </main>
    );
};

export default LandingPage;
