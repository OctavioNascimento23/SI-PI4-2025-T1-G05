import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './Button';
import { LogOut, User, Briefcase } from 'lucide-react';

export function Navbar() {
  const { user, usuario, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const getDashboardRoute = () => {
    if (!user || !usuario) return '/';
    return usuario.tipo_usuario === 'Comerciante' ? '/dashboard-empresa' : '/dashboard-consultor';
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={getDashboardRoute()} className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">NextWork</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to={usuario?.tipo_usuario === 'Comerciante' ? '/dashboard-empresa' : '/dashboard-consultor'}>
                  <Button variant="ghost" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Link to={usuario?.tipo_usuario === 'Comerciante' ? '/perfil-cliente' : '/perfil-consultor'}>
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    {usuario?.nome}
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="primary" size="sm">
                  Entrar
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
