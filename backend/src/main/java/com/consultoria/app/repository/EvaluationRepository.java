// Criado por Octavio Nascimento
package com.consultoria.app.repository;

import com.consultoria.app.model.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
    Optional<Evaluation> findByRequestId(Long requestId);

    List<Evaluation> findByRequestConsultantId(Long consultantId);
}
