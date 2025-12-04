import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import chatService from '../services/chatService';
import projectService from '../services/projectService';
import authService from '../services/authService';

const ChatPage = () => {
    const { requestId } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

    const user = authService.getCurrentUser();

    useEffect(() => {
        loadData();
        // Poll for new messages every 3 seconds
        const interval = setInterval(loadMessages, 3000);
        return () => clearInterval(interval);
    }, [requestId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [projectData, messagesData] = await Promise.all([
                projectService.getProjectById(requestId),
                chatService.getMessages(requestId)
            ]);
            setProject(projectData);
            setMessages(messagesData);
        } catch (err) {
            console.error(err);
            if (err.response?.status === 400 || err.response?.status === 404) {
                alert('Projeto não encontrado ou você não tem acesso');
                navigate(user?.role === 'CONSULTANT' ? '/consultant/dashboard' : '/user/dashboard');
            }
        } finally {
            setLoading(false);
        }
    };

    const loadMessages = async () => {
        try {
            const messagesData = await chatService.getMessages(requestId);
            setMessages(messagesData);
        } catch (err) {
            console.error('Erro ao carregar mensagens:', err);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim() || sending) return;

        setSending(true);
        try {
            await chatService.sendMessage(requestId, message);
            setMessage('');
            await loadMessages();
        } catch (err) {
            console.error('Erro:', err);
            alert('Erro ao enviar: ' + (err.message || 'Desconhecido'));
        } finally {
            setSending(false);
        }
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
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
                    <p className="mt-4 text-gray-600">Carregando chat...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar userName={user?.name} userRole={user?.role} />

            <div className="pt-16">
                <div className="h-screen flex">
                    {/* Main Chat Area */}
                    <div className="flex-1 flex flex-col">
                        {/* Chat Header */}
                        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <Link
                                        to={user?.role === 'CONSULTANT' ? '/consultant/dashboard' : '/user/dashboard'}
                                        className="text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </Link>
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                            {project?.name}
                                        </h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {user?.role === 'CONSULTANT' ? project?.userName : project?.consultantName || 'Aguardando consultor'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Banner: Consultor precisa aceitar projeto */}
                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-900">
                            {messages.length === 0 ? (
                                <div className="text-center py-12">
                                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    <p className="text-gray-500">Nenhuma mensagem ainda. Inicie a conversa!</p>
                                </div>
                            ) : (
                                messages.map((msg) => {
                                    const isOwnMessage = msg.sender.id === user?.id;

                                    return (
                                        <div key={msg.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-md`}>
                                                <div className="flex items-end space-x-2">
                                                    {!isOwnMessage && (
                                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                                            <span className="text-white text-xs font-bold">
                                                                {msg.sender.name.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div
                                                            className={`px-4 py-3 rounded-2xl ${isOwnMessage
                                                                    ? 'bg-blue-500 text-white rounded-br-none'
                                                                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-bl-none'
                                                                }`}
                                                        >
                                                            {!isOwnMessage && (
                                                                <p className="text-xs font-semibold mb-1 opacity-75">
                                                                    {msg.sender.name}
                                                                </p>
                                                            )}
                                                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                                        </div>
                                                        <p className={`text-xs mt-1 ${isOwnMessage ? 'text-right' : 'text-left'} text-gray-500 dark:text-gray-400`}>
                                                            {formatTimestamp(msg.timestamp)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
                            <form onSubmit={handleSendMessage}>
                                <div className="flex items-end space-x-2">
                                    <div className="flex-1 relative">
                                        <textarea
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSendMessage(e);
                                                }
                                            }}
                                            placeholder="Digite sua mensagem..."
                                            rows="1"
                                            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 dark:text-white resize-none"
                                            style={{ maxHeight: '120px' }}
                                            disabled={sending}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={!message.trim() || sending}
                                        className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                    Pressione Enter para enviar, Shift + Enter para nova linha
                                </p>
                            </form>
                        </div>
                    </div>

                    {/* Project Status Sidebar */}
                    <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
                        <div className="p-6 space-y-6">
                            {/* Project Info */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                    Informações do Projeto
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Projeto</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">{project?.name}</p>
                                    </div>
                                    {project?.description && (
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Descrição</p>
                                            <p className="text-sm text-gray-900 dark:text-white">{project?.description}</p>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Prioridade</p>
                                        <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-sm font-medium">
                                            {project?.priority}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                                        <span className="inline-block px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded text-sm font-medium">
                                            {getStatusText(project?.status)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Progress */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-semibold text-gray-900 dark:text-white">Progresso</h4>
                                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{project?.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                                        style={{ width: `${project?.progress}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Criado em</p>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {new Date(project?.createdAt).toLocaleDateString('pt-BR')}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Última atualização</p>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {new Date(project?.updatedAt).toLocaleDateString('pt-BR')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
