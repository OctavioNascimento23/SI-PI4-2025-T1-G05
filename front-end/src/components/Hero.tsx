import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium shadow-elegant">
            <Zap className="w-4 h-4" />
            <span>Transforme seu negócio digitalmente</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Conectando{" "}
            <span className="text-primary font-bold">
              empresas
            </span>{" "}
            e{" "}
            <span className="text-primary font-bold">
              especialistas
            </span>{" "}
            para crescer com eficiência
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Plataforma completa de consultoria tecnológica que facilita a digitalização 
            do seu negócio através de diagnósticos inteligentes e suporte especializado.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link to="/dashboard/empresa">
              <Button variant="hero" size="lg" className="group">
                Encontrar Consultor
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/dashboard/consultor">
              <Button variant="outline" size="lg">
                Oferecer Consultoria
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-card rounded-xl p-8 shadow-elegant hover:shadow-elegant-lg transition-smooth">
            <div className="w-12 h-12 rounded-lg gradient-hero flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Plataforma Segura</h3>
            <p className="text-muted-foreground">
              Todas as interações são protegidas com criptografia de ponta a ponta 
              e processos de verificação rigorosos.
            </p>
          </div>

          <div className="bg-card rounded-xl p-8 shadow-elegant hover:shadow-elegant-lg transition-smooth">
            <div className="w-12 h-12 rounded-lg gradient-success flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-secondary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Conexões Rápidas</h3>
            <p className="text-muted-foreground">
              Algoritmo inteligente de match que conecta sua empresa com o 
              consultor ideal em minutos.
            </p>
          </div>

          <div className="bg-card rounded-xl p-8 shadow-elegant hover:shadow-elegant-lg transition-smooth">
            <div className="w-12 h-12 rounded-lg gradient-hero flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Resultados Mensuráveis</h3>
            <p className="text-muted-foreground">
              Acompanhe o progresso com métricas claras e dashboards 
              intuitivos para medir o ROI.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
