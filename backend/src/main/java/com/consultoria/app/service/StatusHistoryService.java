package com.consultoria.app.service;

import com.consultoria.app.model.Project;
import com.consultoria.app.model.StatusHistory;
import com.consultoria.app.model.User;
import com.consultoria.app.repository.StatusHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StatusHistoryService {
    @Autowired
    private StatusHistoryRepository statusHistoryRepository;

    public StatusHistory createStatusHistory(Project project, User changedBy,
            Project.ProjectStatus oldStatus,
            Project.ProjectStatus newStatus) {
        StatusHistory history = new StatusHistory();
        history.setProject(project);
        history.setChangedBy(changedBy);
        history.setOldStatus(oldStatus);
        history.setNewStatus(newStatus);

        return statusHistoryRepository.save(history);
    }

    public List<StatusHistory> getHistoryByProjectId(Long projectId) {
        return statusHistoryRepository.findByProjectIdOrderByTimestampDesc(projectId);
    }
}
