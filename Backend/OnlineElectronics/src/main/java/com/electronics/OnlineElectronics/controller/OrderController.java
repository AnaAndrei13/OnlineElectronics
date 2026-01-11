package com.electronics.OnlineElectronics.controller;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;
import com.electronics.OnlineElectronics.model.CartItem;
import com.electronics.OnlineElectronics.model.Cart;
import com.electronics.OnlineElectronics.model.Order;
import com.electronics.OnlineElectronics.model.OrderStatus;
import com.electronics.OnlineElectronics.model.User;
import com.electronics.OnlineElectronics.service.interfaces.IOrderService;
import com.electronics.OnlineElectronics.service.interfaces.IUserService;
import com.electronics.OnlineElectronics.service.interfaces.ICartService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);
    private final IOrderService orderService;
    private final IUserService userService;

    private final ICartService cartService;

    public OrderController(IOrderService orderService, IUserService userService, ICartService cartService) {
        this.orderService = orderService;
        this.userService = userService;
        this.cartService=cartService;
    }

    // 1. Create order from cart
    @PostMapping("/create")
    public ResponseEntity<?> createOrder() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated()
                    || "anonymousUser".equals(authentication.getName())) {
                logger.error("User not authenticated");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("User not authenticated");
            }

            String email = authentication.getName();
            logger.info("Creating order for user: {}", email);

            User user = userService.getUserByEmail(email);

            if (user == null) {
                logger.error("User not found: {}", email);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("User not found");
            }

            Order order = orderService.createOrder(user.getId());
            logger.info("Order created successfully with ID: {}", order.getId());

            return ResponseEntity.ok(order);

        } catch (Exception e) {
            logger.error("Error creating order: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    // 2. Get all orders(history orders) for authenticated user
    @GetMapping("/my-orders")
    public ResponseEntity<?> getMyOrders() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated()
                    || "anonymousUser".equals(authentication.getName())) {
                logger.error("User not authenticated");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("User not authenticated");
            }

            String email = authentication.getName();
            logger.info("Fetching orders for user: {}", email);

            User user = userService.getUserByEmail(email);

            if (user == null) {
                logger.error("User not found: {}", email);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("User not found");
            }

            List<Order> orders = orderService.getOrdersForUser(user.getId());
            logger.info("Found {} orders for user", orders.size());

            return ResponseEntity.ok(orders);

        } catch (Exception e) {
            logger.error("Error fetching orders: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    // 2b. Get all orders for a specific user (ADMIN only )
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getOrdersForUser(@PathVariable Long userId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated()
                    || "anonymousUser".equals(authentication.getName())) {
                logger.error("User not authenticated");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("User not authenticated");
            }

            logger.info("Admin fetching orders for userId: {}", userId);
            List<Order> orders = orderService.getOrdersForUser(userId);

            return ResponseEntity.ok(orders);

        } catch (Exception e) {
            logger.error("Error fetching orders for user {}: {}", userId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    // 3. Get order details by orderId
    @GetMapping("/details/{orderId}")
    public ResponseEntity<?> getOrderDetails(@PathVariable Long orderId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated()
                    || "anonymousUser".equals(authentication.getName())) {
                logger.error("User not authenticated");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("User not authenticated");
            }

            String email = authentication.getName();
            logger.info("Fetching order details {} for user: {}", orderId, email);

            User user = userService.getUserByEmail(email);

            if (user == null) {
                logger.error("User not found: {}", email);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("User not found");
            }

            Order order = orderService.getOrderById(orderId);

            if (order == null) {
                logger.error("Order not found: {}", orderId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Order not found");
            }

            if (!order.getUser().getId().equals(user.getId())) {
                logger.error("User {} attempted to access order {} belonging to another user",
                        user.getId(), orderId);
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Access denied: This order does not belong to you");
            }

            return ResponseEntity.ok(order);

        } catch (Exception e) {
            logger.error("Error fetching order details: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    // 4. Update order status (ADMIN only)
    @PutMapping("/{orderId}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long orderId,
                                          @RequestParam OrderStatus status) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated()
                    || "anonymousUser".equals(authentication.getName())) {
                logger.error("User not authenticated");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("User not authenticated");
            }

            if (!authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))) {
                logger.error("User {} attempted to update order status without admin rights",
                        authentication.getName());
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                         .body("Access denied: Admin rights required");
            }

            logger.info("Updating order {} status to {}", orderId, status);
            Order updatedOrder = orderService.updateOrderStatus(orderId, status);
            logger.info("Order status updated successfully");

            return ResponseEntity.ok(updatedOrder);

        } catch (Exception e) {
            logger.error("Error updating order status: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    //Creates a Stripe Payment Intent for payment processing
    @PostMapping("/checkout/create-payment-intent")
    public ResponseEntity<?> createPaymentIntent() {
        try {
            // 1. AUTHENTICATION - Check if user is authenticated
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated()
                    || "anonymousUser".equals(authentication.getName())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not authenticated"));
            }

            // 2. USER IDENTIFICATION - Retrieve user from database
            String email = authentication.getName();
            User user = userService.getUserByEmail(email);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User not found"));
            }

            // 3. CART VALIDATION - Check if user has items in cart
            Cart cart = cartService.getCartForUser(user.getId());

            if (cart == null || cart.getCartItem().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Cart is empty"));
            }

            // 4. CALCULATE TOTAL - Convert prices to cents (Stripe uses smallest currency unit)
            long totalAmount = 0;
            for (CartItem item : cart.getCartItem()) {
                totalAmount += Math.round(item.getProduct().getPrice() * 100) * item.getQuantity();
            }

            // 5. CREATE PAYMENT INTENT - Configure payment in Stripe
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(totalAmount)              // Amount in cents
                    .setCurrency("ron")                  // Currency (RON, EUR, USD, etc.)
                    .addPaymentMethodType("card")        // Accepted payment type (card)
                    .setConfirmationMethod(PaymentIntentCreateParams.ConfirmationMethod.AUTOMATIC) // Automatic confirmation
                    .putMetadata("userId", user.getId().toString())    // Metadata for identification
                    .putMetadata("userEmail", email)                   // User email for reference
                    .build();

            // 6. EXECUTION - Send request to Stripe API
            PaymentIntent intent = PaymentIntent.create(params);

            // 7. RESPONSE - Return clientSecret to frontend (required for Payment Element)
            // Frontend will use this secret to display the payment form
            return ResponseEntity.ok(Map.of(
                    "clientSecret", intent.getClientSecret(),  // Secret for Stripe.js
                    "amount", totalAmount                       // Amount for display (optional)
            ));

        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Stripe error: " + e.getMessage()));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}

