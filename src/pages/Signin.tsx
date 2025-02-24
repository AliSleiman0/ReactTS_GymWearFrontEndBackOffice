import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { login } from '../api/user';

export const Signin = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const navigate = useNavigate();
    const [error, setError] = useState('');



    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        try {
            const successLogin = await login(formData.username, formData.password);

            // Check if user is admin (role 4)
            if (!successLogin) {
                throw new Error('Access restricted to administrators only');
            }

            navigate('/');
        } catch (error: any) {
            console.log("Full error object:", error); // 👈 Log the entire error
            if (error.response) {
                console.log("Error response data:", error.response.data); // 👈 Log response data
                const errorMessage = error.response.data?.message || 'Login failed';
                throw new Error(errorMessage);
            }
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-md bg-white rounded-xl shadow-lg p-8"
            >
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                    Admin Sign In
                </h2>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4"
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="Enter username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="Enter password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                        Sign In
                    </button>
                </form>


            </motion.div>
        </div>
    );
};
