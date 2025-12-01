import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card, CardContent, CardHeader } from '../components/Card';

interface SignUpFormData {
  nome: string;
  email: string;
  password: string;
  tipo_usuario: 'Comerciante' | 'Consultor';
  telefone?: string;
}

interface SignInFormData {
  email: string;
  password: string;
}

export function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();

  const { register: registerSignUp, handleSubmit: handleSubmitSignUp, formState: { errors: signUpErrors }, watch } = useForm<SignUpFormData>();
  const { register: registerSignIn, handleSubmit: handleSubmitSignIn, formState: { errors: signInErrors } } = useForm<SignInFormData>();

  const tipoUsuario = watch('tipo_usuario');

  const onSignUp = async (data: SignUpFormData) => {
    try {
      setError('');
      setLoading(true);
      const { password, ...userData } = data;
      const { error } = await signUp(data.email, password, userData);

      if (error) throw error;

      navigate(data.tipo_usuario === 'Comerciante' ? '/dashboard-empresa' : '/dashboard-consultor');
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  const onSignIn = async (data: SignInFormData) => {
    try {
      setError('');
      setLoading(true);
      const { error } = await signIn(data.email, data.password);

      if (error) throw error;

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userData } = await supabase
          .from('usuario')
          .select('tipo_usuario')
          .eq('id_usuario', user.id)
          .maybeSingle();

        if (userData) {
          navigate(userData.tipo_usuario === 'Comerciante' ? '/dashboard-empresa' : '/dashboard-consultor');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">
            {isSignUp ? 'Criar Conta' : 'Entrar'}
          </h2>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {isSignUp ? (
            <form onSubmit={handleSubmitSignUp(onSignUp)} className="space-y-4">
              <Input
                label="Nome Completo"
                {...registerSignUp('nome', { required: 'Nome é obrigatório' })}
                error={signUpErrors.nome?.message}
              />

              <Input
                label="Email"
                type="email"
                {...registerSignUp('email', { required: 'Email é obrigatório' })}
                error={signUpErrors.email?.message}
              />

              <Input
                label="Senha"
                type="password"
                {...registerSignUp('password', {
                  required: 'Senha é obrigatória',
                  minLength: { value: 6, message: 'Senha deve ter no mínimo 6 caracteres' }
                })}
                error={signUpErrors.password?.message}
              />

              <Input
                label="Telefone"
                {...registerSignUp('telefone')}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Usuário
                </label>
                <select
                  {...registerSignUp('tipo_usuario', { required: 'Selecione o tipo de usuário' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione...</option>
                  <option value="Comerciante">Empresário/Comerciante</option>
                  <option value="Consultor">Consultor</option>
                </select>
                {signUpErrors.tipo_usuario && (
                  <p className="mt-1 text-sm text-red-600">{signUpErrors.tipo_usuario.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Criando conta...' : 'Criar Conta'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmitSignIn(onSignIn)} className="space-y-4">
              <Input
                label="Email"
                type="email"
                {...registerSignIn('email', { required: 'Email é obrigatório' })}
                error={signInErrors.email?.message}
              />

              <Input
                label="Senha"
                type="password"
                {...registerSignIn('password', { required: 'Senha é obrigatória' })}
                error={signInErrors.password?.message}
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-blue-600 hover:underline"
            >
              {isSignUp ? 'Já tem uma conta? Entrar' : 'Não tem uma conta? Criar conta'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
