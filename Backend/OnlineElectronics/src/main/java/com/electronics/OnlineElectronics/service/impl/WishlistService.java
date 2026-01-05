package com.electronics.OnlineElectronics.service.impl;

import com.electronics.OnlineElectronics.model.Product;
import com.electronics.OnlineElectronics.model.User;
import com.electronics.OnlineElectronics.model.Wishlist;
import com.electronics.OnlineElectronics.model.WishlistItem;
import com.electronics.OnlineElectronics.repository.*;
import com.electronics.OnlineElectronics.service.interfaces.IWishlistService;
import org.springframework.stereotype.Service;

@Service
public class WishlistService implements IWishlistService {
    private final WishlistRepository wishlistRepository;
    private final WishlistItemRepository wishlistItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public WishlistService(WishlistRepository wishlistRepository, WishlistItemRepository wishlistItemRepository, UserRepository userRepository, ProductRepository productRepository) {
        this.wishlistRepository = wishlistRepository;
        this.wishlistItemRepository = wishlistItemRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository; }

    public Wishlist getWishlistForUser(Long userId) {
        return wishlistRepository.findByUserId(userId)
                .orElseGet(() -> createWishlistForUser(userId)); }

    public Wishlist addItemToWishlist(Long userId,Long productId){
        Wishlist wishlist = getWishlistForUser(userId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        WishlistItem item = new WishlistItem();
        item.setProduct(product);
        item.setWishlist(wishlist);
        wishlist.getItems().add(item);
        return wishlistRepository.save(wishlist);
    }

    public  Wishlist removeItemFromWishlist(Long userId,Long productId){

        Wishlist wishlist= getWishlistForUser(userId);
        WishlistItem itemToRemove = null;

        for (WishlistItem item : wishlist.getItems()) {
            if (item.getProduct().getId().equals(productId)) {
                itemToRemove = item;
                break;
            }

        }
        if (itemToRemove != null) {
            wishlist.getItems().remove(itemToRemove);
        }

        return wishlistRepository.save(wishlist);
    }


    public Wishlist createWishlistForUser(Long userId) {
        User user = userRepository.findById(userId)
                                  .orElseThrow(() -> new RuntimeException("User not found"));

        Wishlist wishlist = new Wishlist(user);
        return wishlistRepository.save(wishlist); }

}
