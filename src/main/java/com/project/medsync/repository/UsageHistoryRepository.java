package com.project.medsync.repository;


import com.project.medsync.model.UsageHistory;
import com.project.medsync.model.Hospital;
import com.project.medsync.model.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UsageHistoryRepository extends JpaRepository<UsageHistory, Long> {

    List<UsageHistory> findByHospitalAndMedicine(Hospital hospital, Medicine medicine);
}
