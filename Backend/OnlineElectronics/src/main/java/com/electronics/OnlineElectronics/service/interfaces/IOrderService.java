package com.electronics.OnlineElectronics.service.interfaces;

import com.electronics.OnlineElectronics.model.Order;
import com.electronics.OnlineElectronics.model.OrderStatus;

import java.util.List;
import java.util.Optional;

public interface IOrderService {
    Order createOrder(Long userId);
    List<Order> getOrdersForUser(Long userId);
    Order getOrderById(Long orderId);
     Order updateOrderStatus(Long orderId, OrderStatus status);
}
