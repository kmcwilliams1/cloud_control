import React from 'react';
import { Link } from 'react-router-dom';
import '../CSS/HomePage.css';

const HomePage: React.FC = () => {
    return (
        <main className="home-container" role="main">
            <h1 className="home-title">Cloud Control</h1>

            <div className="home-actions">
                <Link to="/loginsignup" className="home-button">Login</Link>
                <Link to="/loginsignup?mode=register" className="home-button">Register</Link>
            </div>
        </main>
    );
};

export default HomePage;
