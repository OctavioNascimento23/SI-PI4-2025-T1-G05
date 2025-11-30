import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { diagnosticoService, roadmapService } from '../services/database';
import { Card, CardContent, CardHeader } from '../components/Card';
import { Button } from '../components/Button';
import { Map, CheckCircle, Clock, ArrowLeft } from 'lucide-react';
import { Roadmap as RoadmapType, Diagnostico } from '../lib/supabase';

export function Roadmap() {
  const { negocioId } = useParams<{ negocioId: string }>();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState<RoadmapType | null>(null);
  const [diagnostico, setDiagnostico] = useState<Diagnostico | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    loadData();
  }, [negocioId]);

  const loadData = async () => {
    if (!negocioId) return;

    try {
      const diagnosticos = await diagnosticoService.getByNegocio(negocioId);
      if (diagnosticos.length > 0) {
        const ultimoDiagnostico = diagnosticos[0];
        setDiagnostico(ultimoDiagnostico);

        const roadmapData = await roadmapService.getByDiagnostico(ultimoDiagnostico.id_diagnostico);
        setRoadmap(roadmapData);
      }
    } catch (error) {
      console.error('Error loading roadmap:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!roadmap) return;

    try {
      setUpdatingStatus(true);
      const novoStatus = roadmap.status === 'Em andamento' ? 'Concluído' : 'Em andamento';
      await roadmapService.updateStatus(roadmap.id_roadmap, novoStatus);
      setRoadmap({ ...roadmap, status: novoStatus });
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Erro ao atualizar status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Carregando roadmap...</div>
      </div>
    );
  }

  if (!roadmap || !diagnostico) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <Map className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Nenhum roadmap encontrado para este negócio</p>
              <p className="text-sm text-gray-500 mb-6">
                Realize um diagnóstico digital primeiro para gerar um roadmap personalizado
              </p>
              <Button onClick={() => navigate(`/negocio/${negocioId}/diagnostico`)}>
                Realizar Diagnóstico
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const etapas = roadmap.etapas_detalhadas?.split('\n').filter(e => e.trim()) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard-empresa')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Dashboard
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center">
                  <Map className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Roadmap de Transformação Digital</h1>
                  <p className="text-gray-600">Seu plano de ação personalizado</p>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    roadmap.status === 'Concluído'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}
                >
                  {roadmap.status === 'Concluído' ? (
                    <CheckCircle className="h-4 w-4 mr-1" />
                  ) : (
                    <Clock className="h-4 w-4 mr-1" />
                  )}
                  {roadmap.status}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Pontuação Digital</div>
                <div className="text-3xl font-bold text-blue-600">{diagnostico.pontuacao_digital}</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Data do Diagnóstico</div>
                <div className="text-lg font-semibold text-purple-900">
                  {new Date(diagnostico.data_diagnostico).toLocaleDateString('pt-BR')}
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Etapas</div>
                <div className="text-3xl font-bold text-green-600">{etapas.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-xl font-semibold">Etapas do Roadmap</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {etapas.map((etapa, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-semibold text-sm">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">{etapa}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Ações</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button
                onClick={handleUpdateStatus}
                disabled={updatingStatus}
                className="w-full"
              >
                {updatingStatus
                  ? 'Atualizando...'
                  : roadmap.status === 'Em andamento'
                  ? 'Marcar como Concluído'
                  : 'Reabrir Roadmap'}
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate(`/negocio/${negocioId}/diagnostico`)}
                className="w-full"
              >
                Realizar Novo Diagnóstico
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate('/buscar-consultoria')}
                className="w-full"
              >
                Buscar Ajuda de um Consultor
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
