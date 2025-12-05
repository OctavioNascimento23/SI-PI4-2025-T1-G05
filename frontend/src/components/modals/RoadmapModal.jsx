import React, { useState } from 'react';
import axios from 'axios';
import authService from '../../services/authService';

const RoadmapModal = ({ isOpen, onClose, projectId, projectName }) => {
    const [formData, setFormData] = useState({
        title: `Roadmap - ${projectName}`,
        description: '',
        steps: [
            { title: '', description: '', estimatedTime: '' }
        ]
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const user = authService.getCurrentUser();

    if (!isOpen) return null;

    const handleAddStep = () => {
        setFormData({
            ...formData,
            steps: [...formData.steps, { title: '', description: '', estimatedTime: '' }]
        });
    };

    const handleRemoveStep = (index) => {
        const newSteps = formData.steps.filter((_, i) => i !== index);
        setFormData({ ...formData, steps: newSteps });
    };

    const handleStepChange = (index, field, value) => {
        const newSteps = [...formData.steps];
        newSteps[index][field] = value;
        setFormData({ ...formData, steps: newSteps });
    };

    const validateForm = () => {
        if (!formData.title.trim()) {
            setError('O título é obrigatório');
            return false;
        }

        if (formData.steps.length === 0) {
            setError('Adicione pelo menos uma etapa');
            return false;
        }

        for (let i = 0; i < formData.steps.length; i++) {
            if (!formData.steps[i].title.trim() || !formData.steps[i].description.trim()) {
                setError(`A etapa ${i + 1} precisa ter título e descrição`);
                return false;
            }
        }

        return true;
    };

    const handleDownloadPdf = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:8080/api/roadmap/generate',
                {
                    projectId,
                    title: formData.title,
                    description: formData.description,
                    steps: formData.steps
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    responseType: 'blob'
                }
            );

            // Download do PDF
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `roadmap_${projectId}_${Date.now()}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            setSuccess('PDF baixado com sucesso!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Erro ao gerar roadmap: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleSendToClient = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');

            // Envia roadmap e salva no servidor
            const response = await axios.post(
                `http://localhost:8080/api/roadmap/send?userId=${user?.userId}`,
                {
                    projectId,
                    title: formData.title,
                    description: formData.description,
                    steps: formData.steps
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setSuccess('Roadmap enviado! O cliente pode baixar o PDF no chat.');
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            setError('Erro ao enviar roadmap: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-gray-800 rounded-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">
                        Criar Roadmap Personalizado
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-200"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-900/30 border border-red-800 text-red-300 rounded-lg">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-3 bg-green-900/30 border border-green-800 text-green-300 rounded-lg">
                        {success}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                    {/* Título */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Título do Roadmap *
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>

                    {/* Descrição */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Descrição Geral
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows="3"
                            className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            placeholder="Descreva o objetivo geral deste roadmap..."
                        />
                    </div>

                    {/* Etapas */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <label className="block text-sm font-medium text-gray-300">
                                Etapas do Roadmap *
                            </label>
                            <button
                                type="button"
                                onClick={handleAddStep}
                                className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors flex items-center space-x-1"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span>Adicionar Etapa</span>
                            </button>
                        </div>

                        <div className="space-y-4">
                            {formData.steps.map((step, index) => (
                                <div key={index} className="p-4 bg-gray-700 rounded-lg border border-gray-600">
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="text-white font-semibold">Etapa {index + 1}</h4>
                                        {formData.steps.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveStep(index)}
                                                className="text-red-400 hover:text-red-300"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1">Título da Etapa *</label>
                                            <input
                                                type="text"
                                                value={step.title}
                                                onChange={(e) => handleStepChange(index, 'title', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                                placeholder="Ex: Planejamento Estratégico"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1">Descrição *</label>
                                            <textarea
                                                value={step.description}
                                                onChange={(e) => handleStepChange(index, 'description', e.target.value)}
                                                rows="2"
                                                className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                                placeholder="Descreva o que será feito nesta etapa..."
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1">Tempo Estimado</label>
                                            <input
                                                type="text"
                                                value={step.estimatedTime}
                                                onChange={(e) => handleStepChange(index, 'estimatedTime', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                                placeholder="Ex: 2 semanas"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-between items-center space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <div className="flex space-x-3">
                            <button
                                type="button"
                                onClick={handleDownloadPdf}
                                disabled={loading}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Processando...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span>Baixar PDF</span>
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={handleSendToClient}
                                disabled={loading}
                                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Enviando...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                        <span>Enviar para Cliente</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RoadmapModal;
