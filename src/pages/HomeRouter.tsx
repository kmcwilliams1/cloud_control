import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminHome from './AdminHome';
import UserHome from './UserHome';
import GuestHome from './GuestHome';


const HomeRouter: React.FC = () => {
    const { user } = useAuth();

    if (!user) return <GuestHome />;

    switch (user.role) {
        case 'admin':
            return <AdminHome />;
        case 'user':
            return <UserHome />;
        default:
            return <GuestHome />;
    }
};

export default HomeRouter;