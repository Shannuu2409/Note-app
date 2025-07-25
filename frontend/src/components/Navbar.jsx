import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, setUser }) => {
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;
        const delay = setTimeout(() => {
            navigate(search.trim() ? `/?search=${encodeURIComponent(search)}` : '/');
        }, 500);
        return () => clearTimeout(delay);
    }, [search, navigate, user]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    return (
        <nav className='bg-black p-4 text-white shadow-lg border-b'>
            <div className='container mx-auto flex items-center justify-between'>
                <Link to='/' className='text-2xl font-bold text-white'>
                    Notes App
                </Link>
                {user && (
                    <div className='flex items-center space-x-4'>
                        <input
                            type='text'
                            placeholder='Search notes'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className='bg-gray-800 text-white px-4 py-2 rounded-md outline-none focus:ring-2 focus:ring-gray-400'
                        />
                        <span className='text-white font-bold'>{user.username}</span>
                        <button onClick={handleLogout} className='bg-red-600 text-white font-bold px-3 py-1 rounded-md hover:bg-red-800'>Logout</button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;