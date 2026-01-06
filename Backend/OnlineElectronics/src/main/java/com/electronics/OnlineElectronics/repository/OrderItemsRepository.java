package com.electronics.OnlineElectronics.repository;

import com.electronics.OnlineElectronics.model.OrderItems;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemsRepository extends JpaRepository <OrderItems,Long> {
}
