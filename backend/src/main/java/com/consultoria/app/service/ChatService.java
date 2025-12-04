package com.consultoria.app.service;

import com.consultoria.app.model.ChatMessage;
import com.consultoria.app.model.Project;
import com.consultoria.app.model.User;
import com.consultoria.app.repository.ChatMessageRepository;
import com.consultoria.app.repository.ProjectRepository;
import com.consultoria.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatService {
    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    public ChatMessage sendMessage(Long projectId, Long userId, String content) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        ChatMessage message = new ChatMessage();
        message.setProject(project);
        message.setSender(user);
        message.setContent(content);

        return chatMessageRepository.save(message);
    }

    public List<ChatMessage> getMessagesByProjectId(Long projectId, Long userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));

        return chatMessageRepository.findByProjectIdOrderByTimestampAsc(projectId);
    }
}
