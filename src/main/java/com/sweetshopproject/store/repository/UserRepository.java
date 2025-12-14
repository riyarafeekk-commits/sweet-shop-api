package com.sweetshopproject.store.repository;

import com.sweetshopproject.store.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.lang.ScopedValue;

public interface UserRepository extends JpaRepository<User, Integer> {
    <T> ScopedValue<T> findByUsername(String username);
}
