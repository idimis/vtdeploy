package com.vibetribe.backend.infrastructure.usecase.user.auth.service.impl;

import com.vibetribe.backend.common.exceptions.DataNotFoundException;
import com.vibetribe.backend.entity.User;
import com.vibetribe.backend.infrastructure.usecase.user.auth.dto.UserAuth;
import com.vibetribe.backend.infrastructure.usecase.user.repository.UserRepository;
import com.vibetribe.backend.infrastructure.usecase.user.auth.service.GetUserAuthDetailsUsecase;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class GetUserAuthDetailsUsecaseImpl implements GetUserAuthDetailsUsecase {
    private final UserRepository usersRepository;

    public GetUserAuthDetailsUsecaseImpl(UserRepository usersRepository) {
        this.usersRepository = usersRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User existingUser = usersRepository.findByEmailContainsIgnoreCase(username).orElseThrow(() -> new DataNotFoundException("User not found with email: " + username));

        UserAuth userAuth = new UserAuth();
        userAuth.setUser(existingUser);
        return userAuth;
    }
}
