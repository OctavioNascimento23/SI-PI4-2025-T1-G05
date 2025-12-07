// Criado por Ítalo de Souza
package com.consultoria.app.tcp;

import com.consultoria.app.tcp.handler.CommandHandler;
import com.consultoria.app.util.ConsultoriaLogger;
import com.consultoria.app.util.ConsultoriaLogger.LogCategory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Servidor TCP/IP principal
 */
@Component
public class TCPServer {
    private static final Logger log = LoggerFactory.getLogger(TCPServer.class);

    @Value("${tcp.server.port:8888}")
    private int port;

    @Autowired(required = false)
    private List<CommandHandler> commandHandlersList;

    private ServerSocket serverSocket;
    private ExecutorService threadPool;
    private Thread serverThread;
    private boolean running = false;
    private Map<String, CommandHandler> commandHandlers = new HashMap<>();

    @PostConstruct
    public void initialize() {
        // Registra command handlers
        if (commandHandlersList != null) {
            ConsultoriaLogger.logSeparator();
            ConsultoriaLogger.logInfo(LogCategory.TCP_SERVER, "Registrando handlers de comandos...");
            for (CommandHandler handler : commandHandlersList) {
                commandHandlers.put(handler.getCommandType(), handler);
                ConsultoriaLogger.logInfo(LogCategory.TCP_SERVER, "✓ Handler registrado: %s", handler.getCommandType());
            }
            ConsultoriaLogger.logSeparator();
        }

        // Inicia servidor em thread separada
        serverThread = new Thread(this::start);
        serverThread.setName("TCP-Server-Thread");
        serverThread.start();
    }

    /**
     * Inicia servidor TCP/IP
     */
    public void start() {
        try {
            serverSocket = new ServerSocket(port);
            threadPool = Executors.newFixedThreadPool(20); // Pool de 20 threads
            running = true;

            ConsultoriaLogger.logSeparator();
            ConsultoriaLogger.logSuccess(LogCategory.TCP_SERVER, "Servidor TCP/IP iniciado na porta %d", port);
            ConsultoriaLogger.logInfo(LogCategory.TCP_SERVER, "Aguardando conexões de clientes...");
            ConsultoriaLogger.logInfo(LogCategory.TCP_SERVER, "Pool de threads: 20 threads");
            ConsultoriaLogger.logSeparator();

            while (running) {
                try {
                    Socket clientSocket = serverSocket.accept();
                    ConsultoriaLogger.logTCPConnection(
                        clientSocket.getInetAddress().getHostAddress(),
                        clientSocket.getPort(),
                        "Nova conexão recebida",
                        true
                    );
                    ClientHandler clientHandler = new ClientHandler(clientSocket, commandHandlers);
                    threadPool.execute(clientHandler);
                } catch (IOException e) {
                    if (running) {
                        ConsultoriaLogger.logError(LogCategory.TCP_SERVER, "Aceitar conexão", e);
                    }
                }
            }
        } catch (IOException e) {
            ConsultoriaLogger.logError(LogCategory.TCP_SERVER, "Inicializar servidor", e);
        }
    }

    /**
     * Para servidor
     */
    @PreDestroy
    public void stop() {
        running = false;

        try {
            if (serverSocket != null && !serverSocket.isClosed()) {
                serverSocket.close();
            }

            if (threadPool != null) {
                threadPool.shutdown();
            }

            log.info("Servidor TCP/IP finalizado");
        } catch (IOException e) {
            log.error("Erro ao finalizar servidor", e);
        }
    }

    /**
     * Verifica se servidor está rodando
     */
    public boolean isRunning() {
        return running;
    }

    /**
     * Retorna porta do servidor
     */
    public int getPort() {
        return port;
    }
}
