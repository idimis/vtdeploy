package com.vibetribe.backend.infrastructure.usecase.user.repository;

import com.vibetribe.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailContainsIgnoreCase(String email);
    Optional<User> findByReferralCode(String referralCode);
    boolean existsByEmail(String email);
}
