// Criado por Gabriel dos Santos
package com.consultoria.app.tcp.handler;

import com.consultoria.app.model.User;
import com.consultoria.app.repository.UserRepository;
import com.consultoria.app.service.FileStorageService;
import com.consultoria.app.tcp.Protocol;
import com.consultoria.app.tcp.SessionManager;
import com.google.gson.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Handler para comandos de perfil (UPDATE_USER_PROFILE,
 * UPDATE_CONSULTANT_PROFILE, GET_PROFILE)
 */
@Component
public class ProfileCommandHandler implements CommandHandler {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileStorageService fileStorageService;

    private static final String COMMAND_TYPE = "PROFILE";

    @Override
    public String getCommandType() {
        return COMMAND_TYPE;
    }

    @Override
    public Protocol.Response handle(Protocol.Message message, SessionManager sessionManager) {
        // Valida sessão
        User user = sessionManager.validateSession(message.getSessionId());
        if (user == null) {
            return Protocol.createError(message.getRequestId(), "Sessão inválida ou expirada");
        }

        JsonObject data = message.getData();
        if (data == null || !data.has("action")) {
            return Protocol.createError(message.getRequestId(), "Campo 'action' obrigatório");
        }

        String action = data.get("action").getAsString();

        switch (action.toUpperCase()) {
            case "UPDATE":
                return handleUpdate(message, user);
            case "UPLOAD_PHOTO":
                return handleUploadPhoto(message, user);
            case "GET":
                return handleGet(message, user);
            default:
                return Protocol.createError(message.getRequestId(), "Action inválida: " + action);
        }
    }

    /**
     * Atualiza perfil do usuário
     */
    private Protocol.Response handleUpdate(Protocol.Message message, User user) {
        JsonObject data = message.getData();

        boolean updated = false;

        // Atualiza campos
        if (data.has("name")) {
            user.setName(data.get("name").getAsString());
            updated = true;
        }

        if (data.has("company")) {
            user.setCompany(data.get("company").getAsString());
            updated = true;
        }

        if (data.has("bio")) {
            user.setBio(data.get("bio").getAsString());
            updated = true;
        }

        if (updated) {
            user = userRepository.save(user);
        }

        // Monta resposta
        JsonObject responseData = buildUserData(user);

        return Protocol.createSuccess(message.getRequestId(),
                "Perfil atualizado com sucesso", responseData);
    }

    /**
     * Upload de foto de perfil
     */
    private Protocol.Response handleUploadPhoto(Protocol.Message message, User user) {
        JsonObject data = message.getData();

        if (!data.has("photoData") || !data.has("fileName")) {
            return Protocol.createError(message.getRequestId(),
                    "photoData e fileName obrigatórios");
        }

        String base64Photo = data.get("photoData").getAsString();
        String fileName = data.get("fileName").getAsString();

        // Valida tamanho
        if (!fileStorageService.validateFileSize(base64Photo)) {
            return Protocol.createError(message.getRequestId(),
                    "Arquivo muito grande (máximo 10MB)");
        }

        try {
            // Deleta foto antiga se existir
            if (user.getProfilePhotoUrl() != null) {
                fileStorageService.deleteFile(user.getProfilePhotoUrl());
            }

            // Salva nova foto
            String savedFileName = fileStorageService.saveFile(base64Photo, fileName);
            user.setProfilePhotoUrl(savedFileName);
            user = userRepository.save(user);

            JsonObject responseData = new JsonObject();
            responseData.addProperty("photoUrl", savedFileName);

            return Protocol.createSuccess(message.getRequestId(),
                    "Foto atualizada com sucesso", responseData);

        } catch (Exception e) {
            return Protocol.createError(message.getRequestId(),
                    "Erro ao salvar foto: " + e.getMessage());
        }
    }

    /**
     * Obtém dados do perfil
     */
    private Protocol.Response handleGet(Protocol.Message message, User user) {
        JsonObject data = message.getData();

        // Se especificou userId, busca por ID (para ver perfil de outro usuário)
        if (data.has("userId")) {
            Long userId = data.get("userId").getAsLong();
            user = userRepository.findById(userId).orElse(null);

            if (user == null) {
                return Protocol.createError(message.getRequestId(), "Usuário não encontrado");
            }
        }

        JsonObject responseData = buildUserData(user);

        return Protocol.createSuccess(message.getRequestId(),
                "Dados obtidos com sucesso", responseData);
    }

    /**
     * Constrói JSON com dados do usuário
     */
    private JsonObject buildUserData(User user) {
        JsonObject userData = new JsonObject();
        userData.addProperty("id", user.getId());
        userData.addProperty("name", user.getName());
        userData.addProperty("email", user.getEmail());
        userData.addProperty("role", user.getRole().toString());

        if (user.getProfilePhotoUrl() != null) {
            userData.addProperty("profilePhotoUrl", user.getProfilePhotoUrl());
        }

        if (user.getCompany() != null) {
            userData.addProperty("company", user.getCompany());
        }

        if (user.getBio() != null) {
            userData.addProperty("bio", user.getBio());
        }

        return userData;
    }
}
