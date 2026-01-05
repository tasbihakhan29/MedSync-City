package com.project.medsync.repository;


import com.project.medsync.model.Stock;
import com.project.medsync.model.Hospital;
import com.project.medsync.model.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface StockRepository extends JpaRepository<Stock, Long> {

    List<Stock> findByHospital(Hospital hospital);

    Optional<Stock> findByHospitalAndMedicine(Hospital hospital, Medicine medicine);

    List<Stock> findByExpiryDateBefore(LocalDate date);

    List<Stock> findByMedicineAndQuantityGreaterThan(Medicine medicine, Integer quantity);
}
