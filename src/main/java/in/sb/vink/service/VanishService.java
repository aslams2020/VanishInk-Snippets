package in.sb.vink.service;

import in.sb.vink.model.Vanish;
import in.sb.vink.repository.VanishRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.scheduling.annotation.Scheduled;

@Service
@Transactional
public class VanishService {

    @Autowired
    private VanishRepository vanishRepository;

    @Transactional
    public Vanish createVanish(Vanish vanish) {
        return vanishRepository.save(vanish);
    }

//    public Optional<Vanish> getVanishByVanishId(String vanishId) {
//        return vanishRepository.findByVanishId(vanishId);
//    }
    public Optional<Vanish> getVanishByVanishId(String vanishId) {
        // Use the method that fetches files too
        return vanishRepository.findByVanishIdWithFiles(vanishId);
    }

    @Scheduled(cron = "0 0 2 * * ?") // Run every day at 2 AM
    @Transactional
    public void cleanupExpiredVanishes() {
        System.out.println("Running scheduled task: Cleaning up expired vanishes...");
        try {
            vanishRepository.deleteByExpiresAtBefore(LocalDateTime.now());   // DELETE FROM vanish WHERE expires_at < NOW()
            System.out.println("Cleanup completed successfully.");
        } catch (Exception e) {
            System.err.println("Error during cleanup: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    public void deleteVanishById(Long id) {
        vanishRepository.deleteById(id);
    }
    
}