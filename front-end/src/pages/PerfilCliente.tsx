import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { usuarioService } from '../services/database';
import { supabase } from '../lib/supabase';
import { Card, CardContent, CardHeader } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { PhotoUpload } from '../components/PhotoUpload';
import { User } from 'lucide-react';

interface ProfileFormData {
  nome: string;
  telefone?: string;
  foto_perfil_url?: string;
  bio?: string;
}

export function PerfilCliente() {
  const { usuario, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(usuario?.foto_perfil_url || '');

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    defaultValues: {
      nome: usuario?.nome || '',
      telefone: usuario?.telefone || '',
      foto_perfil_url: usuario?.foto_perfil_url || '',
      bio: usuario?.bio || '',
    }
  });

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    try {
      setLoading(true);
      setSuccess(false);
      await usuarioService.update(user.id, { ...data, foto_perfil_url: photoUrl });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUploaded = async (url: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('usuario')
        .update({ foto_perfil_url: url })
        .eq('id_usuario', user.id);

      if (error) throw error;

      setPhotoUrl(url);
    } catch (error: any) {
      alert('Erro ao atualizar foto: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                {usuario?.foto_perfil_url ? (
                  <img
                    src={usuario.foto_perfil_url}
                    alt={usuario.nome}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-10 w-10 text-blue-600" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
                <p className="text-gray-600">Gerencie suas informações pessoais</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {success && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                Perfil atualizado com sucesso!
              </div>
            )}

            <div className="mb-6 flex justify-center">
              {user && (
                <PhotoUpload
                  currentPhotoUrl={photoUrl}
                  userId={user.id}
                  onPhotoUploaded={handlePhotoUploaded}
                />
              )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Nome Completo"
                  {...register('nome', { required: 'Nome é obrigatório' })}
                  error={errors.nome?.message}
                />

                <Input
                  label="Email"
                  value={usuario?.email || ''}
                  disabled
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Telefone"
                  {...register('telefone')}
                  placeholder="(11) 99999-9999"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Usuário
                  </label>
                  <input
                    type="text"
                    value={usuario?.tipo_usuario || ''}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sobre seu Negócio
                </label>
                <textarea
                  {...register('bio')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                  placeholder="Conte um pouco sobre seu negócio, produtos ou serviços..."
                />
              </div>

              <div className="pt-4">
                <Button type="submit" disabled={loading} className="w-full md:w-auto">
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-lg font-semibold mb-4">Informações da Conta</h2>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">
                  <span className="font-medium">Plano:</span> {usuario?.plano}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Membro desde:</span>{' '}
                  {usuario?.created_at ? new Date(usuario.created_at).toLocaleDateString('pt-BR') : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
