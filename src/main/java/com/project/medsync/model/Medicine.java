package com.project.medsync.model;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@Table(name = "medicines")
public class Medicine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String type;   // injection / tablet
}
