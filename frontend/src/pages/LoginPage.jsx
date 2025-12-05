import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authService.login(formData.email, formData.password);

            // Redirect based on role
            if (response.role === 'CONSULTANT') {
                navigate('/consultant/dashboard');
            } else {
                navigate('/user/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Erro ao fazer login. Verifique suas credenciais.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="bg-gray-800 p-10 rounded-2xl shadow-soft border border-gray-700 w-full max-w-md transition-all duration-300">
                {/* Logo/Brand */}
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Entrar</h2>
                    <p className="text-gray-400">Bem-vindo de volta! Entre para continuar</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-900/30 border border-red-800 text-red-300 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-gray-300 font-semibold mb-2">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            placeholder="seu@email.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 font-semibold mb-2">Senha</label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-blue-700 btn-primary shadow-lg mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>

                {/* Signup Link */}
                <div className="mt-6 text-center">
                    <p className="text-gray-400">
                        Não tem uma conta?{' '}
                        <Link to="/register" className="text-blue-400 font-bold hover:underline">
                            Criar conta
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
