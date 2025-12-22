package com.sweetshopproject.store.controller;

import com.sweetshopproject.store.entity.Sweets;
import com.sweetshopproject.store.exception.InvalidDataException;
import com.sweetshopproject.store.model.QuantityRequest;
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

    // GET ALL
    @GetMapping
    public List<Sweets> getAllSweets() {
        return sweetService.getAllSweets();
    }

    // UPDATE (ADMIN)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Sweets updateSweet(@PathVariable Integer id, @RequestBody Sweets sweet) throws InvalidDataException {
        return sweetService.updateSweet(id, sweet);
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

    // ADD SWEET (ADMIN)
    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public Sweets addSweet(@RequestBody Sweets sweet) {
        return sweetService.createSweet(sweet);
    }

    // RESTOCK (ADMIN)
    @PostMapping("/{id}/restock")
    @PreAuthorize("hasRole('ADMIN')")
    public String restockSweet(@PathVariable Integer id,
                               @RequestBody QuantityRequest request)
            throws InvalidDataException {

        return sweetService.restockSweet(id, request.getQuantity());
    }

    // PURCHASE
    @PostMapping("/{id}/purchase")
    public String purchaseSweet(@PathVariable Integer id,
                                @RequestBody QuantityRequest request)
            throws InvalidDataException {

        return sweetService.purchaseSweet(id, request.getQuantity());
    }

    // DELETE
    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Integer id) {
        sweetService.deleteSweet(id);
    }
}
