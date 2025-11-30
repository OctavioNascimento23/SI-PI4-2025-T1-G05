import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usuarioService, consultoriaService } from '../services/database';
import { Card, CardContent, CardHeader } from '../components/Card';
import { Button } from '../components/Button';
import { User, Star, X, Send, Briefcase, Mail, Phone } from 'lucide-react';
import { Usuario } from '../lib/supabase';

export function BuscarConsultoria() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [consultores, setConsultores] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState<string | null>(null);
  const [selectedConsultor, setSelectedConsultor] = useState<Usuario | null>(null);
  const [descricao, setDescricao] = useState('');

  useEffect(() => {
    loadConsultores();
  }, []);

  const loadConsultores = async () => {
    try {
      const data = await usuarioService.getConsultores();
      setConsultores(data);
    } catch (error) {
      console.error('Error loading consultores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (consultor: Usuario) => {
    setSelectedConsultor(consultor);
    setDescricao('');
  };

  const handleCloseModal = () => {
    setSelectedConsultor(null);
    setDescricao('');
  };

  const handleSolicitarConsultoria = async () => {
    if (!usuario || !selectedConsultor) return;

    try {
      setRequesting(selectedConsultor.id_usuario);
      await consultoriaService.create({
        id_usuario_comerciante: usuario.id_usuario,
        id_usuario_consultor: selectedConsultor.id_usuario,
        descricao: descricao.trim() || undefined,
      });

      alert('Solicitação de consultoria enviada com sucesso!');
      handleCloseModal();
      navigate('/dashboard-empresa');
    } catch (error) {
      console.error('Error requesting consultoria:', error);
      alert('Erro ao solicitar consultoria');
    } finally {
      setRequesting(null);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Buscar Consultoria</h1>
          <p className="text-gray-600 mt-2">Encontre consultores especializados para ajudar seu negócio</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {consultores.map((consultor) => (
            <Card key={consultor.id_usuario}>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{consultor.nome}</h3>
                    <div className="flex items-center text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Email:</span> {consultor.email}
                  </p>
                  {consultor.telefone && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Telefone:</span> {consultor.telefone}
                    </p>
                  )}
                  {consultor.bio && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {consultor.bio}
                    </p>
                  )}
                </div>
                <Button
                  className="w-full"
                  onClick={() => handleOpenModal(consultor)}
                >
                  Solicitar Consultoria
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {consultores.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600">Nenhum consultor disponível no momento</p>
            </CardContent>
          </Card>
        )}
      </div>

      {selectedConsultor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedConsultor.nome}</h2>
                    <p className="text-blue-100 mt-1">Consultor Profissional</p>
                    <div className="flex items-center gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(selectedConsultor.nota_media || 0)
                              ? 'fill-yellow-300 text-yellow-300'
                              : 'text-white/30'
                          }`}
                        />
                      ))}
                      <span className="text-sm ml-2 text-blue-100">
                        ({selectedConsultor.total_avaliacoes || 0} avaliações)
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900">{selectedConsultor.email}</p>
                  </div>
                </div>
                {selectedConsultor.telefone && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-500">Telefone</p>
                      <p className="text-sm font-medium text-gray-900">{selectedConsultor.telefone}</p>
                    </div>
                  </div>
                )}
              </div>

              {selectedConsultor.bio && (
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                  <h3 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Sobre o Consultor
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{selectedConsultor.bio}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Descreva sua necessidade
                </label>
                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Conte um pouco sobre seu negócio e o que você precisa. Quanto mais detalhes, melhor o consultor poderá te ajudar..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={6}
                  maxLength={1000}
                />
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {descricao.length}/1000 caracteres
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleSolicitarConsultoria}
                  disabled={requesting === selectedConsultor.id_usuario}
                  className="flex-1"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {requesting === selectedConsultor.id_usuario ? 'Enviando...' : 'Enviar Solicitação'}
                </Button>
                <Button
                  onClick={handleCloseModal}
                  variant="outline"
                  disabled={requesting === selectedConsultor.id_usuario}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
