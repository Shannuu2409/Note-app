import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import NoteModel from './NoteModel';

const Home = () => {
    const [notes, setNotes] = useState([]);
    const [error, setError] = useState('');
    const [isModelOpen, setIsModelOpen] = useState(false);
    const [editNote, setEditNote] = useState(null);
    const location = useLocation();

    const fetchNotes = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Please login to view your notes');
                return;
            }
            const searchParams = new URLSearchParams(location.search);
            const search = searchParams.get('search') || '';
            const { data } = await axios.get('/api/notes', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const filteredNotes = search ? data.filter((note) => note.title.toLowerCase().includes(search.toLowerCase())) : data;
            setNotes(filteredNotes);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to fetch notes');
        }
    };

    const handleEdit = (note) => {
        setEditNote(note);
        setIsModelOpen(true);
    };

    useEffect(() => {
        fetchNotes();
        // eslint-disable-next-line
    }, [location.search]);

    const handleSavedNote = (newNote) => {
        if (editNote) {
            const updatedNotes = notes.map((note) =>
                note._id === editNote._id ? newNote : note
            );
            setNotes(updatedNotes);
        } else {
            setNotes([newNote, ...notes]);
        }
        setEditNote(null);
        setIsModelOpen(false);
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Please login to delete notes');
                return;
            }
            await axios.delete(`/api/notes/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotes(notes.filter((note) => note._id !== id));
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to delete note');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen bg-white">
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            <NoteModel
                isOpen={isModelOpen}
                onClose={() => {
                    setIsModelOpen(false);
                    setEditNote(null);
                }}
                note={editNote}
                onSave={handleSavedNote}
            />
            <button
                className="fixed bottom-6 right-6 w-14 h-14 bg-black text-white font-bold rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800"
                onClick={() => setIsModelOpen(true)}
            >
                <span className="text-2xl flex items-center justify-center h-full w-full pb-1">+</span>
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {notes.map((note) => (
                    <div
                        className="bg-gray-50 p-4 rounded-lg shadow-md border
                                   hover:scale-105 hover:shadow-xl transition-transform duration-200 cursor-pointer"
                        key={note._id}
                    >
                        <h3 className="text-lg font-bold text-gray-800 mb-2">{note.title}</h3>
                        <p className="text-black mb-4">{note.description}</p>
                        <p className="text-sm text-gray-500 mb-4">{new Date(note.updatedAt).toLocaleString()}</p>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handleEdit(note)}
                                className="bg-black text-white font-bold px-3 py-1 rounded-md hover:bg-gray-800"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(note._id)}
                                className="bg-black text-white font-bold px-3 py-1 rounded-md hover:bg-gray-800"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;