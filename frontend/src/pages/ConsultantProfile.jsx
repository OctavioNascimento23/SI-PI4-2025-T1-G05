import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const ConsultantProfile = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [isEditingAbout, setIsEditingAbout] = useState(false);
    const [about, setAbout] = useState('');

    // Mock data
    const profileData = {
        name: user.name || 'Consultor',
        title: 'Consultor Profissional',
        email: user.email || 'teste123@gmail.com',
        phone: '19981754523',
        rating: 0,
        totalReviews: 0,
        experiences: [],
        projects: []
    };

    const [experiences, setExperiences] = useState(profileData.experiences);
    const [projects, setProjects] = useState(profileData.projects);

    return (
        <div className="min-h-screen bg-gray-900">
            <Navbar userName={user.name} userRole={user.role} />

            <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Side - Profile Card */}
                        <div className="lg:col-span-1">
                            <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                                {/* Avatar */}
                                <div className="flex justify-center mb-6">
                                    <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                                        <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Name and Title */}
                                <div className="text-center mb-6">
                                    <h2 className="text-2xl font-bold text-white mb-1">
                                        {profileData.name}
                                    </h2>
                                    <p className="text-gray-400 mb-4">
                                        {profileData.title}
                                    </p>

                                    {/* Rating */}
                                    <div className="flex items-center justify-center space-x-1 mb-1">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                className={`w-5 h-5 ${i < profileData.rating ? 'text-yellow-400' : 'text-gray-600'}`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-400">
                                        {profileData.rating.toFixed(1)} ({profileData.totalReviews} avaliações)
                                    </p>
                                </div>

                                {/* Contact Info */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center space-x-3 text-gray-300">
                                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <span className="text-sm">{profileData.email}</span>
                                    </div>
                                    <div className="flex items-center space-x-3 text-gray-300">
                                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        <span className="text-sm">{profileData.phone}</span>
                                    </div>
                                </div>

                                {/* Edit Profile Button */}
                                <button className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
                                    Editar Perfil
                                </button>
                            </div>
                        </div>

                        {/* Right Side - Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* About Section */}
                            <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold text-white flex items-center">
                                        <svg className="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Sobre Mim
                                    </h3>
                                </div>
                                {about ? (
                                    <p className="text-gray-300">{about}</p>
                                ) : (
                                    <p className="text-gray-400 italic">
                                        Adicione uma descrição sobre você e sua experiência profissional
                                    </p>
                                )}
                            </div>

                            {/* Professional Experience Section */}
                            <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-white flex items-center">
                                        <svg className="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        Experiência Profissional
                                    </h3>
                                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors text-sm flex items-center space-x-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        <span>Adicionar</span>
                                    </button>
                                </div>

                                {experiences.length === 0 ? (
                                    <div className="text-center py-12">
                                        <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <p className="text-gray-400 mb-2">Nenhuma experiência cadastrada</p>
                                        <p className="text-sm text-blue-400">
                                            Adicione suas experiências profissionais para se destacar!
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {experiences.map((exp, index) => (
                                            <div key={index} className="p-4 bg-gray-700 rounded-lg">
                                                <h4 className="font-semibold text-white">{exp.title}</h4>
                                                <p className="text-sm text-gray-400">{exp.company}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Projects Section */}
                            <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-white flex items-center">
                                        <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Projetos e Cases de Sucesso
                                    </h3>
                                    <button className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors text-sm flex items-center space-x-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        <span>Adicionar</span>
                                    </button>
                                </div>

                                {projects.length === 0 ? (
                                    <div className="text-center py-12">
                                        <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <p className="text-gray-400 mb-2">Nenhum projeto cadastrado</p>
                                        <p className="text-sm text-green-400">
                                            Mostre os projetos em que trabalhou e os resultados obtidos!
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {projects.map((project, index) => (
                                            <div key={index} className="p-4 bg-gray-700 rounded-lg">
                                                <h4 className="font-semibold text-white">{project.title}</h4>
                                                <p className="text-sm text-gray-400">{project.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Client Reviews Section */}
                            <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                                    <svg className="w-6 h-6 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    Avaliações dos Clientes
                                </h3>
                                <div className="text-center py-12">
                                    <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <p className="text-gray-400">Ainda sem avaliações</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Complete consultorias para receber avaliações dos clientes
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

export default ConsultantProfile;
