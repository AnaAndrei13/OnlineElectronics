package com.electronics.OnlineElectronics.service.impl;

import com.electronics.OnlineElectronics.model.User;
import com.electronics.OnlineElectronics.request.UserRequest;
import com.electronics.OnlineElectronics.service.interfaces.IAuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class AuthService implements IAuthService {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtService jwtService;


    public AuthService(AuthenticationManager authenticationManager,
                           UserService userService,
                           JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtService = jwtService;
    }


    @Override
    public String login(String email, String password) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );

        User user = userService.getUserByEmail(email);

        return jwtService.generateToken(user.getEmail());
    }

    @Override
    public void register(UserRequest userRequest) {
        if (userService.existsByEmail(userRequest.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        userService.createUser(
                userRequest.getFirstName(),
                userRequest.getLastName(),
                userRequest.getEmail(),
                userRequest.getPhoneNumber(),
                userRequest.getAddress(),
                userRequest.getPassword(),
                "USER"
        );
    }


}
