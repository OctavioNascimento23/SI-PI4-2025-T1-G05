// Criado por Ítalo de Souza
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-light via-white to-blue-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">NextWork</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link
                            to="/login"
                            className="text-gray-700 font-medium hover:text-blue-600 transition-colors"
                        >
                            Entrar
                        </Link>
                        <Link
                            to="/register"
                            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 btn-primary shadow-md"
                        >
                            Começar Agora
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-grow">
                <div className="relative overflow-hidden gradient-animated py-24 sm:py-32">
                    <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-5xl sm:text-6xl font-extrabold text-white mb-6 leading-tight">
                            Transforme Seu Negócio com<br />
                            <span className="text-blue-200">Consultoria Especializada</span>
                        </h2>
                        <p className="text-xl sm:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto">
                            Conecte-se com especialistas, receba avaliações personalizadas e resolva seus problemas hoje mesmo.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                to="/register"
                                className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-50 btn-primary shadow-xl w-full sm:w-auto"
                            >
                                Começar Agora
                            </Link>
                            <Link
                                to="/register"
                                className="bg-blue-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-400 transition-all border-2 border-white/20 w-full sm:w-auto"
                            >
                                Seja um Consultor
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white p-8 rounded-2xl shadow-card hover:shadow-card-hover card-hover">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-gray-900">Diagnóstico Digital</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Avalie o nível de maturidade digital do seu negócio e receba um roadmap personalizado.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white p-8 rounded-2xl shadow-card hover:shadow-card-hover card-hover">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-gray-900">Consultoria Especializada</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Conecte-se com consultores experientes para impulsionar seu negócio.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white p-8 rounded-2xl shadow-card hover:shadow-card-hover card-hover">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-gray-900">Conteúdo Educativo</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Acesse materiais exclusivos para aprender sobre gestão e marketing digital.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="gradient-animated py-16 mx-4 sm:mx-8 rounded-3xl mb-20 shadow-xl">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            Pronto para Crescer?
                        </h3>
                        <p className="text-xl text-blue-100 mb-8">
                            Junte-se a centenas de pequenos negócios que já transformaram sua presença digital
                        </p>
                        <Link
                            to="/register"
                            className="inline-block bg-white text-blue-600 px-10 py-4 rounded-xl text-lg font-bold hover:bg-blue-50 btn-primary shadow-2xl"
                        >
                            Cadastre-se Gratuitamente
                        </Link>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-dark text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-gray-300">© 2025 NextWork. Todos os direitos reservados.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
