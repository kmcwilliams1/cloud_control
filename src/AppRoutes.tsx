import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginSignupPage from './pages/LoginSignup';
import MFA from './pages/MFA';
import ForgotPassword from './pages/ForgotPassword';

// import ProfilePage from './pages/ProfilePage';



const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/loginsignup" element={<LoginSignupPage />} />
            <Route path="/mfa" element={<MFA />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            {/*<Route path="/profile" element={<ProfilePage />} />*/}


        </Routes>
    );
};

export default AppRoutes;
