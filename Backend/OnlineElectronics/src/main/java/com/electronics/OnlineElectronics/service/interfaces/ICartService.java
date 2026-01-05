package com.electronics.OnlineElectronics.service.interfaces;

import com.electronics.OnlineElectronics.model.Cart;
import com.electronics.OnlineElectronics.model.CartItem;

public interface ICartService {
    Cart addItemToCart(Long userId,Long productId);
    Cart removeItemFromCart(Long userId, Long productId);
    Cart getCartForUser(Long userId);
    Cart updateQuantity(Long userId, Long productId, int quantity);
    void clearCart(Long userId);

}
