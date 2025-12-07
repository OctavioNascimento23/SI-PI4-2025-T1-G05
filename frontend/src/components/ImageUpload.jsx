// Criado por Ítalo de Souza
import React, { useState } from 'react';

const ImageUpload = ({ onUpload, currentImage, label = "Upload Image" }) => {
    const [preview, setPreview] = useState(currentImage || null);
    const [uploading, setUploading] = useState(false);

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Valida tipo
        if (!file.type.startsWith('image/')) {
            alert('Por favor selecione uma imagem');
            return;
        }

        // Valida tamanho (10MB max)
        if (file.size > 10 * 1024 * 1024) {
            alert('Imagem muito grande (máximo 10MB)');
            return;
        }

        // Preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target.result);
        };
        reader.readAsDataURL(file);

        // Upload
        if (onUpload) {
            setUploading(true);
            try {
                await onUpload(file);
            } catch (error) {
                console.error('Erro ao fazer upload:', error);
                alert('Erro ao fazer upload da imagem');
            } finally {
                setUploading(false);
            }
        }
    };

    return (
        <div className="flex flex-col items-center space-y-3">
            {preview && (
                <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-700">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            <label className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                {uploading ? 'Enviando...' : label}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={uploading}
                />
            </label>
        </div>
    );
};

export default ImageUpload;
