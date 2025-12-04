package com.consultoria.app.tcp;

import com.consultoria.app.tcp.handler.CommandHandler;
import com.consultoria.app.tcp.Protocol.Message;
import com.consultoria.app.tcp.Protocol.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;
import java.util.Map;

/**
 * Handler para cada conexão de cliente TCP/IP
 */
public class ClientHandler implements Runnable {
    private static final Logger log = LoggerFactory.getLogger(ClientHandler.class);

    private final Socket clientSocket;
    private final Map<String, CommandHandler> commandHandlers;
    private final SessionManager sessionManager;
    private boolean running = true;

    public ClientHandler(Socket socket, Map<String, CommandHandler> handlers) {
        this.clientSocket = socket;
        this.commandHandlers = handlers;
        this.sessionManager = SessionManager.getInstance();
    }

    @Override
    public void run() {
        try (
                BufferedReader in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
                PrintWriter out = new PrintWriter(clientSocket.getOutputStream(), true)) {
            log.info("Cliente conectado: {}", clientSocket.getInetAddress());

            String inputLine;
            while (running && (inputLine = in.readLine()) != null) {
                try {
                    // Log do JSON bruto recebido
                    log.debug("📥 JSON bruto recebido: {}", inputLine);
                    
                    // Decodifica mensagem
                    Message message = Protocol.decode(inputLine);

                    if (!Protocol.isValid(message)) {
                        log.warn("❌ Mensagem inválida recebida: {}", inputLine);
                        Response errorResponse = Protocol.createError(
                                message != null ? message.getRequestId() : "unknown",
                                "Mensagem inválida");
                        out.println(Protocol.encodeResponse(errorResponse));
                        continue;
                    }

                    log.info("🔄 Comando - Tipo: {}, RequestId: {}, SessionId: {}",
                            message.getType(), message.getRequestId(), message.getSessionId());

                    // Processa comando
                    Response response = processCommand(message);

                    // Envia resposta
                    out.println(Protocol.encodeResponse(response));

                } catch (Exception e) {
                    log.error("Erro ao processar mensagem", e);
                    Response errorResponse = Protocol.createError("unknown",
                            "Erro interno: " + e.getMessage());
                    out.println(Protocol.encodeResponse(errorResponse));
                }
            }

        } catch (IOException e) {
            log.error("Erro na conexão com cliente", e);
        } finally {
            try {
                clientSocket.close();
                log.info("Cliente desconectado: {}", clientSocket.getInetAddress());
            } catch (IOException e) {
                log.error("Erro ao fechar socket", e);
            }
        }
    }

    /**
     * Processa comando usando handler apropriado
     */
    private Response processCommand(Message message) {
        String commandType = message.getType();
        CommandHandler handler = commandHandlers.get(commandType);

        log.debug("🔍 Handlers registrados: {}", commandHandlers.keySet());

        if (handler == null) {
            log.error("❌ Handler não encontrado para: {}", commandType);
            return Protocol.createError(message.getRequestId(),
                    "Comando desconhecido: " + commandType);
        }

        log.info("✅ Executando handler {} para comando: {}", handler.getClass().getSimpleName(), commandType);

        try {
            return handler.handle(message, sessionManager);
        } catch (Exception e) {
            log.error("❌ ERRO ao executar handler {} para {}: {}", handler.getClass().getSimpleName(), commandType, e.getMessage(), e);
            return Protocol.createError(message.getRequestId(),
                    "Erro ao processar comando: " + e.getMessage());
        }
    }

    /**
     * Para execução do handler
     */
    public void stop() {
        running = false;
        try {
            clientSocket.close();
        } catch (IOException e) {
            log.error("Erro ao fechar socket", e);
        }
    }
}
