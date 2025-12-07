// Criado por Felipe Lona
package com.consultoria.app.tcp.handler;

import com.consultoria.app.model.ProjectFile;
import com.consultoria.app.model.Request;
import com.consultoria.app.model.User;
import com.consultoria.app.repository.ProjectFileRepository;
import com.consultoria.app.repository.RequestRepository;
import com.consultoria.app.service.FileStorageService;
import com.consultoria.app.tcp.Protocol;
import com.consultoria.app.tcp.SessionManager;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class FileCommandHandler implements CommandHandler {

    @Autowired
    private ProjectFileRepository projectFileRepository;

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Override
    public String getCommandType() {
        return "FILE";
    }

    @Override
    public Protocol.Response handle(Protocol.Message message, SessionManager sessionManager) {
        User user = sessionManager.validateSession(message.getSessionId());
        if (user == null) {
            return Protocol.createError(message.getRequestId(), "Sessão inválida");
        }

        JsonObject data = message.getData();
        String action = data.get("action").getAsString();

        switch (action.toUpperCase()) {
            case "UPLOAD":
                return handleUpload(message, user);
            case "LIST":
                return handleList(message, user);
            case "DOWNLOAD":
                return handleDownload(message, user);
            case "DELETE":
                return handleDelete(message, user);
            default:
                return Protocol.createError(message.getRequestId(), "Action inválida");
        }
    }

    private Protocol.Response handleUpload(Protocol.Message message, User user) {
        JsonObject data = message.getData();

        if (!data.has("requestId") || !data.has("fileData") || !data.has("fileName")) {
            return Protocol.createError(message.getRequestId(), "Dados insuficientes");
        }

        Long requestId = data.get("requestId").getAsLong();
        Request request = requestRepository.findById(requestId).orElse(null);

        if (request == null) {
            return Protocol.createError(message.getRequestId(), "Projeto não encontrado");
        }

        // Verifica permissão
        if (!request.getUser().getId().equals(user.getId()) &&
                (request.getConsultant() == null || !request.getConsultant().getId().equals(user.getId()))) {
            return Protocol.createError(message.getRequestId(), "Sem permissão");
        }

        try {
            String fileData = data.get("fileData").getAsString();
            String fileName = data.get("fileName").getAsString();

            if (!fileStorageService.validateFileSize(fileData)) {
                return Protocol.createError(message.getRequestId(), "Arquivo muito grande (máx 10MB)");
            }

            String savedFile = fileStorageService.saveFile(fileData, fileName);

            ProjectFile projectFile = new ProjectFile();
            projectFile.setRequest(request);
            projectFile.setUploadedBy(user);
            projectFile.setFileName(fileName);
            projectFile.setFilePath(savedFile);
            projectFile.setFileSize((long) (fileData.length() * 3 / 4)); // Tamanho aproximado
            projectFile.setUploadDate(LocalDateTime.now());

            projectFile = projectFileRepository.save(projectFile);

            JsonObject responseData = new JsonObject();
            responseData.addProperty("fileId", projectFile.getId());
            responseData.addProperty("fileName", projectFile.getFileName());

            return Protocol.createSuccess(message.getRequestId(), "Arquivo enviado", responseData);

        } catch (Exception e) {
            return Protocol.createError(message.getRequestId(), "Erro ao salvar arquivo: " + e.getMessage());
        }
    }

    private Protocol.Response handleList(Protocol.Message message, User user) {
        JsonObject data = message.getData();
        Long requestId = data.get("requestId").getAsLong();

        List<ProjectFile> files = projectFileRepository.findByRequestId(requestId);

        JsonArray filesArray = new JsonArray();
        for (ProjectFile file : files) {
            JsonObject fileObj = new JsonObject();
            fileObj.addProperty("id", file.getId());
            fileObj.addProperty("fileName", file.getFileName());
            fileObj.addProperty("fileSize", file.getFileSize());
            fileObj.addProperty("uploadDate", file.getUploadDate().toString());
            fileObj.addProperty("uploadedBy", file.getUploadedBy().getName());
            filesArray.add(fileObj);
        }

        JsonObject responseData = new JsonObject();
        responseData.add("files", filesArray);

        return Protocol.createSuccess(message.getRequestId(), "Lista obtida", responseData);
    }

    private Protocol.Response handleDownload(Protocol.Message message, User user) {
        JsonObject data = message.getData();
        Long fileId = data.get("fileId").getAsLong();

        ProjectFile file = projectFileRepository.findById(fileId).orElse(null);
        if (file == null) {
            return Protocol.createError(message.getRequestId(), "Arquivo não encontrado");
        }

        try {
            String base64 = fileStorageService.getFileAsBase64(file.getFilePath());

            JsonObject responseData = new JsonObject();
            responseData.addProperty("fileName", file.getFileName());
            responseData.addProperty("fileData", base64);

            return Protocol.createSuccess(message.getRequestId(), "Arquivo obtido", responseData);

        } catch (Exception e) {
            return Protocol.createError(message.getRequestId(), "Erro ao ler arquivo");
        }
    }

    private Protocol.Response handleDelete(Protocol.Message message, User user) {
        JsonObject data = message.getData();
        Long fileId = data.get("fileId").getAsLong();

        ProjectFile file = projectFileRepository.findById(fileId).orElse(null);
        if (file == null || !file.getUploadedBy().getId().equals(user.getId())) {
            return Protocol.createError(message.getRequestId(), "Arquivo não encontrado");
        }

        fileStorageService.deleteFile(file.getFilePath());
        projectFileRepository.delete(file);

        return Protocol.createSuccess(message.getRequestId(), "Arquivo removido", new JsonObject());
    }
}
