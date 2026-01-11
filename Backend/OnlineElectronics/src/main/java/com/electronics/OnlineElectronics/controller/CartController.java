package com.electronics.OnlineElectronics.controller;

import com.electronics.OnlineElectronics.model.Cart;
import com.electronics.OnlineElectronics.model.User;
import com.electronics.OnlineElectronics.service.interfaces.ICartService;
import com.electronics.OnlineElectronics.service.interfaces.IUserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/cart")
@RestController
public class CartController {
    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);
    private final ICartService cartService;
    private final IUserService userService;

    public CartController(ICartService cartService, IUserService userService){
        this.cartService=cartService;
        this.userService=userService;
    }


    // 1. Get cart
    @GetMapping("/")
    public ResponseEntity<?> getUserCart(){
      try{
          Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

          if (authentication == null || !authentication.isAuthenticated()
                  || "anonymousUser".equals(authentication.getName())) {
              logger.error("User not authenticated");
              return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                      .body("User not authenticated");
          }

          String email = authentication.getName();
          User user = userService.getUserByEmail(email);

          if (user == null) {
              logger.error("User not found: {}", email);
              return ResponseEntity.status(HttpStatus.NOT_FOUND)
                      .body("User not found");
          }
          Cart cart= cartService.getCartForUser(user.getId());
          if (cart == null) {
              return ResponseEntity.notFound().build();
          }
          return ResponseEntity.ok(cart);

      }catch(Exception e){
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                  .body("Error: " + e.getMessage());
      }
    }

    //2 Add item to card
    @PostMapping("/add/{productId}")
   public ResponseEntity<?> addProduct(@PathVariable Long productId){
        try{
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated()
                    || "anonymousUser".equals(authentication.getName())) {
                logger.error("User not authenticated");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("User not authenticated");
            }

            String email = authentication.getName();
            User user = userService.getUserByEmail(email);

            if (user == null) {
                logger.error("User not found: {}", email);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("User not found");
            }

            Cart cart= cartService.addItemToCart(user.getId(), productId);

            if (cart == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(cart);

        }catch(Exception e){
            logger.error("Error adding item in cart: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }


    //3 Remove item from card
@DeleteMapping("/remove/{productId}")
  public  ResponseEntity<?> removeProduct( @PathVariable Long productId){
    try{
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getName())) {
            logger.error("User not authenticated");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("User not authenticated");
        }

        String email = authentication.getName();


        User user = userService.getUserByEmail(email);

        if (user == null) {
            logger.error("User not found: {}", email);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found");
        }
        Cart cart= cartService.removeItemFromCart(user.getId(), productId);
        if (cart == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(cart);

    }catch(Exception e){
        logger.error("Error remove item: {}", e.getMessage(), e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error: " + e.getMessage());
    }
    }

    // 4. Update quantity
    @PutMapping("/update")
    public ResponseEntity<?> updateQuantity( @RequestParam Long productId, @RequestParam int quantity ) {
        try{
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated()
                    || "anonymousUser".equals(authentication.getName())) {
                logger.error("User not authenticated");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("User not authenticated");
            }

            String email = authentication.getName();

            User user = userService.getUserByEmail(email);

            if (user == null) {
                logger.error("User not found: {}", email);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("User not found");
            }

            Cart cart= cartService.updateQuantity(user.getId(), productId,quantity);

            if (cart == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(cart);

        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error update quantity: " + e.getMessage());
        } }

    // 5. Clear entire cart
    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated()
                    || "anonymousUser".equals(authentication.getName())) {
                logger.error("User not authenticated");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("User not authenticated");
            }

            String email =  authentication.getName();
            logger.info("Clearing cart for user: {}", email);

            User user = userService.getUserByEmail(email);

            if (user == null) {
                logger.error("User not found: {}", email);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("User not found");
            }

            cartService.clearCart(user.getId());
            logger.info("Cart cleared successfully");

            return ResponseEntity.ok("Cart cleared successfully");

        } catch (Exception e) {
            logger.error("Error clearing cart: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

}
