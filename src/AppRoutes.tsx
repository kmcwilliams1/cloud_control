import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MFA from './pages/MFA';
import ForgotPassword from './pages/ForgotPassword';
import HomeRouter from './pages/HomeRouter';
import Account from "./pages/Account";

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/home" element={<HomeRouter />} />
            <Route path="/mfa" element={<MFA />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/account" element={<Account />} />

        </Routes>
    );
};

export default AppRoutes;