import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { negocioService } from '../services/database';
import { Card, CardContent, CardHeader } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Building2 } from 'lucide-react';

interface NegocioFormData {
  nome_negocio: string;
  tipo_negocio: string;
  descricao_inicial: string;
}

const TIPOS_NEGOCIO = [
  'Bar',
  'Padaria',
  'Mercadinho',
  'Restaurante',
  'Lanchonete',
  'Cafeteria',
  'Loja de Roupas',
  'Farmácia',
  'Pet Shop',
  'Salão de Beleza',
  'Academia',
  'Livraria',
  'Papelaria',
  'Eletrônicos',
  'Mercado',
  'Outro',
];

export function CriarNegocio() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<NegocioFormData>();

  const onSubmit = async (data: NegocioFormData) => {
    if (!usuario) return;

    try {
      setLoading(true);
      setError('');

      await negocioService.create({
        ...data,
        id_usuario: usuario.id_usuario,
      });

      navigate('/dashboard-empresa');
    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar negócio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Cadastrar Negócio</h1>
                <p className="text-gray-600">Adicione as informações do seu negócio</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Nome do Negócio"
                placeholder="Ex: Padaria São José"
                {...register('nome_negocio', { required: 'Nome do negócio é obrigatório' })}
                error={errors.nome_negocio?.message}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Negócio
                </label>
                <select
                  {...register('tipo_negocio', { required: 'Selecione o tipo de negócio' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione...</option>
                  {TIPOS_NEGOCIO.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
                {errors.tipo_negocio && (
                  <p className="mt-1 text-sm text-red-600">{errors.tipo_negocio.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição Inicial
                </label>
                <textarea
                  {...register('descricao_inicial')}
                  rows={4}
                  placeholder="Conte um pouco sobre seu negócio, desafios atuais e objetivos..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard-empresa')}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Cadastrando...' : 'Cadastrar Negócio'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
