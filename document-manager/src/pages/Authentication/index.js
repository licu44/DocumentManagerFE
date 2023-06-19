import React, { useEffect } from 'react';
import SignIn from './Login';
import SignUp from './Register';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { useState } from 'react';
import { useIsAuthenticated } from 'react-auth-kit';
import { useNavigate } from 'react-router-dom';

export default function Index() {
    const [ register, setRegister ] = useState(false);
    const isAuthenticated = useIsAuthenticated();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated()) {
            navigate('/');
        }
    }, [ isAuthenticated, navigate ]);

    return (
        <>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                {register ? <SignUp setRegister={setRegister} /> : <SignIn setRegister={setRegister} />}
            </Container>
        </>
    );
}
