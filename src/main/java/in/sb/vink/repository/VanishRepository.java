package in.sb.vink.repository;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import in.sb.vink.model.Vanish;

@Repository
public interface VanishRepository extends JpaRepository<Vanish, Long> {

   
    @Query(value = "SELECT * FROM vanish v WHERE v.vanish_id = :vanishId", nativeQuery = true)
    Optional<Vanish> findByVanishId(@Param("vanishId") String vanishId);

    // used by the scheduler to delete expired Vanishes..
    void deleteByExpiresAtBefore(LocalDateTime currentTime);
}