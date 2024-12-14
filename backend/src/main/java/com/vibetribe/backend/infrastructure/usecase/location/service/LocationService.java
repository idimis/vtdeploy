package com.vibetribe.backend.infrastructure.usecase.location.service;

import com.vibetribe.backend.entity.Location;
import com.vibetribe.backend.infrastructure.usecase.location.repository.LocationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocationService {

    private final LocationRepository locationRepository;

    public LocationService(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    public List<Location> getAllLocations() {
        return locationRepository.findAll();
    }
}
