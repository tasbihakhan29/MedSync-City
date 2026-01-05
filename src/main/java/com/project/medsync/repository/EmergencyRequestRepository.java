package com.project.medsync.repository;


import com.project.medsync.model.EmergencyRequest;
import com.project.medsync.model.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmergencyRequestRepository extends JpaRepository<EmergencyRequest, Long> {

    List<EmergencyRequest> findByRequester(Hospital hospital);

    List<EmergencyRequest> findBySupplier(Hospital hospital);

    List<EmergencyRequest> findByStatus(String status);
}
