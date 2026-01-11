package com.electronics.OnlineElectronics.controller;


import com.electronics.OnlineElectronics.dto.UserProfileDTO;
import com.electronics.OnlineElectronics.model.Cart;
import com.electronics.OnlineElectronics.model.User;
import com.electronics.OnlineElectronics.service.UserInfoDetails;
import com.electronics.OnlineElectronics.service.interfaces.IUserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);
    private final IUserService userService;

    public UserController(IUserService userService){
        this.userService = userService;
    }

    @GetMapping
    public List<User> getAll() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public User getById(@PathVariable Long id) {
        return userService.getUserById(id);
    }



    @PutMapping("/{id}")
    public User update(@PathVariable Long id, @RequestBody User user) {
        return userService.updateUser(id, user);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        userService.deleteUser(id);
    }

    @GetMapping("/email/{email}")
    public User getByEmail(@PathVariable String email) {
        return userService.getUserByEmail(email);
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfileDTO> getUserProfile() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            if (!(authentication.getPrincipal() instanceof UserInfoDetails)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            UserInfoDetails userDetails = (UserInfoDetails) authentication.getPrincipal();
            Long userId = userDetails.getId();

            User user = userService.getUserById(userId);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            UserProfileDTO dto = new UserProfileDTO(user);

            // Test debug
            System.out.println(" DTO created: " + dto.getEmail());

            return ResponseEntity.ok(dto); // ← Returnează direct DTO-ul

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
