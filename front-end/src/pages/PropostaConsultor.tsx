import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Navbar } from "@/components/Navbar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Send, FileText, Calendar, DollarSign, CheckCircle2, PartyPopper } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PropostaConsultor() {
  const { toast } = useToast();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [formData, setFormData] = useState({
    titulo: "",
    resumo: "",
    orcamento: "",
    prazo: "",
    entregaveis: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccessDialog(true);
    toast({
      title: "Proposta enviada com sucesso!",
      description: "O cliente receberá sua proposta em breve.",
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Criar Proposta</h1>
            <p className="text-muted-foreground">Preencha os detalhes da sua proposta de consultoria</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <div>
              <Card className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="titulo" className="text-sm font-medium">
                      Título do Projeto
                    </Label>
                    <Input
                      id="titulo"
                      placeholder="Ex: Reformulação da Plataforma de E-commerce"
                      value={formData.titulo}
                      onChange={(e) => handleChange("titulo", e.target.value)}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="resumo" className="text-sm font-medium">
                      Resumo da Proposta
                    </Label>
                    <Textarea
                      id="resumo"
                      placeholder="Descreva sua proposta de forma clara e objetiva..."
                      value={formData.resumo}
                      onChange={(e) => handleChange("resumo", e.target.value)}
                      rows={5}
                      className="resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="orcamento" className="text-sm font-medium">
                        Orçamento
                      </Label>
                      <Input
                        id="orcamento"
                        placeholder="R$ 15.000"
                        value={formData.orcamento}
                        onChange={(e) => handleChange("orcamento", e.target.value)}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="prazo" className="text-sm font-medium">
                        Prazo
                      </Label>
                      <Input
                        id="prazo"
                        placeholder="3 meses"
                        value={formData.prazo}
                        onChange={(e) => handleChange("prazo", e.target.value)}
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="entregaveis" className="text-sm font-medium">
                      Entregáveis
                    </Label>
                    <Textarea
                      id="entregaveis"
                      placeholder="Liste os principais entregáveis do projeto..."
                      value={formData.entregaveis}
                      onChange={(e) => handleChange("entregaveis", e.target.value)}
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  <Button type="submit" variant="hero" size="lg" className="w-full">
                    <Send className="w-5 h-5" />
                    Enviar Proposta
                  </Button>
                </form>
              </Card>
            </div>

            {/* Preview */}
            <div>
              <Card className="p-8 sticky top-24">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Pré-visualização</h2>
                  <p className="text-sm text-muted-foreground">Veja como sua proposta ficará para o cliente</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold">Título</h3>
                    </div>
                    <p className="text-muted-foreground">
                      {formData.titulo || "Título do projeto aparecerá aqui"}
                    </p>
                  </div>

                  <div className="h-px bg-border" />

                  <div>
                    <h3 className="font-semibold mb-2">Resumo</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {formData.resumo || "O resumo da sua proposta aparecerá aqui"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-accent/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Orçamento</span>
                      </div>
                      <p className="font-semibold">
                        {formData.orcamento || "R$ 0"}
                      </p>
                    </div>

                    <div className="bg-accent/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-secondary" />
                        <span className="text-sm font-medium">Prazo</span>
                      </div>
                      <p className="font-semibold">
                        {formData.prazo || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-5 h-5 text-secondary" />
                      <h3 className="font-semibold">Entregáveis</h3>
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {formData.entregaveis || "Lista de entregáveis aparecerá aqui"}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <PartyPopper className="h-10 w-10 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-bold">
              Proposta Enviada!
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              Sua proposta foi enviada com sucesso. O cliente receberá uma notificação e poderá revisá-la em breve.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Card className="bg-accent/50 p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Projeto:</span>
                  <span className="font-medium">{formData.titulo || "Sem título"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Orçamento:</span>
                  <span className="font-medium">{formData.orcamento || "Não especificado"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prazo:</span>
                  <span className="font-medium">{formData.prazo || "Não especificado"}</span>
                </div>
              </div>
            </Card>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setFormData({
                    titulo: "",
                    resumo: "",
                    orcamento: "",
                    prazo: "",
                    entregaveis: ""
                  });
                  setShowSuccessDialog(false);
                }}
              >
                Nova Proposta
              </Button>
              <Button 
                variant="hero" 
                className="flex-1"
                onClick={() => setShowSuccessDialog(false)}
              >
                Concluir
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
