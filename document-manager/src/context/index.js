import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthUser } from 'react-auth-kit';

export const AuthDataContext = createContext();

export const AuthDataProvider = ({ children }) => {
    const authData = useAuthUser();
    const [ userId, setUserId ] = useState(() => {
        const storedUserId = localStorage.getItem('userId');
        return storedUserId ? JSON.parse(storedUserId) : null;
    });

    useEffect(() => {
        const data = authData();
        if (data) {
            setUserId(data.userId);
            localStorage.setItem('userId', JSON.stringify(data.userId));
        }
    }, [ authData ]);

    return (
        <AuthDataContext.Provider value={userId}>
            {children}
        </AuthDataContext.Provider>
    );
};

export const useAuthDataContext = () => {
    return useContext(AuthDataContext);
};
