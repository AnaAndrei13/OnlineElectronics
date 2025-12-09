package com.electronics.OnlineElectronics.repository;

import com.electronics.OnlineElectronics.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
