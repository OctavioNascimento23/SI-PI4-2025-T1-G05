// Criado por Ítalo de Souza
package com.consultoria.app.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Utilitário centralizado para logging com formatação padronizada
 * Fornece logs estruturados para rastrear operações TCP, Chat, Autenticação, etc.
 */
public class ConsultoriaLogger {
    private static final Logger log = LoggerFactory.getLogger("CONSULTORIA");
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS");

    // Cores e símbolos para console
    private static final String RESET = "\u001B[0m";
    private static final String CYAN = "\u001B[36m";
    private static final String GREEN = "\u001B[32m";
    private static final String YELLOW = "\u001B[33m";
    private static final String RED = "\u001B[31m";
    private static final String MAGENTA = "\u001B[35m";
    private static final String WHITE = "\u001B[37m";

    // Categorias de log
    public enum LogCategory {
        TCP_SERVER("TCP-SERVER", CYAN),
        TCP_CLIENT("TCP-CLIENT", CYAN),
        CHAT("CHAT", GREEN),
        AUTH("AUTH", YELLOW),
        PROJECT("PROJECT", MAGENTA),
        REQUEST("REQUEST", WHITE),
        ERROR("ERROR", RED);

        private final String label;
        private final String color;

        LogCategory(String label, String color) {
            this.label = label;
            this.color = color;
        }

        public String format(String message) {
            return color + "[" + label + "]" + RESET + " " + message;
        }
    }

    /**
     * Log de inicialização de operação
     */
    public static void logStart(LogCategory category, String operation, Object... params) {
        String message = formatMessage("▶ INICIANDO: " + operation, params);
        log.info(category.format(message));
    }

    /**
     * Log de sucesso
     */
    public static void logSuccess(LogCategory category, String operation, Object... params) {
        String message = formatMessage("✓ SUCESSO: " + operation, params);
        log.info(category.format(message));
    }

    /**
     * Log de erro
     */
    public static void logError(LogCategory category, String operation, Exception e, Object... params) {
        String message = formatMessage("✗ ERRO em " + operation + ": " + e.getMessage(), params);
        log.error(category.format(message), e);
    }

    /**
     * Log de aviso
     */
    public static void logWarn(LogCategory category, String operation, Object... params) {
        String message = formatMessage("⚠ AVISO: " + operation, params);
        log.warn(category.format(message));
    }

    /**
     * Log informativo
     */
    public static void logInfo(LogCategory category, String message, Object... params) {
        String formatted = formatMessage(message, params);
        log.info(category.format(formatted));
    }

    /**
     * Log detalhado (debug)
     */
    public static void logDebug(LogCategory category, String message, Object... params) {
        String formatted = formatMessage(message, params);
        log.debug(category.format(formatted));
    }

    /**
     * Log separador de linha
     */
    public static void logSeparator() {
        log.info(CYAN + "════════════════════════════════════════════════════════════════" + RESET);
    }

    /**
     * Log com contexto
     */
    public static void logContext(LogCategory category, String title, Object... params) {
        logSeparator();
        String message = formatMessage(title, params);
        log.info(category.format(message));
        logSeparator();
    }

    /**
     * Log com resumo de operação
     */
    public static void logSummary(LogCategory category, String operation, int statusCode, String details, Object... params) {
        String statusSymbol = statusCode >= 200 && statusCode < 300 ? "✓" : "✗";
        String message = String.format("%s %s [%d] - %s", statusSymbol, operation, statusCode, details);
        log.info(category.format(formatMessage(message, params)));
    }

    /**
     * Log para rastreamento de chat
     */
    public static void logChatMessage(Long messageId, Long projectId, Long senderId, String senderName, String preview) {
        String message = String.format("ID:%d | Projeto:%d | Remetente:%s (%d) | Msg: %s...",
                messageId, projectId, senderName, senderId,
                preview.length() > 50 ? preview.substring(0, 50) : preview);
        log.info(LogCategory.CHAT.format(message));
    }

    /**
     * Log para rastreamento de autenticação
     */
    public static void logAuthentication(String action, String email, Long userId, boolean success) {
        String status = success ? "✓ SUCESSO" : "✗ FALHA";
        String message = String.format("%s: %s (ID: %s)", status, email, userId != null ? userId : "N/A");
        log.info(LogCategory.AUTH.format(action + " - " + message));
    }

    /**
     * Log para rastreamento de conexão TCP
     */
    public static void logTCPConnection(String ip, int port, String action, boolean connected) {
        String status = connected ? "✓ CONECTADO" : "✗ DESCONECTADO";
        String message = String.format("%s: %s:%d", status, ip, port);
        log.info(LogCategory.TCP_CLIENT.format(action + " - " + message));
    }

    /**
     * Log para rastreamento de projeto
     */
    public static void logProject(Long projectId, String projectName, String action, String status) {
        String message = String.format("ID:%d | Nome:%s | Ação:%s | Status:%s",
                projectId, projectName, action, status);
        log.info(LogCategory.PROJECT.format(message));
    }

    /**
     * Formata mensagem com parâmetros
     */
    private static String formatMessage(String template, Object... params) {
        try {
            if (params.length == 0) {
                return template;
            }
            return String.format(template, params);
        } catch (Exception e) {
            // Se houver erro na formatação, retorna a mensagem original
            return template;
        }
    }

    /**
     * Log com timestamp detalhado
     */
    public static void logTimestamp(LogCategory category, String message) {
        String timestamp = LocalDateTime.now().format(formatter);
        String formatted = "[" + timestamp + "] " + message;
        log.info(category.format(formatted));
    }

    /**
     * Log de performance
     */
    public static void logPerformance(LogCategory category, String operation, long durationMs) {
        String message = String.format("⏱ %s concluído em %dms", operation, durationMs);
        log.info(category.format(message));
    }
}
