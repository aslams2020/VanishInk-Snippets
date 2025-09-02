package in.sb.vink.service;

import in.sb.vink.model.Vanish;
import in.sb.vink.repository.VanishRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class VanishService {

    @Autowired
    private VanishRepository vanishRepository;

    @Transactional
    public Vanish createVanish(Vanish vanish) {
        return vanishRepository.save(vanish);
    }

    public Optional<Vanish> getVanishByVanishId(String vanishId) {
        return vanishRepository.findByVanishId(vanishId);
    }

    public void cleanupExpiredVanishes() {
        vanishRepository.deleteByExpiresAtBefore(LocalDateTime.now());
    }
}