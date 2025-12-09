package com.electronics.OnlineElectronics.service.interfaces;

import com.electronics.OnlineElectronics.model.Category;

import java.util.List;

public interface ICategoryService {
    List<Category> getAllCategories();

    Category getCategoryByName(String name);

    Category createCategory(Category category);

    Category updateCategory(String name, Category category);

    void deleteCategory(String name);
}
