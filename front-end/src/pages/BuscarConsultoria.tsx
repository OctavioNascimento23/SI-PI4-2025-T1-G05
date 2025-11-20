import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { Search, Star, Briefcase, MapPin, DollarSign, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function BuscarConsultoria() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - lista expandida de consultores
  const consultores = [
    {
      id: 1,
      nome: "Ana Silva",
      especialidade: "E-commerce & Vendas Online",
      avaliacao: 4.9,
      projetos: 47,
      localizacao: "São Paulo, SP",
      valorHora: "R$ 150 - R$ 250",
      descricao: "Especialista em implementação de plataformas de e-commerce com foco em conversão e experiência do usuário.",
      certificacoes: ["Google Analytics", "Facebook Blueprint", "Shopify Expert"],
      disponibilidade: "Disponível"
    },
    {
      id: 2,
      nome: "Roberto Almeida",
      especialidade: "Transformação Digital",
      avaliacao: 4.9,
      projetos: 52,
      localizacao: "Rio de Janeiro, RJ",
      valorHora: "R$ 200 - R$ 350",
      descricao: "Consultor sênior com experiência em projetos de transformação digital para médias e grandes empresas.",
      certificacoes: ["PMP", "Scrum Master", "ITIL"],
      disponibilidade: "Disponível"
    },
    {
      id: 3,
      nome: "Julia Fernandes",
      especialidade: "Marketing Digital & Estratégia",
      avaliacao: 4.8,
      projetos: 38,
      localizacao: "Belo Horizonte, MG",
      valorHora: "R$ 120 - R$ 200",
      descricao: "Especialista em estratégias de marketing digital, SEO e gestão de campanhas de mídia paga.",
      certificacoes: ["Google Ads", "HubSpot", "SEMrush"],
      disponibilidade: "Disponível"
    },
    {
      id: 4,
      nome: "Pedro Oliveira",
      especialidade: "Analytics & Business Intelligence",
      avaliacao: 4.7,
      projetos: 31,
      localizacao: "Curitiba, PR",
      valorHora: "R$ 180 - R$ 280",
      descricao: "Especialista em análise de dados, dashboards e tomada de decisão baseada em dados.",
      certificacoes: ["Power BI", "Tableau", "Google Data Studio"],
      disponibilidade: "Ocupado"
    },
    {
      id: 5,
      nome: "Mariana Costa",
      especialidade: "Automação de Processos",
      avaliacao: 4.9,
      projetos: 29,
      localizacao: "Porto Alegre, RS",
      valorHora: "R$ 140 - R$ 220",
      descricao: "Consultora especializada em automação de processos empresariais e integração de sistemas.",
      certificacoes: ["Zapier Expert", "Make.com", "UiPath"],
      disponibilidade: "Disponível"
    },
    {
      id: 6,
      nome: "Carlos Santos",
      especialidade: "Gestão de Projetos & Processos",
      avaliacao: 4.8,
      projetos: 44,
      localizacao: "Brasília, DF",
      valorHora: "R$ 160 - R$ 260",
      descricao: "Gestor de projetos com foco em otimização de processos e aumento de eficiência operacional.",
      certificacoes: ["PMP", "Lean Six Sigma", "Agile"],
      disponibilidade: "Disponível"
    }
  ];

  const filteredConsultores = consultores.filter(consultor =>
    consultor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    consultor.especialidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
    consultor.localizacao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Buscar Consultoria</h1>
          <p className="text-muted-foreground">Encontre o consultor ideal para o seu projeto</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Buscar por nome, especialidade ou localização..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Consultores List */}
        <div className="grid lg:grid-cols-2 gap-6">
          {filteredConsultores.map((consultor) => (
            <Card key={consultor.id} className="p-6 hover:shadow-elegant-lg transition-smooth">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-full gradient-hero flex items-center justify-center text-primary-foreground font-bold text-xl shrink-0">
                  {consultor.nome.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{consultor.nome}</h3>
                    <Badge 
                      variant="outline" 
                      className={consultor.disponibilidade === "Disponível" ? "bg-secondary/10 text-secondary border-secondary/20" : "bg-muted text-muted-foreground"}
                    >
                      {consultor.disponibilidade}
                    </Badge>
                  </div>
                  <p className="text-sm text-primary font-medium mb-2">{consultor.especialidade}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-secondary text-secondary" />
                      <span className="font-medium">{consultor.avaliacao}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      <span>{consultor.projetos} projetos</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {consultor.descricao}
              </p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span>{consultor.localizacao}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span>{consultor.valorHora}/hora</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <Award className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="flex flex-wrap gap-1">
                    {consultor.certificacoes.map((cert, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Button 
                variant="hero" 
                size="sm" 
                className="w-full"
                onClick={() => navigate(`/perfil/cliente/${consultor.id}`)}
              >
                Ver Perfil Completo
              </Button>
            </Card>
          ))}
        </div>

        {filteredConsultores.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum consultor encontrado com esses critérios.</p>
          </div>
        )}
      </main>
    </div>
  );
}
