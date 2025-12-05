package com.consultoria.app.repository;

import com.consultoria.app.model.StatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StatusHistoryRepository extends JpaRepository<StatusHistory, Long> {
    List<StatusHistory> findByProjectIdOrderByTimestampDesc(Long projectId);
}
