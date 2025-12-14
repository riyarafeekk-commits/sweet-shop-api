package com.sweetshopproject.store.controller;

import com.sweetshopproject.store.entity.Sweets;
import com.sweetshopproject.store.exception.InvalidDataException;
import com.sweetshopproject.store.service.SweetService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sweets")
public class SweetController {

    private final SweetService sweetService;

    public SweetController(SweetService sweetService) {
        this.sweetService = sweetService;
    }

    // SEARCH
    @GetMapping("/search")
    public List<Sweets> searchSweets(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice)
            throws InvalidDataException {

        return sweetService.searchSweets(name, category, minPrice, maxPrice);
    }

    // RESTOCK (ADMIN)
    @PostMapping("/{id}/restock")
    @PreAuthorize("hasRole('ADMIN')")
    public String restockSweet(@PathVariable Integer id,
                               @RequestParam int quantity)
            throws InvalidDataException {

        return sweetService.restockSweet(id, quantity);
    }

    // PURCHASE
    @PostMapping("/{id}/purchase")
    public String purchaseSweet(@PathVariable Integer id,
                                @RequestParam int quantity)
            throws InvalidDataException {

        return sweetService.purchaseSweet(id, quantity);
    }

    // DELETE
    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Integer id) {
        sweetService.deleteSweet(id);
    }
}
