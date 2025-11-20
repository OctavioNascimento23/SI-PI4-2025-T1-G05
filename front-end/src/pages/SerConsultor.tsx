import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Navbar } from "@/components/Navbar";
import { Upload, FileText, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function SerConsultor() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Formulário enviado com sucesso!",
      description: "Você já pode acessar o painel de consultor.",
    });

    // Redireciona para o dashboard de consultor
    setTimeout(() => {
      navigate("/dashboard/consultor");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Seja um Consultor</h1>
            <p className="text-muted-foreground">Preencha o formulário abaixo para se tornar um consultor da plataforma</p>
          </div>

          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dados Pessoais */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Dados Pessoais</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome Completo</Label>
                    <Input id="nome" type="text" placeholder="Seu nome completo" />
                  </div>
                  <div>
                    <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                    <Input id="dataNascimento" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="cpf">CPF ou CNPJ</Label>
                    <Input id="cpf" type="text" placeholder="000.000.000-00" />
                  </div>
                  <div>
                    <Label htmlFor="telefone">Telefone/WhatsApp</Label>
                    <Input id="telefone" type="tel" placeholder="(00) 00000-0000" />
                  </div>
                </div>
              </div>

              {/* Contato */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Contato Profissional</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">E-mail Profissional</Label>
                    <Input id="email" type="email" placeholder="seu@email.com" />
                  </div>
                  <div>
                    <Label htmlFor="endereco">Endereço (Cidade/Estado)</Label>
                    <Input id="endereco" type="text" placeholder="São Paulo, SP" />
                  </div>
                </div>
              </div>

              {/* Documentos */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Documentação</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="rg">Documento de Identidade (RG ou CNH)</Label>
                    <div className="mt-2 flex items-center gap-2">
                      <Button type="button" variant="outline" className="w-full justify-start">
                        <Upload className="w-4 h-4 mr-2" />
                        Fazer upload do documento
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="comprovante">Comprovante de Residência</Label>
                    <div className="mt-2 flex items-center gap-2">
                      <Button type="button" variant="outline" className="w-full justify-start">
                        <Upload className="w-4 h-4 mr-2" />
                        Fazer upload do comprovante
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="curriculo">Currículo em PDF (Opcional)</Label>
                    <div className="mt-2 flex items-center gap-2">
                      <Button type="button" variant="outline" className="w-full justify-start">
                        <FileText className="w-4 h-4 mr-2" />
                        Fazer upload do currículo
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="certificacoes">Comprovante de Certificações</Label>
                    <div className="mt-2 flex items-center gap-2">
                      <Button type="button" variant="outline" className="w-full justify-start">
                        <Upload className="w-4 h-4 mr-2" />
                        Fazer upload das certificações
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Você pode fazer upload de múltiplos arquivos
                    </p>
                  </div>
                </div>
              </div>

              {/* Termos */}
              <div className="border-t pt-6">
                <div className="flex items-start gap-3">
                  <Checkbox 
                    id="terms" 
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                  />
                  <div className="flex-1">
                    <Label 
                      htmlFor="terms" 
                      className="text-sm font-normal cursor-pointer"
                    >
                      Declaro que todas as informações fornecidas são verdadeiras e concordo com os{" "}
                      <a href="#" className="text-primary hover:underline">Termos de Uso</a> e{" "}
                      <a href="#" className="text-primary hover:underline">Política de Privacidade</a> da plataforma.
                    </Label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center gap-4">
                <Button type="submit" className="flex-1" variant="hero" size="lg">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Enviar
                </Button>
              </div>
            </form>
          </Card>

          {/* Info Card */}
          <Card className="mt-6 p-6 bg-accent/50">
            <h3 className="font-semibold mb-2">Por que ser um consultor?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Conecte-se com empresas que precisam da sua expertise</li>
              <li>• Trabalhe de forma flexível e remota</li>
              <li>• Defina seus próprios valores e horários</li>
              <li>• Faça parte de uma comunidade de profissionais qualificados</li>
            </ul>
          </Card>
        </div>
      </main>
    </div>
  );
}
