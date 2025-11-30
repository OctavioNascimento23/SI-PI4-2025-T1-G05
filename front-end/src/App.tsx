import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { Index } from './pages/Index';
import { Auth } from './pages/Auth';
import { DashboardEmpresa } from './pages/DashboardEmpresa';
import { DashboardConsultor } from './pages/DashboardConsultor';
import { BuscarConsultoria } from './pages/BuscarConsultoria';
import { PerfilCliente } from './pages/PerfilCliente';
import { PerfilConsultor } from './pages/PerfilConsultor';
import { SerConsultor } from './pages/SerConsultor';
import { CriarNegocio } from './pages/CriarNegocio';
import { Diagnostico } from './pages/Diagnostico';
import { Roadmap } from './pages/Roadmap';
import { Chat } from './pages/Chat';
import { NotFound } from './pages/NotFound';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, usuario, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

function DashboardRedirect() {
  const { usuario, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Carregando...</div>
      </div>
    );
  }

  if (!usuario) {
    return <Navigate to="/auth" replace />;
  }

  if (usuario.tipo_usuario === 'Comerciante') {
    return <Navigate to="/dashboard-empresa" replace />;
  } else {
    return <Navigate to="/dashboard-consultor" replace />;
  }
}

function AuthRedirect() {
  const { usuario, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Carregando...</div>
      </div>
    );
  }

  if (usuario) {
    if (usuario.tipo_usuario === 'Comerciante') {
      return <Navigate to="/dashboard-empresa" replace />;
    } else {
      return <Navigate to="/dashboard-consultor" replace />;
    }
  }

  return <Auth />;
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<AuthRedirect />} />
        <Route path="/ser-consultor" element={<SerConsultor />} />
        <Route
          path="/dashboard-empresa"
          element={
            <ProtectedRoute>
              <DashboardEmpresa />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-consultor"
          element={
            <ProtectedRoute>
              <DashboardConsultor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/buscar-consultoria"
          element={
            <ProtectedRoute>
              <BuscarConsultoria />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <PerfilCliente />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil-consultor"
          element={
            <ProtectedRoute>
              <PerfilConsultor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/criar-negocio"
          element={
            <ProtectedRoute>
              <CriarNegocio />
            </ProtectedRoute>
          }
        />
        <Route
          path="/negocio/:negocioId/diagnostico"
          element={
            <ProtectedRoute>
              <Diagnostico />
            </ProtectedRoute>
          }
        />
        <Route
          path="/negocio/:negocioId/roadmap"
          element={
            <ProtectedRoute>
              <Roadmap />
            </ProtectedRoute>
          }
        />
        <Route
          path="/consultoria/:consultoriaId/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
