import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Calendar, DollarSign, Star, TrendingUp, Briefcase, Edit, MapPin, Award, User, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DashboardConsultor() {
  const navigate = useNavigate();
  
  // Mock data - Perfil do Consultor
  const perfilConsultor = {
    nome: "Roberto Almeida",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto",
    especialidade: "Transformação Digital",
    localizacao: "São Paulo, SP",
    sobreMim: "Consultor especializado em transformação digital com mais de 10 anos de experiência. Ajudo empresas a inovarem e otimizarem seus processos através de tecnologia. Apaixonado por resolver problemas complexos e criar soluções eficientes.",
    avaliacaoMedia: 4.9,
    projetosConcluidos: 47,
    membroDesde: "Março 2020"
  };
  
  const demandas = [
    {
      id: 1,
      cliente: "TechStart Ltda",
      setor: "E-commerce",
      titulo: "Implementação de plataforma de vendas online",
      orcamento: "R$ 15.000 - R$ 20.000",
      prazo: "3 meses",
      dataPublicacao: "2 dias atrás"
    },
    {
      id: 2,
      cliente: "Inovare Consultoria",
      setor: "Automação",
      titulo: "Sistema de gestão automatizado",
      orcamento: "R$ 8.000 - R$ 12.000",
      prazo: "2 meses",
      dataPublicacao: "5 dias atrás"
    },
    {
      id: 3,
      cliente: "Digital Plus",
      setor: "Marketing",
      titulo: "Estratégia de marketing digital completa",
      orcamento: "R$ 5.000 - R$ 8.000",
      prazo: "1 mês",
      dataPublicacao: "1 semana atrás"
    }
  ];

  const consultasConcluidas = [
    { mes: "Jan", quantidade: 8 },
    { mes: "Fev", quantidade: 12 },
    { mes: "Mar", quantidade: 15 }
  ];

  const clientesAtivos = [
    {
      id: 1,
      nome: "TechStart Ltda",
      projeto: "Implementação de E-commerce",
      status: "Em andamento",
      ultimaMensagem: "Enviado ontem",
      avatar: "TS"
    },
    {
      id: 2,
      nome: "Inovare Consultoria",
      projeto: "Sistema de Gestão Automatizado",
      status: "Em andamento",
      ultimaMensagem: "Há 2 dias",
      avatar: "IC"
    },
    {
      id: 3,
      nome: "Digital Plus",
      projeto: "Estratégia de Marketing Digital",
      status: "Aguardando início",
      ultimaMensagem: "Há 5 dias",
      avatar: "DP"
    }
  ];

  const feedbacks = [
    {
      id: 1,
      cliente: "Moda Urbana",
      avaliacao: 5,
      comentario: "Excelente trabalho! Superou nossas expectativas na implementação do e-commerce.",
      data: "10/03/2024"
    },
    {
      id: 2,
      cliente: "Smart Business",
      avaliacao: 5,
      comentario: "Profissional muito competente. Entregou tudo no prazo e com qualidade excepcional.",
      data: "25/02/2024"
    }
  ];

  const maxConsultas = Math.max(...consultasConcluidas.map(c => c.quantidade));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Botão Aba do Cliente */}
        <div className="mb-6">
          <Button 
            variant="hero" 
            size="lg"
            onClick={() => navigate('/dashboard/empresa')}
            className="w-full sm:w-auto"
          >
            <User className="w-5 h-5" />
            Aba do Cliente
          </Button>
        </div>

        {/* Perfil do Consultor */}
        <Card className="mb-8">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-primary/10">
                  <AvatarImage src={perfilConsultor.avatar} alt={perfilConsultor.nome} />
                  <AvatarFallback className="text-2xl font-bold bg-gradient-hero text-primary-foreground">
                    {perfilConsultor.nome.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  size="icon" 
                  variant="secondary" 
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full shadow-elegant"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{perfilConsultor.nome}</h2>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        <span>{perfilConsultor.especialidade}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{perfilConsultor.localizacao}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Membro desde {perfilConsultor.membroDesde}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-secondary text-secondary" />
                        <span className="font-semibold">{perfilConsultor.avaliacaoMedia}</span>
                        <span className="text-muted-foreground">avaliação</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4 text-primary" />
                        <span className="font-semibold">{perfilConsultor.projetosConcluidos}</span>
                        <span className="text-muted-foreground">projetos</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Editar Perfil
                  </Button>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold mb-2">Sobre Mim</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {perfilConsultor.sobreMim}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Painel do Consultor</h1>
          <p className="text-muted-foreground">Gerencie suas propostas e consultorias</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Demandas Abertas</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <Briefcase className="w-8 h-8 text-primary" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Propostas Enviadas</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <Send className="w-8 h-8 text-secondary" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Taxa de Aceitação</p>
                <p className="text-2xl font-bold">75%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avaliação Média</p>
                <p className="text-2xl font-bold">4.9</p>
              </div>
              <Star className="w-8 h-8 text-secondary" />
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Demandas Abertas */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-4">Demandas Abertas</h2>
            <div className="space-y-4">
              {demandas.map((demanda) => (
                <Card key={demanda.id} className="p-6 hover:shadow-elegant-lg transition-smooth">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="bg-accent">
                          {demanda.setor}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{demanda.dataPublicacao}</span>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{demanda.titulo}</h3>
                      <p className="text-sm text-muted-foreground mb-3">Cliente: {demanda.cliente}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span>{demanda.orcamento}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>Prazo: {demanda.prazo}</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="hero" 
                    size="sm" 
                    className="w-full"
                    onClick={() => navigate("/proposta")}
                  >
                    <Send className="w-4 h-4" />
                    Enviar Proposta
                  </Button>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Meus Clientes */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Meus Clientes</h2>
              <div className="space-y-4">
                {clientesAtivos.map((cliente) => (
                  <Card key={cliente.id} className="p-6 hover:shadow-elegant-lg transition-smooth">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full gradient-hero flex items-center justify-center text-primary-foreground font-semibold shrink-0">
                        {cliente.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm mb-1">{cliente.nome}</h3>
                        <p className="text-xs text-muted-foreground mb-1 truncate">{cliente.projeto}</p>
                        <p className="text-xs text-muted-foreground">{cliente.ultimaMensagem}</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => navigate(`/chat/${cliente.id}`)}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Abrir Chat
                    </Button>
                  </Card>
                ))}
              </div>
            </div>

            {/* Performance Chart */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Consultas Concluídas</h2>
              <Card className="p-6">
                <div className="space-y-4">
                  {consultasConcluidas.map((item) => (
                    <div key={item.mes}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">{item.mes}</span>
                        <span className="text-muted-foreground">{item.quantidade} consultas</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full gradient-success transition-all duration-500"
                          style={{ width: `${(item.quantidade / maxConsultas) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Feedback */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Feedback de Clientes</h2>
              <div className="space-y-4">
                {feedbacks.map((feedback) => (
                  <Card key={feedback.id} className="p-6">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(feedback.avaliacao)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                      ))}
                    </div>
                    <p className="text-sm mb-3">{feedback.comentario}</p>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{feedback.cliente}</span>
                      <span>{feedback.data}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
