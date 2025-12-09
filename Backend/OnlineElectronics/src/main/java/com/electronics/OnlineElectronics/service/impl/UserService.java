package com.electronics.OnlineElectronics.service.impl;

import com.electronics.OnlineElectronics.model.User;
import com.electronics.OnlineElectronics.repository.UserRepository;
import com.electronics.OnlineElectronics.service.interfaces.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@Service
public class UserService implements IUserService {
    private final UserRepository userRepository;
    @Autowired
    @Lazy
    private PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, @Lazy PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Category not found with id: " + id));
    }


    public void createUser(String firstName,String lastName,String email, String rawPassword, String role) {
        User user = new User();
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(rawPassword)); // hash
        user.setRole(role);
        userRepository.save(user);
    }
    @Override
    public User updateUser(Long id, User user) {
        User existing = getUserById(id);
        existing.setFirstName(user.getFirstName());
        existing.setLastName(user.getLastName());
        existing.setEmail(user.getEmail());
        existing.setPassword(user.getPassword());
        existing.setRole(user.getRole());
        return userRepository.save(existing);
    }

    @Override
    public void deleteUser(Long id) {
        User existing = getUserById(id);
        userRepository.delete(existing);
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with email: " + email));
    }
    public boolean adminExists() {
        return userRepository.findByRole("ADMIN").isPresent();
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.findByEmail(email).isPresent();
    }
}
