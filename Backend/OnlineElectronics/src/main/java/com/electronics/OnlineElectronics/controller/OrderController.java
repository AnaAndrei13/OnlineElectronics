package com.electronics.OnlineElectronics.controller;

import com.electronics.OnlineElectronics.model.Order;
import com.electronics.OnlineElectronics.model.OrderStatus;
import com.electronics.OnlineElectronics.service.interfaces.IOrderService;
import org.apache.catalina.connector.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final IOrderService orderService;

    public OrderController(IOrderService orderService) {
        this.orderService = orderService;
    }

    // 1. Create order from cart
    @PostMapping("/create")
    public ResponseEntity<Order> createOrder(@RequestParam Long userId) {
        Order order = orderService.createOrder(userId);
        return ResponseEntity.ok(order);
    }

    // 2. Get all orders for a user
    @GetMapping("/{userId}")
    public ResponseEntity<List<Order>> getOrders(@PathVariable Long userId) {
        List<Order> orders = orderService.getOrdersForUser(userId);
        return ResponseEntity.ok(orders);
    }



    // 3. Get order details by orderId
    @GetMapping("/details/{orderId}")
    public ResponseEntity<Order> getOrderDetails(@PathVariable Long orderId) {
        Order order = orderService.getOrderById(orderId);
        return ResponseEntity.ok(order);
    }

    // 4.Update status order
    @PutMapping("/{orderId}/status")
    public ResponseEntity<Order> updateStatus(@PathVariable Long orderId, @RequestParam OrderStatus status){
        Order updatedOrder= orderService.updateOrderStatus(orderId, status);

        return ResponseEntity.ok(updatedOrder);

    }
}

