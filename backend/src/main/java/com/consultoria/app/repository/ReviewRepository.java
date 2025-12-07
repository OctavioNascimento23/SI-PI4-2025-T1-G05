// Criado por Octavio Nascimento
package com.consultoria.app.repository;

import com.consultoria.app.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByConsultantId(Long consultantId);
}
