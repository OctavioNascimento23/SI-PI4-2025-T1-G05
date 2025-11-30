import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from './Button';
import { Upload, User, Loader } from 'lucide-react';

interface PhotoUploadProps {
  currentPhotoUrl?: string;
  userId: string;
  onPhotoUploaded: (url: string) => void;
}

export function PhotoUpload({ currentPhotoUrl, userId, onPhotoUploaded }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentPhotoUrl);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem válida');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB');
      return;
    }

    try {
      setUploading(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/profile-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(fileName);

      setPreviewUrl(publicUrl);
      onPhotoUploaded(publicUrl);
    } catch (error: any) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao fazer upload da foto: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Foto de perfil"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-16 h-16 text-gray-400" />
          )}
        </div>
        {uploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <Loader className="w-8 h-8 text-white animate-spin" />
          </div>
        )}
      </div>

      <div>
        <input
          type="file"
          id="photo-upload"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading}
          className="hidden"
        />
        <label htmlFor="photo-upload">
          <Button
            as="span"
            variant="outline"
            size="sm"
            disabled={uploading}
            className="cursor-pointer"
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? 'Enviando...' : 'Escolher Foto'}
          </Button>
        </label>
        <p className="text-xs text-gray-500 mt-2 text-center">
          JPG, PNG ou GIF (máx. 5MB)
        </p>
      </div>
    </div>
  );
}
