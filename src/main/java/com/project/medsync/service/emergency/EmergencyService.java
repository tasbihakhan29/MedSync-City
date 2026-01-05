package com.project.medsync.service.emergency;


import com.project.medsync.model.EmergencyRequest;
import com.project.medsync.model.Hospital;
import com.project.medsync.model.Medicine;
import com.project.medsync.repository.EmergencyRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmergencyService {

    private final EmergencyRequestRepository emergencyRepository;

    public EmergencyRequest createRequest(Hospital requester, Medicine medicine, int quantity) {
        EmergencyRequest request = new EmergencyRequest();
        request.setRequester(requester);
        request.setMedicine(medicine);
        request.setRequestedQuantity(quantity);
        request.setStatus("PENDING");
        request.setRequestedAt(LocalDateTime.now());

        return emergencyRepository.save(request);
    }

    public List<EmergencyRequest> getRequestsByRequester(Hospital hospital) {
        return emergencyRepository.findByRequester(hospital);
    }

    public List<EmergencyRequest> getPendingRequests() {
        return emergencyRepository.findByStatus("PENDING");
    }

    public EmergencyRequest updateStatus(EmergencyRequest request, String status) {
        request.setStatus(status);
        return emergencyRepository.save(request);
    }
}
