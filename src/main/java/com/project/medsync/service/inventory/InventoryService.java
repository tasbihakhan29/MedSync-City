package com.project.medsync.service.inventory;


import com.project.medsync.model.Stock;
import com.project.medsync.model.Hospital;
import com.project.medsync.model.Medicine;
import com.project.medsync.repository.StockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final StockRepository stockRepository;

    // Add or update stock
    public Stock addOrUpdateStock(Stock stock) {
        Optional<Stock> existing = stockRepository.findByHospitalAndMedicine(
                stock.getHospital(), stock.getMedicine()
        );

        if(existing.isPresent()) {
            Stock s = existing.get();
            s.setQuantity(stock.getQuantity());
            s.setExpiryDate(stock.getExpiryDate());
            return stockRepository.save(s);
        }

        return stockRepository.save(stock);
    }

    // Get all stock of a hospital
    public List<Stock> getByHospital(Hospital hospital) {
        return stockRepository.findByHospital(hospital);
    }

    // Get available stock by medicine and minimum quantity
    public List<Stock> getAvailableByMedicine(Medicine medicine, int minQuantity) {
        return stockRepository.findByMedicineAndQuantityGreaterThan(medicine, minQuantity);
    }

    // Get expiring stocks before a date
    public List<Stock> getExpiringStocks(LocalDate beforeDate) {
        return stockRepository.findByExpiryDateBefore(beforeDate);
    }
}
