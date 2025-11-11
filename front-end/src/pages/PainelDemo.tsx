import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, FileText, Users, BarChart3, Settings } from "lucide-react";

const PainelDemo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Olá, Usuário Demo!</span>
            <Button variant="outline" size="sm">
              Sair
            </Button>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Bem-vindo ao seu{" "}
            <span className="gradient-hero bg-clip-text text-transparent">
              Painel NextWork
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Este é um painel demonstrativo. Aqui você poderá gerenciar seus projetos, 
            conectar-se com consultores e acompanhar o progresso da sua transformação digital.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Link to="/dashboard/empresa">
            <div className="bg-card rounded-xl p-8 shadow-elegant hover:shadow-elegant-lg transition-smooth cursor-pointer group">
              <div className="w-12 h-12 rounded-lg gradient-hero flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Criar Diagnóstico</h3>
              <p className="text-muted-foreground">
                Inicie seu primeiro diagnóstico de maturidade digital e descubra 
                oportunidades de crescimento.
              </p>
            </div>
          </Link>

          <Link to="/dashboard/consultor">
            <div className="bg-card rounded-xl p-8 shadow-elegant hover:shadow-elegant-lg transition-smooth cursor-pointer group">
              <div className="w-12 h-12 rounded-lg gradient-success flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Encontrar Consultor</h3>
              <p className="text-muted-foreground">
                Navegue por consultores especializados e encontre o parceiro ideal 
                para sua jornada.
              </p>
            </div>
          </Link>

          <div className="bg-card rounded-xl p-8 shadow-elegant hover:shadow-elegant-lg transition-smooth cursor-pointer group">
            <div className="w-12 h-12 rounded-lg gradient-hero flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Métricas e Relatórios</h3>
            <p className="text-muted-foreground">
              Acompanhe seus indicadores de progresso e resultados em tempo real.
            </p>
          </div>

          <div className="bg-card rounded-xl p-8 shadow-elegant hover:shadow-elegant-lg transition-smooth cursor-pointer group">
            <div className="w-12 h-12 rounded-lg gradient-success flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Settings className="w-6 h-6 text-secondary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Configurações</h3>
            <p className="text-muted-foreground">
              Personalize sua experiência e gerencie as preferências da sua conta.
            </p>
          </div>
        </div>

        {/* Info Notice */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-accent/20 border border-accent rounded-lg p-6 text-center">
            <p className="text-sm text-accent-foreground">
              <strong>Modo Demonstrativo:</strong> Esta é uma versão de demonstração sem backend. 
              As funcionalidades completas estarão disponíveis em breve.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PainelDemo;
