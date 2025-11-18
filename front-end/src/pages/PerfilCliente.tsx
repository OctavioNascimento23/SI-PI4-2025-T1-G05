import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { 
  Building2, 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  Calendar, 
  Briefcase, 
  Star,
  MessageSquare,
  TrendingUp,
  UserCog
} from "lucide-react";

export default function PerfilCliente() {
  const navigate = useNavigate();
  
  // Mock data
  const cliente = {
    nome: "Tech Solutions Brasil",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Tech Solutions",
    setor: "Tecnologia",
    localizacao: "São Paulo, SP",
    email: "contato@techsolutions.com.br",
    telefone: "+55 11 98765-4321",
    website: "www.techsolutions.com.br",
    dataCadastro: "Janeiro 2024",
    descricao: "Empresa líder em soluções tecnológicas para o mercado corporativo, especializada em transformação digital e inovação.",
    totalProjetos: 12,
    projetosAtivos: 3,
    avaliacaoMedia: 4.8,
    totalGasto: "R$ 180.000"
  };

  const projetosRecentes = [
    {
      id: 1,
      titulo: "Desenvolvimento de App Mobile",
      consultor: "Maria Silva",
      status: "Em andamento",
      valor: "R$ 25.000",
      inicio: "15/04/2024"
    },
    {
      id: 2,
      titulo: "Consultoria em Cloud Computing",
      consultor: "João Santos",
      status: "Concluído",
      valor: "R$ 18.000",
      inicio: "10/03/2024"
    },
    {
      id: 3,
      titulo: "Redesign de Plataforma Web",
      consultor: "Ana Costa",
      status: "Em andamento",
      valor: "R$ 32.000",
      inicio: "01/04/2024"
    }
  ];

  const avaliacoes = [
    {
      id: 1,
      projeto: "Sistema de Gestão",
      consultor: "Carlos Mendes",
      nota: 5,
      comentario: "Excelente trabalho! Superou nossas expectativas e entregou antes do prazo.",
      data: "20/03/2024"
    },
    {
      id: 2,
      projeto: "Análise de Dados",
      consultor: "Patricia Lima",
      nota: 5,
      comentario: "Profissionalismo exemplar e comunicação clara durante todo o projeto.",
      data: "15/02/2024"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em andamento":
        return "bg-blue-500";
      case "Concluído":
        return "bg-green-500";
      default:
        return "bg-gray-500";
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
            onClick={() => navigate('/dashboard-consultor')}
            className="w-full sm:w-auto"
          >
            <UserCog className="w-5 h-5" />
            Aba do Consultor
          </Button>
        </div>

        {/* Header do Perfil */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <Avatar className="h-24 w-24">
                <AvatarImage src={cliente.avatar} alt={cliente.nome} />
                <AvatarFallback>{cliente.nome.substring(0, 2)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{cliente.nome}</h1>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="secondary">{cliente.setor}</Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {cliente.localizacao}
                      </Badge>
                    </div>
                  </div>
                  
                  <Button variant="hero" size="lg">
                    <MessageSquare className="w-4 h-4" />
                    Enviar Mensagem
                  </Button>
                </div>
                
                <p className="text-muted-foreground mb-4">{cliente.descricao}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{cliente.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{cliente.telefone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <span>{cliente.website}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Membro desde {cliente.dataCadastro}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Projetos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                <span className="text-2xl font-bold">{cliente.totalProjetos}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Projetos Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="text-2xl font-bold">{cliente.projetosAtivos}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avaliação Média
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="text-2xl font-bold">{cliente.avaliacaoMedia}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Investido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                <span className="text-2xl font-bold">{cliente.totalGasto}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Projetos Recentes */}
          <Card>
            <CardHeader>
              <CardTitle>Projetos Recentes</CardTitle>
              <CardDescription>Histórico de consultorias contratadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projetosRecentes.map((projeto) => (
                  <div
                    key={projeto.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold mb-1">{projeto.titulo}</h3>
                        <p className="text-sm text-muted-foreground">
                          Consultor: {projeto.consultor}
                        </p>
                      </div>
                      <Badge className={getStatusColor(projeto.status)}>
                        {projeto.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mt-3">
                      <span className="font-semibold text-primary">{projeto.valor}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {projeto.inicio}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Avaliações */}
          <Card>
            <CardHeader>
              <CardTitle>Avaliações Recentes</CardTitle>
              <CardDescription>Feedback fornecido pelo cliente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {avaliacoes.map((avaliacao) => (
                  <div
                    key={avaliacao.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold mb-1">{avaliacao.projeto}</h3>
                        <p className="text-sm text-muted-foreground">
                          para {avaliacao.consultor}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(avaliacao.nota)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 text-yellow-500 fill-yellow-500"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      "{avaliacao.comentario}"
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {avaliacao.data}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
