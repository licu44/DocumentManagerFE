import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Auth from './pages/Authentication';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Documents from './pages/Documents';
import Gallery from './pages/Gallery';

import Layout from './components/Layout';
import { RequireAuth } from 'react-auth-kit';
import { AuthDataProvider } from './context';


function App() {
    return (
        <AuthDataProvider>
            <Routes>
                <Route path="/" element={<RequireAuth loginPath="/auth"><Layout /></RequireAuth>}>
                    <Route index element={<RequireAuth loginPath="/auth"><Home /></RequireAuth>} />
                    <Route path="/documents" element={<RequireAuth loginPath="/auth"><Documents /></RequireAuth>} />
                    <Route path="/gallery" element={<RequireAuth loginPath="/auth"><Gallery /></RequireAuth>} />
                    <Route path="/admin" element={<RequireAuth loginPath="/auth"><Admin /></RequireAuth>} />
                </Route>
                <Route path="/auth" element={<Auth />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </AuthDataProvider>
    );
}

export default App;
