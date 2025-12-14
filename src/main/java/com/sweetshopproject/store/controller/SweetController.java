package com.sweetshopproject.store.controller;

import com.sweetshopproject.store.entity.Sweets;
import com.sweetshopproject.store.repository.SweetsRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sweets")
public class SweetController {

    private final SweetsRepository sweetRepository;

    public SweetController(SweetsRepository sweetRepository) {
        this.sweetRepository = sweetRepository;
    }

    @PostMapping("/addSweet")
    public Sweets addSweet(@RequestBody Sweets sweet) {
        return sweetRepository.save(sweet);
    }

    @GetMapping("/list-sweet")
    public List<Sweets> getAll() {
        return sweetRepository.findAll();
    }

    @PutMapping("/update/{id}")
    public Sweets update(@PathVariable Integer id, @RequestBody Sweets sweet) {
        Sweets sweet1 = sweetRepository.findById(id).orElseThrow();
        sweet1.setName(sweet.getName());
        sweet1.setCategory(sweet.getCategory());
        sweet1.setPrice(sweet.getPrice());
        sweet1.setQuantity(sweet.getQuantity());
        return sweetRepository.save(sweet1);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Integer id) {
        sweetRepository.deleteById(id);
    }
}
