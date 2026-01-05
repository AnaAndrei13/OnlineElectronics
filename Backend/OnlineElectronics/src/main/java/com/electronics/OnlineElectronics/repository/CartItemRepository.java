package com.electronics.OnlineElectronics.repository;

import com.electronics.OnlineElectronics.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem,Long> {
}
