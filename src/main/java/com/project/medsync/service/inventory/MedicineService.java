package com.project.medsync.service.inventory;


import com.project.medsync.model.Medicine;
import com.project.medsync.repository.MedicineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MedicineService {

    private final MedicineRepository medicineRepository;

    public Medicine save(Medicine medicine) {
        return medicineRepository.save(medicine);
    }

    public Optional<Medicine> getByName(String name) {
        return medicineRepository.findByName(name);
    }

    public List<Medicine> getAll() {
        return medicineRepository.findAll();
    }
}
