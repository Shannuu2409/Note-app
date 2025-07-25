import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Register({ setUser }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const { data } = await axios.post('/api/users/register',
                { username, email, password }
            );
            localStorage.setItem('token', data.token);
            setUser(data);
            navigate('/');
        } catch (error) {
            setError(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className='container mx-auto max-w-md mt-10 p-6 bg-white rounded-lg shadow-md '>
            <h2 className='text-2xl font-semibold mb-6 text-center'>Register</h2>
            {error && <div className='text-red-500 mb-4 text-center'>{error}</div>}
            <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                    <input type="text" placeholder='Username' value={username} onChange={(e) =>
                        setUsername(e.target.value)} className='w-full p-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500' required />
                </div>
                <div>
                    <input type="text" placeholder='Email' value={email} onChange={(e) =>
                        setEmail(e.target.value)} className='w-full p-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500' required />
                </div>
                <div>
                    <input type="password" placeholder='Password' value={password} onChange={(e) =>
                        setPassword(e.target.value)} className='w-full p-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500' required />
                </div>
                <button className='w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600'>Register</button>
            </form>
            <p className='mt-4 text-center'>Already have an account?
                <Link className='text-blue-600 hover:underline' to="/login"> Login </Link>
            </p>
        </div>
    );
}

export default Register;