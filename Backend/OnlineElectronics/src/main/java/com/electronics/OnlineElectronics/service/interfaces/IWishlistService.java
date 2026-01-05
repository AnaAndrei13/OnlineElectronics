package com.electronics.OnlineElectronics.service.interfaces;
import com.electronics.OnlineElectronics.model.Product;
import com.electronics.OnlineElectronics.model.WishlistItem;
import com.electronics.OnlineElectronics.model.Wishlist;
public interface IWishlistService {
   Wishlist getWishlistForUser(Long userId);
   Wishlist addItemToWishlist(Long userId,Long productId);
   Wishlist removeItemFromWishlist(Long userId,Long productId);
   Wishlist createWishlistForUser(Long userId);
}
