import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Home } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-blue-600">404</h1>
        <h2 className="text-3xl font-semibold text-gray-900 mt-4">Página não encontrada</h2>
        <p className="text-gray-600 mt-2 mb-8">
          A página que você está procurando não existe ou foi removida.
        </p>
        <Link to="/">
          <Button size="lg">
            <Home className="h-5 w-5 mr-2" />
            Voltar para Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
