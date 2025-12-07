// Criado por Octavio Nascimento
package com.consultoria.app.repository;

import com.consultoria.app.model.Request;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RequestRepository extends JpaRepository<Request, Long> {
    List<Request> findByUserId(Long userId);

    List<Request> findByConsultantId(Long consultantId);

    List<Request> findByStatus(String status);
}
