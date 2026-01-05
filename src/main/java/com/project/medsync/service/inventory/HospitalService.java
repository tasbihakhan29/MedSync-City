package com.project.medsync.service.inventory;


import com.project.medsync.model.Hospital;
import com.project.medsync.repository.HospitalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class HospitalService {

    private final HospitalRepository hospitalRepository;

    // Save or update a hospital
    public Hospital saveHospital(Hospital hospital) {
        return hospitalRepository.save(hospital);
    }

    // Find hospital by code
    public Optional<Hospital> getByHospitalCode(String code) {
        return hospitalRepository.findByHospitalCode(code);
    }

    // Find by ID
    public Optional<Hospital> getById(Long id) {
        return hospitalRepository.findById(id);
    }
}
