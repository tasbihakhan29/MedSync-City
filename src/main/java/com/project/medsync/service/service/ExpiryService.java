package com.project.medsync.service.service;


import com.project.medsync.model.Stock;
import com.project.medsync.model.Hospital;
import com.project.medsync.repository.StockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpiryService {

    private final StockRepository stockRepository;

    public List<Stock> getExpiringStocks(Hospital hospital, int daysThreshold) {
        LocalDate targetDate = LocalDate.now().plusDays(daysThreshold);
        List<Stock> expiring = stockRepository.findByExpiryDateBefore(targetDate);
        // filter by hospital
        expiring.removeIf(stock -> !stock.getHospital().equals(hospital));
        return expiring;
    }
}
