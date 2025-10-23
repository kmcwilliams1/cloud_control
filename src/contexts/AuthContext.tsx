import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Role = 'admin' | 'user' | 'guest';
export type User = { id: string; name: string; role: Role } | null;

type AuthContextType = {
    user: User;
    setUser: (u: User) => void;
    isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User>(null);

    return (
        <AuthContext.Provider value={{ user, setUser, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};