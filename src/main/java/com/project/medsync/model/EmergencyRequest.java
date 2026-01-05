package com.project.medsync.model;



import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "emergency_requests")
public class EmergencyRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Hospital requester;

    @ManyToOne
    private Hospital supplier;

    @ManyToOne
    private Medicine medicine;

    private Integer requestedQuantity;

    private String status; // PENDING / ACCEPTED / REJECTED

    private LocalDateTime requestedAt;
}
