package com.electronics.OnlineElectronics.controller;

import com.electronics.OnlineElectronics.request.AuthResponse;
import com.electronics.OnlineElectronics.request.LoginRequest;
import com.electronics.OnlineElectronics.request.UserRequest;
import com.electronics.OnlineElectronics.service.impl.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {


    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }


    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        try {
            String jwt = authService.login(loginRequest.getEmail(), loginRequest.getPassword());
            return ResponseEntity.ok(new AuthResponse(jwt));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody UserRequest userRequest) {
        try {
            authService.register(userRequest);
            return ResponseEntity.ok("User created successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }


}