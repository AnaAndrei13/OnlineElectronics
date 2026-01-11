package com.electronics.OnlineElectronics.controller;
import com.electronics.OnlineElectronics.model.User;
import com.electronics.OnlineElectronics.model.Wishlist;
import com.electronics.OnlineElectronics.service.interfaces.IUserService;
import com.electronics.OnlineElectronics.service.interfaces.IWishlistService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {
    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);
    private final IWishlistService wishlistService;
    public final IUserService userService;
     public WishlistController(IWishlistService wishlistService,IUserService userService){
         this.wishlistService=wishlistService;
         this.userService=userService;
     }



    //1. Return wishlist
    @GetMapping("/")
    public ResponseEntity<?> getWishlist(){
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated()
                    || "anonymousUser".equals(authentication.getName())) {
                logger.error("User not authenticated");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("User not authenticated");
            }

            String email = authentication.getName();
            logger.info("Fetching wishlist for user: {}", email);

            User user = userService.getUserByEmail(email);

            if (user == null) {
                logger.error("User not found: {}", email);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("User not found");
            }

            Wishlist wishlist = wishlistService.getWishlistForUser(user.getId());

            if (wishlist == null) {
                logger.info("Wishlist not found for user: {}", email);
                return ResponseEntity.notFound().build();
            }

            logger.info("Wishlist retrieved successfully for user: {}", email);
            return ResponseEntity.ok(wishlist);

        } catch (Exception e) {
            logger.error("Error fetching wishlist: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    //2. Add a product in wishlist
    @PostMapping("/add/{productId}")
    public ResponseEntity<?> addInFavorite(@PathVariable Long productId){
         try{
             Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

             if (authentication == null || !authentication.isAuthenticated()
                     || "anonymousUser".equals(authentication.getName())) {
                 logger.error("User not authenticated");
                 return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                         .body("User not authenticated");
             }

             String email = authentication.getName();
             logger.info("Creating order for user: {}", email);
             User user= userService.getUserByEmail(email);

             if (user == null) {
                 logger.error("User not found: {}", email);
                 return ResponseEntity.status(HttpStatus.NOT_FOUND)
                         .body("User not found");
             }
             Wishlist wishlist = wishlistService.addItemToWishlist(user.getId(),productId);
             return ResponseEntity.ok(wishlist);

         } catch (Exception e) {
             logger.error("Error creating order: {}", e.getMessage(), e);
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                     .body("Error: " + e.getMessage());
         }
    }

    //3. Delete a product from wishlist
  @DeleteMapping("/remove/{productId}")
    public ResponseEntity<?> removeFromFavorite( @PathVariable Long productId){
         try{
             Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

             if (authentication == null || !authentication.isAuthenticated()
                     || "anonymousUser".equals(authentication.getName())) {
                 logger.error("User not authenticated");
                 return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                         .body("User not authenticated");
             }

             String email = authentication.getName();
             logger.info("Creating order for user: {}", email);
             User user= userService.getUserByEmail(email);

             if (user == null) {
                 logger.error("User not found: {}", email);
                 return ResponseEntity.status(HttpStatus.NOT_FOUND)
                         .body("User not found");
             }

             Wishlist wishlist= wishlistService.removeItemFromWishlist(user.getId(),productId);
             return ResponseEntity.ok(wishlist);

         }catch(Exception e){
             logger.error("Error creating order: {}", e.getMessage(), e);
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                     .body("Error: " + e.getMessage());
         }
    }

}
