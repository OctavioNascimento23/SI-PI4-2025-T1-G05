import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Calendar, User, TrendingUp, Clock, MessageSquare, BookOpen, UserCog, Edit, MapPin, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DashboardEmpresa() {
  const navigate = useNavigate();
  
  // Mock data - Perfil do Cliente
  const perfilCliente = {
    nome: "Tech Solutions Brasil",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Tech Solutions",
    setor: "Tecnologia",
    localizacao: "São Paulo, SP",
    sobreMim: "Empresa líder em soluções tecnológicas para o mercado corporativo. Buscamos sempre inovação e excelência em transformação digital para nossos clientes.",
    membroDesde: "Janeiro 2024"
  };
  
  const projetos = [
    {
      id: 1,
      nome: "Implementação de E-commerce",
      consultor: "Ana Silva",
      status: "Em andamento",
      dataInicio: "15/03/2024",
      prazo: "15/06/2024",
      proximasAtividades: [
        { tipo: "reunião", descricao: "Reunião de Alinhamento", data: "23/11/2025" },
        { tipo: "curso", descricao: "Módulo 2: Pagamentos Online", prazo: "25/11/2025" }
      ]
    },
    {
      id: 2,
      nome: "Automação de Processos",
      consultor: "Carlos Santos",
      status: "Aguardando início",
      dataInicio: "01/04/2024",
      prazo: "30/04/2024",
      proximasAtividades: [
        { tipo: "reunião", descricao: "Kickoff Meeting", data: "20/11/2025" }
      ]
    },
    {
      id: 3,
      nome: "Estratégia de Marketing Digital",
      consultor: "Mariana Costa",
      status: "Concluído",
      dataInicio: "10/01/2024",
      prazo: "10/03/2024",
      proximasAtividades: []
    }
  ];

  const consultoresSugeridos = [
    {
      id: 1,
      nome: "Roberto Almeida",
      especialidade: "Transformação Digital",
      avaliacao: 4.9,
      projetos: 47
    },
    {
      id: 2,
      nome: "Julia Fernandes",
      especialidade: "E-commerce & Vendas",
      avaliacao: 4.8,
      projetos: 32
    },
    {
      id: 3,
      nome: "Pedro Oliveira",
      especialidade: "Analytics & BI",
      avaliacao: 4.7,
      projetos: 28
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em andamento":
        return "bg-primary/10 text-primary border-primary/20";
      case "Aguardando início":
        return "bg-muted text-muted-foreground border-border";
      case "Concluído":
        return "bg-secondary/10 text-secondary border-secondary/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Botão Aba do Consultor */}
        <div className="mb-6">
          <Button 
            variant="hero" 
            size="lg"
            onClick={() => navigate('/dashboard/consultor')}
            className="w-full sm:w-auto"
          >
            <UserCog className="w-5 h-5" />
            Aba do Consultor
          </Button>
        </div>

        {/* Perfil do Cliente */}
        <Card className="mb-8">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-primary/10">
                  <AvatarImage src={perfilCliente.avatar} alt={perfilCliente.nome} />
                  <AvatarFallback className="text-2xl font-bold bg-gradient-hero text-primary-foreground">
                    {perfilCliente.nome.split(' ').map(n => n[0]).join('').substring(0, 2)}
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
                    <h2 className="text-2xl font-bold mb-1">{perfilCliente.nome}</h2>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        <span>{perfilCliente.setor}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{perfilCliente.localizacao}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Membro desde {perfilCliente.membroDesde}</span>
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
                    {perfilCliente.sobreMim}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Painel do Cliente</h1>
            <p className="text-muted-foreground">Gerencie suas consultorias e projetos</p>
          </div>
          <Button variant="hero" size="lg" className="group">
            <Plus className="w-5 h-5" />
            Nova Consultoria
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Projetos Ativos</p>
                <p className="text-2xl font-bold">2</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Concluídos</p>
                <p className="text-2xl font-bold">1</p>
              </div>
              <Calendar className="w-8 h-8 text-secondary" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Horas Investidas</p>
                <p className="text-2xl font-bold">124</p>
              </div>
              <Clock className="w-8 h-8 text-primary" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Consultores</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <User className="w-8 h-8 text-secondary" />
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Consultas */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-4">Minhas Consultas</h2>
            <div className="space-y-4">
              {projetos.map((projeto) => (
                <Card key={projeto.id} className="p-6 hover:shadow-elegant-lg transition-smooth">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{projeto.nome}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <User className="w-4 h-4" />
                        <span>{projeto.consultor}</span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(projeto.status)} variant="outline">
                      {projeto.status}
                    </Badge>
                  </div>
                  
                  {/* Próximas Atividades */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-3">Próximas Atividades</h4>
                    {projeto.proximasAtividades.length > 0 ? (
                      <div className="space-y-2">
                        {projeto.proximasAtividades.map((atividade, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm p-2 rounded-md bg-muted/50">
                            {atividade.tipo === "reunião" ? (
                              <Calendar className="w-4 h-4 text-primary" />
                            ) : (
                              <BookOpen className="w-4 h-4 text-secondary" />
                            )}
                            <div className="flex-1">
                              <p className="font-medium">{atividade.descricao}</p>
                              <p className="text-xs text-muted-foreground">
                                {atividade.data || atividade.prazo}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Nenhuma atividade pendente</p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => navigate(`/chat/${projeto.id}`)}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Chat com Consultor
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Consultores Sugeridos */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Consultores Sugeridos</h2>
            <div className="space-y-4">
              {consultoresSugeridos.map((consultor) => (
                <Card key={consultor.id} className="p-6 hover:shadow-elegant-lg transition-smooth">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full gradient-hero flex items-center justify-center text-primary-foreground font-semibold">
                      {consultor.nome.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{consultor.nome}</h3>
                      <p className="text-sm text-muted-foreground">{consultor.especialidade}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="flex items-center gap-1">
                      <span className="text-2xl">⭐</span>
                      <span className="font-medium">{consultor.avaliacao}</span>
                    </div>
                    <span className="text-muted-foreground">{consultor.projetos} projetos</span>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => navigate(`/perfil/cliente/${consultor.id}`)}
                  >
                    Ver Perfil
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
