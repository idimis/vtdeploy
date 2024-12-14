package com.vibetribe.backend.infrastructure.usecase.user.service;

import com.vibetribe.backend.common.response.PaginatedResponse;
import com.vibetribe.backend.common.util.PaginationUtil;
import com.vibetribe.backend.common.util.ReferralCodeGenerator;
import com.vibetribe.backend.entity.Event;
import com.vibetribe.backend.entity.User;
import com.vibetribe.backend.infrastructure.usecase.event.repository.EventRepository;
import com.vibetribe.backend.infrastructure.usecase.user.dto.CreateUserRequestDTO;
import com.vibetribe.backend.infrastructure.usecase.user.dto.UpdateUserRequestDTO;
import com.vibetribe.backend.infrastructure.usecase.user.dto.UserPublicDetailsDTO;
import com.vibetribe.backend.infrastructure.usecase.user.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ReferralService referralService;
    private final EventRepository eventRepository;

    private static final String DEFAULT_PROFILE_ICON_URL = "https://img.icons8.com/?size=100&id=tZuAOUGm9AuS&format=png&color=000000";

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       ReferralService referralService,
                       EventRepository eventRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.referralService = referralService;
        this.eventRepository = eventRepository;
    }

    @Transactional
    public User createUser(CreateUserRequestDTO createUserRequestDTO) {
        validateRole(createUserRequestDTO.getRole());

        User user = mapToUserEntity(createUserRequestDTO);
        User savedUser = userRepository.save(user);

        // Handle referral code if provided
        if (createUserRequestDTO.getReferralCode() != null) {
            referralService.handleReferral(createUserRequestDTO.getReferralCode(), savedUser);
        }

        return savedUser;
    }

    private void validateRole(String role) {
        if (!role.equalsIgnoreCase("customer") && !role.equalsIgnoreCase("organizer")) {
            throw new IllegalArgumentException("Invalid role specified");
        }
    }

    private User mapToUserEntity(CreateUserRequestDTO createUserRequestDTO) {
        User user = new User();
        user.setName(createUserRequestDTO.getName());
        user.setEmail(createUserRequestDTO.getEmail());
        user.setPassword(passwordEncoder.encode(createUserRequestDTO.getPassword()));
        user.setRole(createUserRequestDTO.getRole().toUpperCase());
        user.setReferralCode(ReferralCodeGenerator.generateReferralCode(createUserRequestDTO.getEmail()));

        // Set default profile icon if not provided
        user.setPhotoProfileUrl(createUserRequestDTO.getPhotoProfileUrl() != null ?
                createUserRequestDTO.getPhotoProfileUrl() : DEFAULT_PROFILE_ICON_URL);

        // Set additional fields for organizer
        if ("organizer".equalsIgnoreCase(createUserRequestDTO.getRole())) {
            user.setReferralCode(null);

            if (createUserRequestDTO.getWebsite() == null) {
                throw new IllegalArgumentException("Website is mandatory for organizer");
            }

            if (createUserRequestDTO.getPhoneNumber() == null) {
                throw new IllegalArgumentException("Phone number is mandatory for organizer");
            }

            if (createUserRequestDTO.getAddress() == null) {
                throw new IllegalArgumentException("Address is mandatory for organizer");
            }

            user.setWebsite(createUserRequestDTO.getWebsite());
            user.setPhoneNumber(createUserRequestDTO.getPhoneNumber());
            user.setAddress(createUserRequestDTO.getAddress());
        }

        return user;
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateUser(Long userId, UpdateUserRequestDTO updateUserRequestDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (updateUserRequestDTO.getName() != null && !updateUserRequestDTO.getName().isEmpty()) {
            user.setName(updateUserRequestDTO.getName());
        }

        if (updateUserRequestDTO.getEmail() != null && !updateUserRequestDTO.getEmail().isEmpty()) {
            if (userRepository.existsByEmail(updateUserRequestDTO.getEmail())) {
                throw new RuntimeException("Email is already in use");
            }
            user.setEmail(updateUserRequestDTO.getEmail());
        }

        if (updateUserRequestDTO.getPassword() != null && !updateUserRequestDTO.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(updateUserRequestDTO.getPassword()));
        }

        user.setPhotoProfileUrl(updateUserRequestDTO.getPhotoProfileUrl());
        user.setWebsite(updateUserRequestDTO.getWebsite());
        user.setPhoneNumber(updateUserRequestDTO.getPhoneNumber());
        user.setAddress(updateUserRequestDTO.getAddress());

        return userRepository.save(user);
    }

    public UserPublicDetailsDTO getUserDetails(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        UserPublicDetailsDTO userDetails = new UserPublicDetailsDTO();
        userDetails.setUserId(user.getId());
        userDetails.setPhotoProfileUrl(user.getPhotoProfileUrl());
        userDetails.setFullName(user.getName());
        userDetails.setEmail(user.getEmail());

        if (user.getRole().equals("ORGANIZER")) {
            userDetails.setWebsite(user.getWebsite());
            Pageable page = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(Sort.Direction.DESC, "createdAt"));
            Page<Event> events = eventRepository.findByOrganizerId(pageable, userId);
            PaginatedResponse<Event> paginatedEvents = PaginationUtil.toPaginatedResponse(events);
            userDetails.setEvents(paginatedEvents);
        }

        return userDetails;
    }
}