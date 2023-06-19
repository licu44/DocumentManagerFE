import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Auth from './pages/Authentication';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
// import Dashboard from './pages/Dashboard';
// import Profile from './pages/Profile';
// import Documents from './pages/Documents';
// import ProjectStatus from './pages/ProjectStatus';
import Layout from './components/Layout';
import { RequireAuth } from 'react-auth-kit';


function App() {
    return (
        <Routes>
            <Route path="/" element={<RequireAuth loginPath="/auth"><Layout /></RequireAuth>}>
                <Route index element={<RequireAuth loginPath="/auth"><Home /></RequireAuth>} />
                {/* Add other restricted routes here */}
            </Route>
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}


export default App;
