package com.electronics.OnlineElectronics.service.impl;

import com.electronics.OnlineElectronics.model.Cart;
import com.electronics.OnlineElectronics.model.Product;
import com.electronics.OnlineElectronics.model.User;
import com.electronics.OnlineElectronics.model.CartItem;
import com.electronics.OnlineElectronics.service.interfaces.ICartService;
import com.electronics.OnlineElectronics.repository.*;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CartService implements ICartService {
 private final CartRepository cartRepository;
 private final CartItemRepository cartItemRepository;
 private final ProductRepository productRepository;
 private final UserRepository userRepository;

    public CartService(CartRepository cartRepository, CartItemRepository cartItemRepository, ProductRepository productRepository, UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }


    public Cart getCartForUser(Long userId){
     return cartRepository.findByUserId(userId)
           .orElseGet(() -> createCartForUser(userId));
    }

    private Cart createCartForUser(Long userId) {
       User user = userRepository.findById(userId)
               .orElseThrow(() -> new RuntimeException("User not found"));
       Cart cart = new Cart();
       cart.setUser(user);
       return cartRepository.save(cart); }


   public Cart addItemToCart(Long userId, Long productId){
    Cart cart = getCartForUser(userId);
    Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));

    Optional<CartItem> existingItem = cart.getCartItem().stream()
            .filter(item -> item.getProduct().getId().equals(productId)) .findFirst();

     if (existingItem.isPresent()) {
      CartItem item = existingItem.get();
      item.setQuantity(item.getQuantity() + 1); }

     else {
       CartItem newItem = new CartItem();
       newItem.setProduct(product);
       newItem.setCart(cart);
       newItem.setQuantity(1);
       cart.getCartItem().add(newItem);
     }
     return cartRepository.save(cart);

    }


    public Cart removeItemFromCart(Long userId, Long productId){

     Cart cart= getCartForUser(userId);

     CartItem item = cart.getCartItem().stream()
                      .filter(i -> i.getProduct().getId().equals(productId))
                     .findFirst() .orElseThrow(() -> new RuntimeException("Item not found in cart"));

     if (item.getQuantity() > 1) {
       item.setQuantity(item.getQuantity() - 1);
     }
     else
     {
       cart.getCartItem().remove(item);
       cartItemRepository.delete(item);
     }

    return cartRepository.save(cart);
    }


    public Cart updateQuantity(Long userId, Long productId, int quantity){
     Cart cart = getCartForUser(userId);
     CartItem item = cart.getCartItem().stream()
             .filter(i -> i.getProduct().getId().equals(productId)).findFirst()
             .orElseThrow(() -> new RuntimeException("Item not found in cart"));

     if (quantity <= 0) {
      cart.getCartItem().remove(item);
      cartItemRepository.delete(item);
     }
     else {
      item.setQuantity(quantity);
     }
     return cartRepository.save(cart);
    }

    //Reset cart
    public void clearCart(Long userId){
     Cart cart= getCartForUser(userId);
     cart.getCartItem().clear();
      cartRepository.save(cart);
    }
}
