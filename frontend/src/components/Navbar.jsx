import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ userName, userRole }) => {
    const [scrolled, setScrolled] = React.useState(false);
    const navigate = useNavigate();

    React.useEffect(() => {
        // Handle scroll effect
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);



    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? 'bg-gray-800 backdrop-blur-lg shadow-lg'
                    : 'bg-gray-900 backdrop-blur-md'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-white">NextWork</span>
                    </Link>

                    {/* Right Section */}
                    <div className="flex items-center space-x-4">
                        {/* Dashboard Link */}
                        <Link
                            to={userRole === 'CONSULTANT' ? '/consultant/dashboard' : '/user/dashboard'}
                            className="text-gray-300 hover:text-blue-400 transition-colors"
                        >
                            Dashboard
                        </Link>

                        {/* User Info */}
                        {userName && (
                            <div className="flex items-center space-x-2 text-gray-300">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span className="text-sm font-medium">{userName}</span>
                            </div>
                        )}



                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                        >
                            Sair
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
