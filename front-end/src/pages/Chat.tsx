import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Paperclip } from "lucide-react";

export default function Chat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mensagem, setMensagem] = useState("");

  // Mock data - em produção viria do backend
  const consultoria = {
    id: 1,
    nome: "Implementação de E-commerce",
    consultor: "Ana Silva"
  };

  const mensagens = [
    {
      id: 1,
      remetente: "consultor",
      nome: "Ana Silva",
      conteudo: "Olá! Tudo bem? Estou enviando o material da próxima reunião.",
      horario: "10:30"
    },
    {
      id: 2,
      remetente: "empresa",
      nome: "Você",
      conteudo: "Ótimo! Obrigado. Já consegui visualizar.",
      horario: "10:35"
    },
    {
      id: 3,
      remetente: "consultor",
      nome: "Ana Silva",
      conteudo: "Perfeito! Nos vemos amanhã às 14h então.",
      horario: "10:36"
    }
  ];

  const handleEnviar = () => {
    if (mensagem.trim()) {
      // Aqui seria enviado para o backend
      console.log("Enviando mensagem:", mensagem);
      setMensagem("");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      {/* Header do Chat */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/dashboard/empresa")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold">{consultoria.nome}</h1>
              <p className="text-sm text-muted-foreground">{consultoria.consultor}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mensagens */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="space-y-4">
            {mensagens.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.remetente === "empresa" ? "justify-end" : "justify-start"}`}
              >
                <Card
                  className={`max-w-[70%] p-4 ${
                    msg.remetente === "empresa"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card"
                  }`}
                >
                  <p className="text-sm font-medium mb-1">{msg.nome}</p>
                  <p className="text-sm mb-2">{msg.conteudo}</p>
                  <p className="text-xs opacity-70">{msg.horario}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Input de Mensagem */}
      <div className="border-t bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Paperclip className="w-5 h-5" />
            </Button>
            <Input
              placeholder="Digite sua mensagem..."
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleEnviar()}
              className="flex-1"
            />
            <Button onClick={handleEnviar} size="icon">
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
