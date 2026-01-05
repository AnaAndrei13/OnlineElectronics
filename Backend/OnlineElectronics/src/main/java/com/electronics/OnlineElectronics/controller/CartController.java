package com.electronics.OnlineElectronics.controller;

import com.electronics.OnlineElectronics.model.Cart;
import com.electronics.OnlineElectronics.service.interfaces.ICartService;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/cart")
@RestController
public class CartController {

    private final ICartService cartService;
    public CartController(ICartService cartService){
        this.cartService=cartService;
    }


    // 1. Get cart
    @GetMapping("/{userId}")
    public ResponseEntity<Cart> getUserCart(@PathVariable  Long userId){
       Cart cart= cartService.getCartForUser(userId);
       if(cart == null){
           return  ResponseEntity.notFound().build();
       }
       else return ResponseEntity.ok(cart);
    }

    //2 Add item to card
    @PostMapping("/add")
   public ResponseEntity<Cart> addProduct(@RequestParam Long userId,@RequestParam Long productId){
        Cart cart= cartService.addItemToCart(userId,productId);
        return ResponseEntity.ok(cart);
    }


    //3 Remove item from card
@DeleteMapping("/remove")
  public  ResponseEntity<Cart> removeProduct(@RequestParam Long userId, @RequestParam Long productId){
        Cart cart= cartService.removeItemFromCart(userId,productId);
        return ResponseEntity.ok(cart);
    }

    // 4. Update quantity
    @PutMapping("/update")
    public ResponseEntity<Cart> updateQuantity( @RequestParam Long userId,
                                                @RequestParam Long productId,
                                                @RequestParam int quantity ) {
        Cart cart = cartService.updateQuantity(userId, productId, quantity);
        return ResponseEntity.ok(cart); }

    // 5. Clear cart
    @DeleteMapping("/clear/{userId}")
    public ResponseEntity<Void> clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
        return ResponseEntity.noContent().build();
    }
}
