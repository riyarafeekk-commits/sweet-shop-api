package com.sweetshopproject.store.repository;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.sweetshopproject.store.entity.Sweets;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SweetsRepository extends JpaRepository<Sweets, Integer> {
}
