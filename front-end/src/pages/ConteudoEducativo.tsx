import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { conteudoEducativoService } from '../services/database';
import { Card, CardContent, CardHeader } from '../components/Card';
import { Button } from '../components/Button';
import { BookOpen, Lock, ExternalLink, CheckCircle } from 'lucide-react';
import { ConteudoEducativo as ConteudoEducativoType } from '../lib/supabase';

export function ConteudoEducativo() {
  const { usuario } = useAuth();
  const [conteudos, setConteudos] = useState<ConteudoEducativoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('Todas');

  useEffect(() => {
    loadConteudos();
  }, []);

  const loadConteudos = async () => {
    try {
      const data = await conteudoEducativoService.getAll();
      setConteudos(data);
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcessarConteudo = async (conteudo: ConteudoEducativoType) => {
    if (!usuario) return;

    if (conteudo.versao_acesso === 'Premium' && usuario.plano !== 'Premium') {
      alert('Este conteúdo é exclusivo para assinantes Premium!');
      return;
    }

    try {
      await conteudoEducativoService.trackAccess(usuario.id_usuario, conteudo.id_conteudo);
      if (conteudo.url_acesso) {
        window.open(conteudo.url_acesso, '_blank');
      }
    } catch (error) {
      console.error('Error tracking access:', error);
    }
  };

  const categorias = ['Todas', ...new Set(conteudos.map(c => c.categoria).filter(Boolean) as string[])];

  const conteudosFiltrados = categoriaFiltro === 'Todas'
    ? conteudos
    : conteudos.filter(c => c.categoria === categoriaFiltro);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Carregando conteúdos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Conteúdo Educativo</h1>
          <p className="text-gray-600">Aprenda e desenvolva suas habilidades em gestão e marketing digital</p>
        </div>

        {usuario?.plano === 'Gratuito' && (
          <Card className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">Upgrade para Premium</h3>
                  <p className="opacity-90">
                    Acesse todos os conteúdos exclusivos e materiais avançados
                  </p>
                </div>
                <Button variant="outline" className="bg-white text-blue-600 hover:bg-gray-100">
                  Saiba Mais
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mb-6 flex flex-wrap gap-2">
          {categorias.map((categoria) => (
            <button
              key={categoria}
              onClick={() => setCategoriaFiltro(categoria)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                categoriaFiltro === categoria
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              {categoria}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {conteudosFiltrados.map((conteudo) => {
            const isPremium = conteudo.versao_acesso === 'Premium';
            const isLocked = isPremium && usuario?.plano !== 'Premium';

            return (
              <Card key={conteudo.id_conteudo} className={isLocked ? 'opacity-75' : ''}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                        {conteudo.categoria && (
                          <span className="text-xs font-medium text-gray-500 uppercase">
                            {conteudo.categoria}
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-lg">{conteudo.titulo}</h3>
                    </div>
                    {isPremium && (
                      <div
                        className={`flex-shrink-0 px-2 py-1 rounded text-xs font-medium ${
                          isLocked
                            ? 'bg-gray-200 text-gray-700'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {isLocked ? (
                          <Lock className="h-3 w-3 inline mr-1" />
                        ) : (
                          <CheckCircle className="h-3 w-3 inline mr-1" />
                        )}
                        Premium
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => handleAcessarConteudo(conteudo)}
                    disabled={isLocked}
                    className="w-full"
                    variant={isLocked ? 'outline' : 'primary'}
                  >
                    {isLocked ? (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Bloqueado
                      </>
                    ) : (
                      <>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Acessar Conteúdo
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {conteudosFiltrados.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum conteúdo encontrado nesta categoria</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
