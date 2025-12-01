import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '../components/Card';
import { Button } from '../components/Button';
import { CheckCircle, Users, Calendar, TrendingUp, Award, DollarSign } from 'lucide-react';

export function SerConsultor() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Seja um Consultor NextWork
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Ajude pequenos negócios a crescer e ganhe experiência em consultoria empresarial
          </p>
          <Link to="/auth">
            <Button size="lg">Cadastrar como Consultor</Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mx-auto mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-center">Ajude Empresários</h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Conecte-se com comerciantes que precisam de orientação para transformar seus negócios
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-center">Ganhe Experiência</h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Desenvolva suas habilidades de consultoria trabalhando com casos reais
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 mx-auto mb-4">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-center">Construa Portfólio</h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Crie um histórico de consultorias bem-sucedidas para impulsionar sua carreira
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-3xl font-bold text-center">Como Funciona</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 text-white font-bold">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Cadastre-se como Consultor</h3>
                  <p className="text-gray-600">
                    Crie sua conta fornecendo informações sobre sua formação e experiência
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 text-white font-bold">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Receba Solicitações</h3>
                  <p className="text-gray-600">
                    Empresários interessados em consultoria entrarão em contato com você
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 text-white font-bold">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Realize Consultorias</h3>
                  <p className="text-gray-600">
                    Agende reuniões, analise negócios e forneça orientações estratégicas
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 text-white font-bold">
                    4
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Acompanhe Resultados</h3>
                  <p className="text-gray-600">
                    Monitore o progresso dos seus clientes e ajuste as estratégias conforme necessário
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold">Requisitos</h2>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <span>Estar cursando ou ter concluído curso superior</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <span>Conhecimento em gestão de negócios ou marketing</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <span>Disponibilidade para atendimento online</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <span>Comunicação clara e didática</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <span>Comprometimento com os resultados dos clientes</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold">Benefícios</h2>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <DollarSign className="h-5 w-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <span>Possibilidade de ganhos financeiros</span>
                </li>
                <li className="flex items-start">
                  <Calendar className="h-5 w-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                  <span>Horários flexíveis</span>
                </li>
                <li className="flex items-start">
                  <TrendingUp className="h-5 w-5 text-purple-600 mr-3 mt-1 flex-shrink-0" />
                  <span>Experiência prática em consultoria</span>
                </li>
                <li className="flex items-start">
                  <Award className="h-5 w-5 text-orange-600 mr-3 mt-1 flex-shrink-0" />
                  <span>Certificado de consultor (em breve)</span>
                </li>
                <li className="flex items-start">
                  <Users className="h-5 w-5 text-pink-600 mr-3 mt-1 flex-shrink-0" />
                  <span>Networking com empreendedores</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold mb-4">Pronto para Começar?</h2>
              <p className="text-xl mb-8 opacity-90">
                Cadastre-se agora e comece a ajudar negócios a crescer
              </p>
              <Link to="/auth">
                <Button variant="outline" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Cadastrar Agora
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
