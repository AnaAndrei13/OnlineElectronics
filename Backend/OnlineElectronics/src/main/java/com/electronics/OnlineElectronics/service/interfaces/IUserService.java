package com.electronics.OnlineElectronics.service.interfaces;

import com.electronics.OnlineElectronics.model.User;

import java.util.List;

public interface IUserService {
    List<User> getAllUsers();

    User getUserById(Long id);

    void createUser(String firstName,String lastName,String email,String phoneNumber, String address, String rawPassword, String role);

    User updateUser(Long id, User user);

    void deleteUser(Long id);

    User getUserByEmail(String email);
    boolean adminExists();
    boolean existsByEmail(String email);
}
