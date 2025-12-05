import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import projectService from '../services/projectService';

const ConsultantDashboard = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        inProgress: 0,
        completed: 0
    });
    const [pendingProjects, setPendingProjects] = useState([]);
    const [myProjects, setMyProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [pending, mine] = await Promise.all([
                    projectService.getPendingProjects(),
                    projectService.getConsultantProjects()
                ]);

                setPendingProjects(pending);
                setMyProjects(mine);

                // Calculate stats
                const inProgress = mine.filter(p => p.status === 'IN_PROGRESS').length;
                const completed = mine.filter(p => p.status === 'COMPLETED').length;

                setStats({
                    total: mine.length,
                    pending: pending.length,
                    inProgress,
                    completed
                });
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900">
            <Navbar userName={user.name} userRole={user.role} />

            <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">
                                Bem-vindo, Consultor {user.name}!
                            </h1>
                            <p className="text-gray-400">
                                Gerencie suas consultorias e ajude empresários a crescer
                            </p>
                        </div>
                        <Link
                            to="/consultant/profile"
                            className="mt-4 sm:mt-0 px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors shadow-lg"
                        >
                            Meu Perfil
                        </Link>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Total */}
                        <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm font-medium mb-1">Total</p>
                                    <p className="text-3xl font-bold text-white">{stats.total}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Pending */}
                        <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm font-medium mb-1">Pendentes</p>
                                    <p className="text-3xl font-bold text-white">{stats.pending}</p>
                                </div>
                                <div className="w-12 h-12 bg-yellow-900 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* In Progress */}
                        <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm font-medium mb-1">Em Andamento</p>
                                    <p className="text-3xl font-bold text-white">{stats.inProgress}</p>
                                </div>
                                <div className="w-12 h-12 bg-orange-900 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Completed */}
                        <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm font-medium mb-1">Concluídas</p>
                                    <p className="text-3xl font-bold text-white">{stats.completed}</p>
                                </div>
                                <div className="w-12 h-12 bg-green-900 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pending Consultations */}
                    <div className="bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-700">
                        <h2 className="text-xl font-bold text-white mb-4">
                            Consultorias Pendentes
                        </h2>
                        {pendingProjects.length > 0 ? (
                            <div className="space-y-4">
                                {pendingProjects.map((project) => (
                                    <div
                                        key={project.id}
                                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-700 rounded-lg border border-gray-600"
                                    >
                                        <div className="mb-4 sm:mb-0">
                                            <h3 className="text-lg font-semibold text-white mb-1">
                                                {project.name}
                                            </h3>
                                            <p className="text-sm text-gray-400">
                                                Cliente: {project.user?.name || 'Usuário'}
                                            </p>
                                            <p className="text-sm text-gray-400 mt-1">
                                                {project.description}
                                            </p>
                                        </div>
                                        <Link
                                            to={`/chat/${project.id}`}
                                            className="w-full sm:w-auto px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors text-center flex items-center justify-center space-x-2"
                                        >
                                            <span>Ver Detalhes</span>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                                <p className="text-gray-400">Nenhuma consultoria pendente</p>
                            </div>
                        )}
                    </div>

                    {/* In Progress Consultations */}
                    <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                        <h2 className="text-xl font-bold text-white mb-6">
                            Consultorias Em Andamento
                        </h2>
                        {myProjects.length > 0 ? (
                            <div className="space-y-4">
                                {myProjects.map((project) => (
                                    <div
                                        key={project.id}
                                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-700 rounded-lg border border-gray-600"
                                    >
                                        <div className="mb-4 sm:mb-0">
                                            <h3 className="text-lg font-semibold text-white mb-1">
                                                {project.name}
                                            </h3>
                                            <p className="text-sm text-gray-400">
                                                Cliente: {project.user?.name || 'Usuário'}
                                            </p>
                                            <span className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded-full ${project.status === 'COMPLETED'
                                                    ? 'bg-green-900 text-green-200'
                                                    : 'bg-blue-900 text-blue-200'
                                                }`}>
                                                {project.status === 'COMPLETED' ? 'Concluído' : 'Em Andamento'}
                                            </span>
                                        </div>
                                        <Link
                                            to={`/chat/${project.id}`}
                                            className="w-full sm:w-auto px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors text-center flex items-center justify-center space-x-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                            <span>Abrir Chat</span>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-400">Você não tem consultorias em andamento</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConsultantDashboard;
