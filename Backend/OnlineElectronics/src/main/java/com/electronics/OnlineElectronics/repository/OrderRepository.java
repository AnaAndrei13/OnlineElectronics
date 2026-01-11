package com.electronics.OnlineElectronics.repository;

import com.electronics.OnlineElectronics.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
    boolean existsByStripeSessionId(String stripeSessionId);

    Optional<Order> findByStripeSessionId(String stripeSessionId);
}
