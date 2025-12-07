// Criado por Octavio Nascimento
package com.consultoria.app.tcp.handler;

import com.consultoria.app.model.ConsultantProfile;
import com.consultoria.app.model.ConsultantProject;
import com.consultoria.app.model.User;
import com.consultoria.app.repository.ConsultantProfileRepository;
import com.consultoria.app.repository.ConsultantProjectRepository;
import com.consultoria.app.service.FileStorageService;
import com.consultoria.app.tcp.Protocol;
import com.consultoria.app.tcp.SessionManager;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ProjectCommandHandler implements CommandHandler {

    @Autowired
    private ConsultantProjectRepository projectRepository;

    @Autowired
    private ConsultantProfileRepository consultantProfileRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Override
    public String getCommandType() {
        return "PROJECT";
    }

    @Override
    public Protocol.Response handle(Protocol.Message message, SessionManager sessionManager) {
        User user = sessionManager.validateSession(message.getSessionId());
        if (user == null) {
            return Protocol.createError(message.getRequestId(), "Sessão inválida");
        }

        if (user.getRole() != User.Role.CONSULTANT) {
            return Protocol.createError(message.getRequestId(), "Apenas consultores podem gerenciar projetos");
        }

        JsonObject data = message.getData();
        String action = data.get("action").getAsString();

        switch (action.toUpperCase()) {
            case "ADD":
                return handleAdd(message, user);
            case "UPDATE":
                return handleUpdate(message, user);
            case "DELETE":
                return handleDelete(message, user);
            case "LIST":
                return handleList(message, user);
            default:
                return Protocol.createError(message.getRequestId(), "Action inválida");
        }
    }

    private Protocol.Response handleAdd(Protocol.Message message, User user) {
        JsonObject data = message.getData();

        ConsultantProfile profile = consultantProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    ConsultantProfile p = new ConsultantProfile();
                    p.setUser(user);
                    return consultantProfileRepository.save(p);
                });

        ConsultantProject project = new ConsultantProject();
        project.setConsultantProfile(profile);
        project.setTitle(data.get("title").getAsString());
        project.setDescription(data.get("description").getAsString());

        if (data.has("link")) {
            project.setLink(data.get("link").getAsString());
        }

        // Upload de imagem se fornecida
        if (data.has("imageData") && data.has("imageName")) {
            try {
                String imageUrl = fileStorageService.saveFile(
                        data.get("imageData").getAsString(),
                        data.get("imageName").getAsString());
                project.setImageUrl(imageUrl);
            } catch (Exception e) {
                return Protocol.createError(message.getRequestId(), "Erro ao salvar imagem: " + e.getMessage());
            }
        }

        project = projectRepository.save(project);

        JsonObject responseData = new JsonObject();
        responseData.addProperty("id", project.getId());

        return Protocol.createSuccess(message.getRequestId(), "Projeto adicionado", responseData);
    }

    private Protocol.Response handleUpdate(Protocol.Message message, User user) {
        JsonObject data = message.getData();
        Long projectId = data.get("id").getAsLong();

        ConsultantProject project = projectRepository.findById(projectId).orElse(null);
        if (project == null || !project.getConsultantProfile().getUser().getId().equals(user.getId())) {
            return Protocol.createError(message.getRequestId(), "Projeto não encontrado");
        }

        if (data.has("title"))
            project.setTitle(data.get("title").getAsString());
        if (data.has("description"))
            project.setDescription(data.get("description").getAsString());
        if (data.has("link"))
            project.setLink(data.get("link").getAsString());

        if (data.has("imageData") && data.has("imageName")) {
            try {
                // Deleta imagem antiga
                if (project.getImageUrl() != null) {
                    fileStorageService.deleteFile(project.getImageUrl());
                }
                // Salva nova
                String imageUrl = fileStorageService.saveFile(
                        data.get("imageData").getAsString(),
                        data.get("imageName").getAsString());
                project.setImageUrl(imageUrl);
            } catch (Exception e) {
                return Protocol.createError(message.getRequestId(), "Erro ao salvar imagem");
            }
        }

        projectRepository.save(project);

        return Protocol.createSuccess(message.getRequestId(), "Projeto atualizado", new JsonObject());
    }

    private Protocol.Response handleDelete(Protocol.Message message, User user) {
        JsonObject data = message.getData();
        Long projectId = data.get("id").getAsLong();

        ConsultantProject project = projectRepository.findById(projectId).orElse(null);
        if (project == null || !project.getConsultantProfile().getUser().getId().equals(user.getId())) {
            return Protocol.createError(message.getRequestId(), "Projeto não encontrado");
        }

        // Deleta imagem se existir
        if (project.getImageUrl() != null) {
            fileStorageService.deleteFile(project.getImageUrl());
        }

        projectRepository.delete(project);

        return Protocol.createSuccess(message.getRequestId(), "Projeto removido", new JsonObject());
    }

    private Protocol.Response handleList(Protocol.Message message, User user) {
        ConsultantProfile profile = consultantProfileRepository.findByUserId(user.getId()).orElse(null);

        if (profile == null) {
            return Protocol.createSuccess(message.getRequestId(), "Lista obtida", new JsonObject());
        }

        List<ConsultantProject> projects = projectRepository.findByConsultantProfileId(profile.getId());

        JsonArray projectArray = new JsonArray();
        for (ConsultantProject project : projects) {
            JsonObject projObj = new JsonObject();
            projObj.addProperty("id", project.getId());
            projObj.addProperty("title", project.getTitle());
            projObj.addProperty("description", project.getDescription());
            projObj.addProperty("link", project.getLink());
            projObj.addProperty("imageUrl", project.getImageUrl());
            projectArray.add(projObj);
        }

        JsonObject responseData = new JsonObject();
        responseData.add("projects", projectArray);

        return Protocol.createSuccess(message.getRequestId(), "Lista obtida", responseData);
    }
}
