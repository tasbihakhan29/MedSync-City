package com.project.medsync.service.ml;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
@RequiredArgsConstructor
public class MlService {

    private final WebClient webClient = WebClient.create("http://localhost:5000");

    // Call Flask ML API for prediction
    public int predictNext7DaysUsage(Long hospitalId, Long medicineId) {
        Integer predicted = webClient.get()
                .uri("/predict?hospitalId=" + hospitalId + "&medicineId=" + medicineId)
                .retrieve()
                .bodyToMono(Integer.class)
                .block();

        return predicted != null ? predicted : 0;
    }
}
