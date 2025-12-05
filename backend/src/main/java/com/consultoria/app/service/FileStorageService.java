package com.consultoria.app.service;

import org.apache.commons.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.UUID;

/**
 * Serviço para gerenciamento de arquivos
 */
@Service
public class FileStorageService {

    @Value("${file.upload.dir:./uploads}")
    private String uploadDir;

    /**
     * Salva arquivo a partir de Base64
     * 
     * @return Caminho relativo do arquivo salvo
     */
    public String saveFile(String base64Data, String fileName) throws IOException {
        // Cria diretório se não existir
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        // Gera nome único
        String uniqueFileName = UUID.randomUUID().toString() + "_" + sanitizeFileName(fileName);
        String filePath = uploadDir + File.separator + uniqueFileName;

        // Decodifica Base64 e salva
        byte[] fileBytes = Base64.decodeBase64(base64Data);
        try (FileOutputStream fos = new FileOutputStream(filePath)) {
            fos.write(fileBytes);
        }

        return uniqueFileName;
    }

    /**
     * Lê arquivo e retorna em Base64
     */
    public String getFileAsBase64(String fileName) throws IOException {
        String filePath = uploadDir + File.separator + fileName;
        byte[] fileBytes = Files.readAllBytes(Paths.get(filePath));
        return Base64.encodeBase64String(fileBytes);
    }

    /**
     * Deleta arquivo
     */
    public boolean deleteFile(String fileName) {
        try {
            String filePath = uploadDir + File.separator + fileName;
            return Files.deleteIfExists(Paths.get(filePath));
        } catch (IOException e) {
            return false;
        }
    }

    /**
     * Valida tamanho do arquivo (max 10MB)
     */
    public boolean validateFileSize(String base64Data) {
        long sizeInBytes = (base64Data.length() * 3) / 4; // Aproximação do tamanho real
        long maxSize = 10 * 1024 * 1024; // 10MB
        return sizeInBytes <= maxSize;
    }

    /**
     * Remove caracteres perigosos do nome do arquivo
     */
    private String sanitizeFileName(String fileName) {
        return fileName.replaceAll("[^a-zA-Z0-9\\.\\-]", "_");
    }

    /**
     * Retorna caminho completo do arquivo
     */
    public String getFullPath(String fileName) {
        return uploadDir + File.separator + fileName;
    }
}
