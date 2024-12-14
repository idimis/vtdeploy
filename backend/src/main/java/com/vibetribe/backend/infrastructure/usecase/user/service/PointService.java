package com.vibetribe.backend.infrastructure.usecase.user.service;

import com.vibetribe.backend.entity.User;
import com.vibetribe.backend.infrastructure.usecase.user.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class PointService {
    private final UserRepository userRepository;

    public PointService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void addPointsToReferrer(User referrer, double points) {
        LocalDateTime expirationDate = LocalDateTime.now().plusMonths(3);
        referrer.addPoints(points, expirationDate);
        userRepository.save(referrer);
    }
}
