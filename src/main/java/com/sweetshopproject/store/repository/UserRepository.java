package com.sweetshopproject.store.repository;

import com.sweetshopproject.store.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {
}
