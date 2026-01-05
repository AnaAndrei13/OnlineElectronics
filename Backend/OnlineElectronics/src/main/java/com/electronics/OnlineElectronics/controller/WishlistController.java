package com.electronics.OnlineElectronics.controller;
import com.electronics.OnlineElectronics.model.Wishlist;
import com.electronics.OnlineElectronics.service.interfaces.IWishlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final IWishlistService wishlistService;
     public WishlistController(IWishlistService wishlistService){
         this.wishlistService=wishlistService;
     }



    //1. Return wishlist for an user
    @GetMapping("/{userId}")
    public ResponseEntity<Wishlist> getWishlist(@PathVariable Long userId){
           Wishlist wishlist= wishlistService.getWishlistForUser(userId);

        if (wishlist == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(wishlist);
    }

    //2. Add a product in wishlist
    @PostMapping("/add")
    public ResponseEntity<Wishlist> addInFavorite(@RequestParam Long userId, @RequestParam Long productId){
    Wishlist wishlist = wishlistService.addItemToWishlist(userId,productId);

    return ResponseEntity.ok(wishlist);
    }

    //3. Delete a product from wishlist
  @DeleteMapping("/remove")
    public ResponseEntity<Wishlist> removeFromFavorite(@RequestParam Long userId, @RequestParam Long productId){
           Wishlist wishlist= wishlistService.removeItemFromWishlist(userId,productId);
           return ResponseEntity.ok(wishlist);
    }

}
