import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NoteModel = ({ isOpen, onClose, note, onSave }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        setTitle(note?.title || '');
        setDescription(note?.description || '');
        setError('');
    }, [note]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!title.trim() || !description.trim()) {
                setError('Please fill in all fields');
                return;
            }
            const payload = { title, description };
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
            let data;
            if (note) {
                const res = await axios.put(`/api/notes/${note._id}`, payload, config);
                data = res.data;
            } else {
                const res = await axios.post('/api/notes', payload, config);
                data = res.data;
            }
            onSave(data);
            setTitle('');
            setDescription('');
            setError('');
            onClose();
        } catch (error) {
            console.error('Error saving note:', error);
            setError(error.response?.data?.message || 'Failed to save note');
        }
    };

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50'>
            <div className='bg-black p-6 rounded-lg shadow-lg w-full max-w-md border border-gray-700'>
                <h2 className='text-2xl font-bold mb-4 text-center text-white'>{note ? 'Edit Note' : 'Create Note'}</h2>
                {error && <p className='text-red-500 mb-4 text-center'>{error}</p>}
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder='Note Title'
                            className='w-full px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-md outline-none focus:ring-2 focus:ring-gray-400'
                            required
                        />
                    </div>
                    <div>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder='Note Description'
                            className='w-full px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-md outline-none focus:ring-2 focus:ring-gray-400'
                            rows={4}
                            required
                        />
                    </div>
                    <div className='flex justify-end space-x-2'>
                        <button type="submit" className='bg-white text-black font-bold px-4 py-2 rounded-md hover:bg-gray-200'>{note ? 'Update' : 'Create'}</button>
                        <button type="button" onClick={onClose} className='bg-white text-black font-bold px-4 py-2 rounded-md hover:bg-gray-200'>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NoteModel;