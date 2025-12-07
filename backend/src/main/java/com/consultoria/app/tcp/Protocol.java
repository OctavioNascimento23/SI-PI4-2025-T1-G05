// Criado por Gabriel dos Santos
package com.consultoria.app.tcp;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

/**
 * Protocolo de comunicação JSON sobre TCP/IP
 * Formato: {"type": "COMMAND_NAME", "sessionId": "...", "data": {...}}
 */
public class Protocol {
    private static final Gson gson = new Gson();

    public static class Message {
        private String type;
        private String sessionId;
        private JsonObject data;
        private String requestId; // Para correlacionar request/response

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public String getSessionId() {
            return sessionId;
        }

        public void setSessionId(String sessionId) {
            this.sessionId = sessionId;
        }

        public JsonObject getData() {
            return data;
        }

        public void setData(JsonObject data) {
            this.data = data;
        }

        public String getRequestId() {
            return requestId;
        }

        public void setRequestId(String requestId) {
            this.requestId = requestId;
        }
    }

    public static class Response {
        private String type;
        private String requestId;
        private boolean success;
        private String message;
        private JsonObject data;

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public String getRequestId() {
            return requestId;
        }

        public void setRequestId(String requestId) {
            this.requestId = requestId;
        }

        public boolean isSuccess() {
            return success;
        }

        public void setSuccess(boolean success) {
            this.success = success;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public JsonObject getData() {
            return data;
        }

        public void setData(JsonObject data) {
            this.data = data;
        }
    }

    /**
     * Serializa Message para JSON string
     */
    public static String encode(Message message) {
        return gson.toJson(message) + "\n"; // Adiciona newline como delimitador
    }

    /**
     * Deserializa JSON string para Message
     */
    public static Message decode(String json) {
        try {
            return gson.fromJson(json.trim(), Message.class);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Serializa Response para JSON string
     */
    public static String encodeResponse(Response response) {
        return gson.toJson(response) + "\n";
    }

    /**
     * Cria resposta de sucesso
     */
    public static Response createSuccess(String requestId, String message, JsonObject data) {
        Response response = new Response();
        response.setType("RESPONSE");
        response.setRequestId(requestId);
        response.setSuccess(true);
        response.setMessage(message);
        response.setData(data);
        return response;
    }

    /**
     * Cria resposta de erro
     */
    public static Response createError(String requestId, String message) {
        Response response = new Response();
        response.setType("RESPONSE");
        response.setRequestId(requestId);
        response.setSuccess(false);
        response.setMessage(message);
        response.setData(new JsonObject());
        return response;
    }

    /**
     * Valida estrutura da mensagem
     */
    public static boolean isValid(Message message) {
        return message != null &&
                message.getType() != null &&
                !message.getType().isEmpty();
    }
}
