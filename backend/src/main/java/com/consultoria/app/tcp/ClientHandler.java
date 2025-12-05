package com.consultoria.app.tcp;

import com.consultoria.app.tcp.handler.CommandHandler;
import com.consultoria.app.tcp.Protocol.Message;
import com.consultoria.app.tcp.Protocol.Response;
import com.consultoria.app.util.ConsultoriaLogger;
import com.consultoria.app.util.ConsultoriaLogger.LogCategory;
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
        String clientIp = clientSocket.getInetAddress().getHostAddress();
        int clientPort = clientSocket.getPort();

        try (
                BufferedReader in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
                PrintWriter out = new PrintWriter(clientSocket.getOutputStream(), true)) {
            
            ConsultoriaLogger.logTCPConnection(clientIp, clientPort, "Cliente conectado", true);

            String inputLine;
            while (running && (inputLine = in.readLine()) != null) {
                long startTime = System.currentTimeMillis();
                try {
                    // Decodifica mensagem
                    Message message = Protocol.decode(inputLine);

                    if (!Protocol.isValid(message)) {
                        ConsultoriaLogger.logWarn(LogCategory.TCP_CLIENT, "Mensagem inválida recebida de %s:%d", clientIp, clientPort);
                        Response errorResponse = Protocol.createError(
                                message != null ? message.getRequestId() : "unknown",
                                "Mensagem inválida");
                        out.println(Protocol.encodeResponse(errorResponse));
                        continue;
                    }

                    ConsultoriaLogger.logInfo(LogCategory.TCP_CLIENT, "Comando recebido: %s de %s:%d", 
                            message.getType(), clientIp, clientPort);

                    // Processa comando
                    Response response = processCommand(message);

                    // Envia resposta
                    out.println(Protocol.encodeResponse(response));

                    long duration = System.currentTimeMillis() - startTime;
                    ConsultoriaLogger.logPerformance(LogCategory.TCP_CLIENT, 
                            "Processamento de " + message.getType(), duration);

                } catch (Exception e) {
                    ConsultoriaLogger.logError(LogCategory.TCP_CLIENT, "Processar mensagem", e);
                    Response errorResponse = Protocol.createError("unknown",
                            "Erro interno: " + e.getMessage());
                    out.println(Protocol.encodeResponse(errorResponse));
                }
            }

        } catch (IOException e) {
            ConsultoriaLogger.logError(LogCategory.TCP_CLIENT, "Conexão com cliente", e);
        } finally {
            try {
                clientSocket.close();
                ConsultoriaLogger.logTCPConnection(clientIp, clientPort, "Cliente desconectado", false);
            } catch (IOException e) {
                ConsultoriaLogger.logError(LogCategory.TCP_CLIENT, "Fechar socket", e);
            }
        }
    }

    /**
     * Processa comando usando handler apropriado
     */
    private Response processCommand(Message message) {
        String commandType = message.getType();
        CommandHandler handler = commandHandlers.get(commandType);

        if (handler == null) {
            return Protocol.createError(message.getRequestId(),
                    "Comando desconhecido: " + commandType);
        }

        try {
            return handler.handle(message, sessionManager);
        } catch (Exception e) {
            log.error("Erro ao executar handler para " + commandType, e);
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
