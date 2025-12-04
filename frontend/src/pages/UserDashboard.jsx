import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import projectService from '../services/projectService';
import authService from '../services/authService';

const UserDashboard = () => {
    const user = authService.getCurrentUser();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            setLoading(true);
            const data = await projectService.getProjects();
            setProjects(data);
        } catch (err) {
            setError('Erro ao carregar projetos');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Calculate statistics from real data
    const stats = {
        totalRequests: projects.length,
        pending: projects.filter(p => p.status === 'PENDING').length,
        active: projects.filter(p => p.status === 'IN_PROGRESS').length,
        completed: projects.filter(p => p.status === 'COMPLETED').length
    };

    const activeProjects = projects.filter(p => p.status === 'IN_PROGRESS');
    const pendingRequests = projects.filter(p => p.status === 'PENDING');

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-700';
            case 'IN_PROGRESS': return 'bg-green-100 text-green-700';
            case 'COMPLETED': return 'bg-blue-100 text-blue-700';
            case 'CANCELLED': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusText = (status) => {
        const statusMap = {
            'PENDING': 'Aguardando',
            'IN_PROGRESS': 'Em Andamento',
            'COMPLETED': 'Concluído',
            'CANCELLED': 'Cancelado'
        };
        return statusMap[status] || status;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Carregando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar userName={user?.name} userRole={user?.role} />

            <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Olá, {user?.name}! 👋
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Acompanhe suas consultorias e gerencie suas solicitações
                            </p>
                        </div>
                        <Link
                            to="/user/request"
                            className="mt-4 sm:mt-0 px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors shadow-lg flex items-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Nova Solicitação</span>
                        </Link>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Total de Pedidos</p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalRequests}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Aguardando</p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
                                </div>
                                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Em Andamento</p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.active}</p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Concluídos</p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.completed}</p>
                                </div>
                                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Active Projects */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                Projetos Ativos
                            </h2>
                            <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                                {stats.active} ativo{stats.active !== 1 ? 's' : ''}
                            </span>
                        </div>
                        {activeProjects.length > 0 ? (
                            <div className="space-y-4">
                                {activeProjects.map((project) => (
                                    <div
                                        key={project.id}
                                        className="p-5 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                                            <div className="mb-3 lg:mb-0">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                                    {project.name}
                                                </h3>
                                                {project.description && (
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                        {project.description}
                                                    </p>
                                                )}
                                                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                                                    {project.consultantName && (
                                                        <span className="flex items-center">
                                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                            </svg>
                                                            {project.consultantName}
                                                        </span>
                                                    )}
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeColor(project.priority)}`}>
                                                        {project.priority}
                                                    </span>
                                                </div>
                                            </div>
                                            <Link
                                                to={`/chat/${project.id}`}
                                                className="px-5 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center space-x-2 self-start"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                </svg>
                                                <span>Abrir Chat</span>
                                            </Link>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="mb-2">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-600 dark:text-gray-400">Progresso</span>
                                                <span className="font-semibold text-blue-600 dark:text-blue-400">{project.progress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                                <div
                                                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${project.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                                <p className="text-gray-500 dark:text-gray-400">Nenhum projeto ativo</p>
                            </div>
                        )}
                    </div>

                    {/* Pending Requests */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                            Solicitações Pendentes
                        </h2>
                        {pendingRequests.length > 0 ? (
                            <div className="space-y-4">
                                {pendingRequests.map((request) => (
                                    <div
                                        key={request.id}
                                        className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                                    {request.name}
                                                </h3>
                                                {request.description && (
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                        {request.description}
                                                    </p>
                                                )}
                                                <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeColor(request.priority)}`}>
                                                        {request.priority}
                                                    </span>
                                                    <span>
                                                        {new Date(request.createdAt).toLocaleDateString('pt-BR')}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(request.status)}`}>
                                                {getStatusText(request.status)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-gray-500 dark:text-gray-400">Nenhuma solicitação pendente</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
