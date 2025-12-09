package com.electronics.OnlineElectronics.repository;

import com.electronics.OnlineElectronics.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoryRepository extends JpaRepository <Category,String>{
    Optional<Category> findByName(String name);
}
