package com.electronics.OnlineElectronics.controller;
import com.electronics.OnlineElectronics.model.Category;
import com.electronics.OnlineElectronics.service.interfaces.ICategoryService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    private final ICategoryService categoryService;

    public CategoryController(ICategoryService categoryService){
        this.categoryService=categoryService;
    }

    @GetMapping
    public List<Category> getAll() {
        return categoryService.getAllCategories();
    }

    @GetMapping("/{name}")
    public Category getByName(@PathVariable String name) {
        return categoryService.getCategoryByName(name);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Category create(@RequestBody Category category) {
        return categoryService.createCategory(category);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{name}")
    public Category update(@PathVariable String name, @RequestBody Category category) {
        return categoryService.updateCategory(name, category);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{name}")
    public void delete(@PathVariable String name) {
        categoryService.deleteCategory(name);
    }

}
