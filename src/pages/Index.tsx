import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card, CardContent, CardHeader } from '../components/Card';
import { Briefcase, TrendingUp, Users, BookOpen } from 'lucide-react';

export function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Transforme Seu Negócio com NextWork
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Plataforma de consultoria para pequenos negócios alcançarem o sucesso digital
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/auth">
              <Button size="lg">Começar Agora</Button>
            </Link>
            <Link to="/ser-consultor">
              <Button variant="outline" size="lg">Seja um Consultor</Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-center">Diagnóstico Digital</h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Avalie o nível de maturidade digital do seu negócio e receba um roadmap personalizado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mx-auto mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-center">Consultoria Especializada</h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Conecte-se com consultores experientes para impulsionar seu negócio
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 mx-auto mb-4">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-center">Conteúdo Educativo</h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Acesse materiais exclusivos para aprender sobre gestão e marketing digital
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600">
          <CardContent className="py-12">
            <div className="text-center text-white">
              <h2 className="text-3xl font-bold mb-4">Pronto para Crescer?</h2>
              <p className="text-xl mb-8">
                Junte-se a centenas de pequenos negócios que já transformaram sua presença digital
              </p>
              <Link to="/auth">
                <Button variant="outline" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Cadastre-se Gratuitamente
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
