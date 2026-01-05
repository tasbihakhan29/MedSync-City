package com.project.medsync.service.usage;


import com.project.medsync.model.UsageHistory;
import com.project.medsync.model.Hospital;
import com.project.medsync.model.Medicine;
import com.project.medsync.repository.UsageHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsageHistoryService {

    private final UsageHistoryRepository usageRepository;

    public UsageHistory saveUsage(UsageHistory usage) {
        return usageRepository.save(usage);
    }

    public List<UsageHistory> getHistory(Hospital hospital, Medicine medicine) {
        return usageRepository.findByHospitalAndMedicine(hospital, medicine);
    }
}
