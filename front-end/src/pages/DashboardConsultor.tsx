import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { consultoriaService } from '../services/database';
import { supabase } from '../lib/supabase';
import { Card, CardContent, CardHeader } from '../components/Card';
import { Button } from '../components/Button';
import { Users, CheckCircle, Clock, Calendar, UserCircle, MessageCircle } from 'lucide-react';

export function DashboardConsultor() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [consultorias, setConsultorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState<string | null>(null);

  useEffect(() => {
    loadConsultorias();
  }, []);

  const loadConsultorias = async () => {
    try {
      const data = await consultoriaService.getAll();
      setConsultorias(data);
    } catch (error) {
      console.error('Error loading consultorias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptConsultoria = async (consultoriaId: string) => {
    try {
      setAccepting(consultoriaId);
      await supabase
        .from('consultoria')
        .update({ status: 'Em Andamento' })
        .eq('id_consultoria', consultoriaId);

      await loadConsultorias();
      alert('Consultoria aceita com sucesso!');
    } catch (error) {
      console.error('Error accepting consultoria:', error);
      alert('Erro ao aceitar consultoria');
    } finally {
      setAccepting(null);
    }
  };

  const handleOpenChat = (consultoriaId: string) => {
    navigate(`/chat?consultoria=${consultoriaId}`);
  };

  const pendentes = consultorias.filter(c => c.status === 'Pendente');
  const emAndamento = consultorias.filter(c => c.status === 'Em Andamento');
  const concluidas = consultorias.filter(c => c.status === 'Concluída');

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Bem-vindo, Consultor {usuario?.nome}!
            </h1>
            <p className="text-gray-600 mt-2">Gerencie suas consultorias e ajude empresários a crescer</p>
          </div>
          <Link to="/perfil-consultor">
            <Button>
              <UserCircle className="w-4 h-4 mr-2" />
              Meu Perfil
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold">{consultorias.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pendentes</p>
                  <p className="text-2xl font-bold">{pendentes.length}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Em Andamento</p>
                  <p className="text-2xl font-bold">{emAndamento.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Concluídas</p>
                  <p className="text-2xl font-bold">{concluidas.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Consultorias Pendentes</h2>
            </CardHeader>
            <CardContent>
              {pendentes.length === 0 ? (
                <p className="text-gray-600 text-center py-8">Nenhuma consultoria pendente</p>
              ) : (
                <div className="space-y-3">
                  {pendentes.map((consultoria) => (
                    <div
                      key={consultoria.id_consultoria}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{consultoria.comerciante?.nome}</h3>
                        <p className="text-sm text-gray-600">{consultoria.comerciante?.email}</p>
                        {consultoria.descricao && (
                          <p className="text-sm text-gray-500 mt-2 line-clamp-2">{consultoria.descricao}</p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAcceptConsultoria(consultoria.id_consultoria)}
                        disabled={accepting === consultoria.id_consultoria}
                      >
                        {accepting === consultoria.id_consultoria ? 'Aceitando...' : 'Aceitar'}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Consultorias Em Andamento</h2>
            </CardHeader>
            <CardContent>
              {emAndamento.length === 0 ? (
                <p className="text-gray-600 text-center py-8">Nenhuma consultoria em andamento</p>
              ) : (
                <div className="space-y-3">
                  {emAndamento.map((consultoria) => (
                    <div
                      key={consultoria.id_consultoria}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{consultoria.comerciante?.nome}</h3>
                        <p className="text-sm text-gray-600">{consultoria.comerciante?.email}</p>
                        {consultoria.descricao && (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-1">{consultoria.descricao}</p>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenChat(consultoria.id_consultoria)}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Abrir Chat
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
