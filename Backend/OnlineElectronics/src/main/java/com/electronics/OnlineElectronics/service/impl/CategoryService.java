package com.electronics.OnlineElectronics.service.impl;
import java.util.NoSuchElementException;
import com.electronics.OnlineElectronics.model.Category;
import com.electronics.OnlineElectronics.repository.CategoryRepository;
import com.electronics.OnlineElectronics.service.interfaces.ICategoryService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService implements ICategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public Category getCategoryByName(String name) {
        return categoryRepository.findByName(name)
                .orElseThrow(() -> new NoSuchElementException("Category not found with id: " + name));
    }

    @Override
    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    @Override
    public Category updateCategory(String name, Category category) {
        Category existing = getCategoryByName(name);
        existing.setName(category.getName());
        existing.setDescription(category.getDescription());
        return categoryRepository.save(existing);
    }

    @Override
    public void deleteCategory(String name) {
        Category existing = getCategoryByName(name);
        categoryRepository.delete(existing);
    }
}
