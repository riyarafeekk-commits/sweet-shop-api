package com.sweetshopproject.store.service;

import com.sweetshopproject.store.entity.Sweets;
import com.sweetshopproject.store.exception.InvalidDataException;
import com.sweetshopproject.store.repository.SweetsRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SweetService {

    private final SweetsRepository sweetRepository;

    public SweetService(SweetsRepository sweetRepository) {
        this.sweetRepository = sweetRepository;
    }

    public List<Sweets> searchSweets(String name, String category,
                                     Double minPrice, Double maxPrice)
            throws InvalidDataException {

        List<Sweets> sweets = sweetRepository.findAll();

        if (sweets.isEmpty()) {
            throw new InvalidDataException(
                    "Invalid data, no sweets available",
                    "No sweets found"
            );
        }

        return sweets.stream()
                .filter(s -> name == null || s.getName().toLowerCase().contains(name.toLowerCase()))
                .filter(s -> category == null || s.getCategory().equalsIgnoreCase(category))
                .filter(s -> minPrice == null || s.getPrice() >= minPrice)
                .filter(s -> maxPrice == null || s.getPrice() <= maxPrice)
                .toList();
    }

    public Sweets createSweet(Sweets sweet) {
        return sweetRepository.save(sweet);
    }

    public String restockSweet(Integer id, int quantity)
            throws InvalidDataException {

        Sweets sweet = sweetRepository.findById(id)
                .orElseThrow(() ->
                        new InvalidDataException(
                                "Sweet not found with id " + id,
                                "Sweet not found"
                        )
                );

        int newQuantity = sweet.getQuantity() + quantity;

        if (newQuantity < 0) {
            throw new InvalidDataException(
                    "Cannot reduce stock below zero. Current stock: " + sweet.getQuantity(),
                    "Insufficient stock"
            );
        }

        sweet.setQuantity(newQuantity);
        sweetRepository.save(sweet);

        return "Stock updated. New quantity for " + sweet.getName() + ": " + newQuantity;
    }

    public String purchaseSweet(Integer id, int quantity)
            throws InvalidDataException {

        if (quantity <= 0) {
            throw new InvalidDataException(
                    "Quantity must be greater than zero",
                    "Invalid quantity"
            );
        }

        Sweets sweet = sweetRepository.findById(id)
                .orElseThrow(() ->
                        new InvalidDataException(
                                "Sweet not found with id " + id,
                                "Sweet not found"
                        )
                );

        if (sweet.getQuantity() < quantity) {
            throw new InvalidDataException(
                    "Not enough stock available",
                    "Stock insufficient"
            );
        }

        sweet.setQuantity(sweet.getQuantity() - quantity);
        sweetRepository.save(sweet);

        return "Purchased " + quantity + " " + sweet.getName();
    }

    public void deleteSweet(Integer id) {
        sweetRepository.deleteById(id);
    }

    public List<Sweets> getAllSweets() {
        return sweetRepository.findAll();
    }

    public Sweets updateSweet(Integer id, Sweets sweetDetails)
            throws InvalidDataException {

        Sweets sweet = sweetRepository.findById(id)
                .orElseThrow(() ->
                        new InvalidDataException(
                                "Sweet not found with id " + id,
                                "Sweet not found"
                        )
                );

        sweet.setName(sweetDetails.getName());
        sweet.setCategory(sweetDetails.getCategory());
        sweet.setPrice(sweetDetails.getPrice());

        // Note: Quantity is usually handled via restock/purchase but we allow update here too
        if(sweetDetails.getQuantity() != null) {
            sweet.setQuantity(sweetDetails.getQuantity());
        }

        return sweetRepository.save(sweet);
    }
}


