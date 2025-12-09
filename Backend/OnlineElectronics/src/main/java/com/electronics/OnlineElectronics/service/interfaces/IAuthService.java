package com.electronics.OnlineElectronics.service.interfaces;


import com.electronics.OnlineElectronics.request.UserRequest;

public interface IAuthService {
    String login(String email, String password);
    void register(UserRequest request);
}
