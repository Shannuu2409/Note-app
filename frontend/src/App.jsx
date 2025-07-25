import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import axios from 'axios';

export const App = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const { data } = await axios.get("/api/users/me", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(data);
            } catch (err) {
                console.error(err);
                localStorage.removeItem('token');
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    }, []);

    if (isLoading)
        return <div className='min-h-screen bg-white flex items-center justify-center'>
            <div className='text-xl text-black'>Loading....</div>
        </div>;

    return (
        <div className="w-full min-h-screen bg-white">
            <Navbar setUser={setUser} user={user} />
            <Routes>
                <Route path='/login' element={user ? <Navigate to='/' /> : <Login setUser={setUser} />} />
                <Route path='/register' element={user ? <Navigate to='/' /> : <Register setUser={setUser} />} />
                <Route path='/' element={user ? <Home /> : <Navigate to='/login' />} />
            </Routes>
        </div>
    );
};