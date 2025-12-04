package com.consultoria.app.tcp;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.consultoria.app.tcp.handler.CommandHandler;

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
        log.info("══════════════════════════════════════════════════════════════════════");
        log.info("🚀 TCPServer.initialize() iniciado...");
        
        // Registra command handlers
        if (commandHandlersList != null) {
            log.info("🔧 DESCOBERTA: Encontrados {} CommandHandlers no Spring Context", commandHandlersList.size());
            
            int index = 1;
            for (CommandHandler handler : commandHandlersList) {
                String commandType = handler.getCommandType();
                commandHandlers.put(commandType, handler);
                log.info("  [{}] ✅ Registrado - Tipo: '{}' | Classe: {} | HashCode: {}", 
                        index, 
                        commandType, 
                        handler.getClass().getSimpleName(),
                        handler.getClass().hashCode());
                if (commandType.equals("CHAT")) {
                    log.info("     🎯 CHAT Handler detectado e registrado com sucesso!");
                }
                index++;
            }
            log.info("🎯 RESUMO: Total de handlers registrados = {}", commandHandlers.size());
            log.info("📋 TIPOS DISPONÍVEIS: {}", commandHandlers.keySet());
            
            // Validação final
            if (commandHandlers.containsKey("CHAT")) {
                log.info("✅ VALIDAÇÃO OK: CHAT handler está disponível no mapa");
            } else {
                log.error("❌ VALIDAÇÃO FALHOU: CHAT handler NÃO está no mapa!");
            }
        } else {
            log.error("❌ ERRO CRÍTICO: commandHandlersList é NULL! Nenhum handler será registrado.");
        }
        log.info("══════════════════════════════════════════════════════════════════════");

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

            log.info("===========================================");
            log.info("Servidor TCP/IP iniciado na porta {}", port);
            log.info("Aguardando conexões...");
            log.info("===========================================");

            while (running) {
                try {
                    Socket clientSocket = serverSocket.accept();
                    ClientHandler clientHandler = new ClientHandler(clientSocket, commandHandlers);
                    threadPool.execute(clientHandler);
                } catch (IOException e) {
                    if (running) {
                        log.error("Erro ao aceitar conexão", e);
                    }
                }
            }
        } catch (IOException e) {
            log.error("Erro ao iniciar servidor TCP/IP", e);
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
