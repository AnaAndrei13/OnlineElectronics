package com.electronics.OnlineElectronics.service.impl;

import com.electronics.OnlineElectronics.model.*;
import com.electronics.OnlineElectronics.repository.*;
import com.electronics.OnlineElectronics.service.interfaces.IOrderService;
import com.electronics.OnlineElectronics.service.interfaces.ICartService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;


@Service
public class OrderService implements IOrderService {
    private final OrderRepository orderRepository;
    private final ICartService cartService;

    public OrderService(OrderRepository orderRepository, ICartService cartService) {
        this.orderRepository = orderRepository;
        this.cartService = cartService;
    }

    // 1.Create an order
    @Override
    public Order createOrder(Long userId) {

        Cart cart = cartService.getCartForUser(userId);

        if (cart.getCartItem().isEmpty()) {
            throw new RuntimeException("Cart is empty. Cannot create order.");
        }

        //  Create order
        Order order = new Order();
        order.setUser(cart.getUser());
        order.setCreatedAt(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);

        double total = 0;

        // Copy items from cart to OrderItem
        for (CartItem cartItem : cart.getCartItem()) {

            OrderItems orderItem = new OrderItems();
            orderItem.setOrder(order);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPriceAtPurchase(cartItem.getProduct().getPrice());

            total += cartItem.getQuantity() * cartItem.getProduct().getPrice();

            order.getItems().add(orderItem);
        }

        order.setTotalPrice(total);

        // Save order
        Order savedOrder = orderRepository.save(order);

        // Clear cart
        cartService.clearCart(userId);

        return savedOrder;
    }

    // Retrieves the complete order history for a specific user.
    @Override
    public List<Order> getOrdersForUser(Long userId) {
        return orderRepository.findByUserId(userId);
    }

   // Retrieves a single order by its ID.
    @Override
    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    @Override
    public Order updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(status);
        return orderRepository.save(order); }
}
