package com.sweetshopproject.store.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "sweets")
@Data
public class Sweets {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
    private String category;
    private Double price;
    private Integer quantity;
}
