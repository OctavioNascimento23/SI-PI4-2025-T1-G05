import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { diagnosticoService, roadmapService } from '../services/database';
import { Card, CardContent, CardHeader } from '../components/Card';
import { Button } from '../components/Button';
import { BarChart3, CheckCircle } from 'lucide-react';

interface DiagnosticoFormData {
  presenca_online: string;
  uso_redes_sociais: string;
  ecommerce: string;
  gestao_digital: string;
  marketing_digital: string;
}

const perguntas = [
  {
    id: 'presenca_online',
    pergunta: 'Seu negócio tem presença online (site, redes sociais)?',
    opcoes: [
      { valor: '0', texto: 'Não tem presença online' },
      { valor: '25', texto: 'Tem redes sociais básicas' },
      { valor: '50', texto: 'Tem redes sociais ativas' },
      { valor: '75', texto: 'Tem site e redes sociais' },
      { valor: '100', texto: 'Presença online completa e profissional' },
    ],
  },
  {
    id: 'uso_redes_sociais',
    pergunta: 'Com que frequência você posta nas redes sociais?',
    opcoes: [
      { valor: '0', texto: 'Nunca ou raramente' },
      { valor: '25', texto: 'Uma vez por mês' },
      { valor: '50', texto: 'Uma vez por semana' },
      { valor: '75', texto: 'Várias vezes por semana' },
      { valor: '100', texto: 'Diariamente com estratégia definida' },
    ],
  },
  {
    id: 'ecommerce',
    pergunta: 'Você vende produtos/serviços online?',
    opcoes: [
      { valor: '0', texto: 'Não vendo online' },
      { valor: '25', texto: 'Apenas por WhatsApp' },
      { valor: '50', texto: 'Por redes sociais e WhatsApp' },
      { valor: '75', texto: 'Tenho catálogo online' },
      { valor: '100', texto: 'Tenho e-commerce completo' },
    ],
  },
  {
    id: 'gestao_digital',
    pergunta: 'Como você gerencia seu negócio?',
    opcoes: [
      { valor: '0', texto: 'Papel e caneta' },
      { valor: '25', texto: 'Planilhas básicas' },
      { valor: '50', texto: 'Planilhas avançadas' },
      { valor: '75', texto: 'Sistema básico de gestão' },
      { valor: '100', texto: 'ERP completo integrado' },
    ],
  },
  {
    id: 'marketing_digital',
    pergunta: 'Você investe em marketing digital?',
    opcoes: [
      { valor: '0', texto: 'Não invisto' },
      { valor: '25', texto: 'Apenas divulgação orgânica' },
      { valor: '50', texto: 'Investimento esporádico' },
      { valor: '75', texto: 'Investimento mensal pequeno' },
      { valor: '100', texto: 'Investimento estratégico regular' },
    ],
  },
];

export function Diagnostico() {
  const { negocioId } = useParams<{ negocioId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resultado, setResultado] = useState<{ pontuacao: number; nivel: string } | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<DiagnosticoFormData>();

  const calcularPontuacao = (respostas: DiagnosticoFormData): number => {
    const valores = Object.values(respostas).map(v => parseInt(v));
    return Math.round(valores.reduce((a, b) => a + b, 0) / valores.length);
  };

  const getNivel = (pontuacao: number): string => {
    if (pontuacao < 20) return 'Iniciante - Precisa urgentemente de digitalização';
    if (pontuacao < 40) return 'Básico - Começando a jornada digital';
    if (pontuacao < 60) return 'Intermediário - Progredindo na transformação digital';
    if (pontuacao < 80) return 'Avançado - Boa maturidade digital';
    return 'Expert - Excelente maturidade digital';
  };

  const gerarRoadmap = (pontuacao: number): string => {
    const etapas: string[] = [];

    if (pontuacao < 40) {
      etapas.push('1. Criar presença online básica (Instagram e Facebook)');
      etapas.push('2. Configurar WhatsApp Business');
      etapas.push('3. Começar a postar regularmente nas redes sociais');
    }

    if (pontuacao < 60) {
      etapas.push('4. Criar site profissional ou landing page');
      etapas.push('5. Implementar catálogo de produtos online');
      etapas.push('6. Começar a usar ferramentas de gestão digital');
    }

    if (pontuacao < 80) {
      etapas.push('7. Implementar e-commerce ou vendas online');
      etapas.push('8. Investir em marketing digital pago');
      etapas.push('9. Integrar sistemas de gestão (ERP)');
    }

    if (pontuacao >= 80) {
      etapas.push('10. Otimizar estratégias de marketing digital');
      etapas.push('11. Implementar automações e IA');
      etapas.push('12. Expandir canais de venda digital');
    }

    return etapas.join('\n');
  };

  const onSubmit = async (data: DiagnosticoFormData) => {
    if (!negocioId) return;

    try {
      setLoading(true);
      setError('');

      const pontuacao = calcularPontuacao(data);
      const nivel = getNivel(pontuacao);

      const diagnostico = await diagnosticoService.create({
        id_negocio: negocioId,
        respostas_json: data,
        pontuacao_digital: pontuacao,
      });

      const etapasRoadmap = gerarRoadmap(pontuacao);
      await roadmapService.create({
        id_diagnostico: diagnostico.id_diagnostico,
        etapas_detalhadas: etapasRoadmap,
        status: 'Em andamento',
      });

      setResultado({ pontuacao, nivel });
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar diagnóstico');
    } finally {
      setLoading(false);
    }
  };

  if (resultado) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardHeader>
              <div className="text-center">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-gray-900">Diagnóstico Concluído!</h1>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-8">
                <div className="inline-block">
                  <div className="text-6xl font-bold text-blue-600 mb-2">{resultado.pontuacao}</div>
                  <div className="text-sm text-gray-600">Pontuação Digital</div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Nível de Maturidade Digital</h3>
                <p className="text-blue-800">{resultado.nivel}</p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-green-900 mb-2">Próximos Passos</h3>
                <p className="text-green-800">
                  Um roadmap personalizado foi criado com as etapas recomendadas para melhorar sua presença digital.
                  Você pode visualizá-lo no seu dashboard.
                </p>
              </div>

              <Button onClick={() => navigate('/dashboard-empresa')} className="w-full">
                Ir para Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Diagnóstico Digital</h1>
                <p className="text-gray-600">Avalie o nível de maturidade digital do seu negócio</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {perguntas.map((pergunta, index) => (
                <div key={pergunta.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <label className="block text-lg font-medium text-gray-900 mb-4">
                    {index + 1}. {pergunta.pergunta}
                  </label>
                  <div className="space-y-2">
                    {pergunta.opcoes.map((opcao) => (
                      <label
                        key={opcao.valor}
                        className="flex items-start p-3 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-colors"
                      >
                        <input
                          type="radio"
                          value={opcao.valor}
                          {...register(pergunta.id as keyof DiagnosticoFormData, {
                            required: 'Por favor, selecione uma opção',
                          })}
                          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-gray-700">{opcao.texto}</span>
                      </label>
                    ))}
                  </div>
                  {errors[pergunta.id as keyof DiagnosticoFormData] && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors[pergunta.id as keyof DiagnosticoFormData]?.message}
                    </p>
                  )}
                </div>
              ))}

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard-empresa')}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Analisando...' : 'Gerar Diagnóstico'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
