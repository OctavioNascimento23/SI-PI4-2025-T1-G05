import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import PainelDemo from "./pages/PainelDemo";
import DashboardEmpresa from "./pages/DashboardEmpresa";
import DashboardConsultor from "./pages/DashboardConsultor";
import PropostaConsultor from "./pages/PropostaConsultor";
import PerfilCliente from "./pages/PerfilCliente";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/painel-demo" element={<PainelDemo />} />
          <Route path="/dashboard/empresa" element={<DashboardEmpresa />} />
          <Route path="/dashboard/consultor" element={<DashboardConsultor />} />
          <Route path="/proposta" element={<PropostaConsultor />} />
          <Route path="/perfil/cliente/:id" element={<PerfilCliente />} />
          <Route path="/chat/:id" element={<Chat />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
