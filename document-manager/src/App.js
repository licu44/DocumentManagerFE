import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Auth from './pages/Authentication';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Documents from './pages/Documents';
import Gallery from './pages/Gallery';

import Layout from './components/Layout';
import { RequireAuth } from 'react-auth-kit';


function App() {
    return (
        <Routes>
            <Route path="/" element={<RequireAuth loginPath="/auth"><Layout /></RequireAuth>}>
                <Route index element={<RequireAuth loginPath="/auth"><Home /></RequireAuth>} />
                <Route path="/documents" element={<RequireAuth loginPath="/auth"><Documents /></RequireAuth>} />
                <Route path="/gallery" element={<RequireAuth loginPath="/auth"><Gallery /></RequireAuth>} />
                <Route path="/profile" element={<RequireAuth loginPath="/auth"><Profile /></RequireAuth>} />
            </Route>
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}


export default App;
