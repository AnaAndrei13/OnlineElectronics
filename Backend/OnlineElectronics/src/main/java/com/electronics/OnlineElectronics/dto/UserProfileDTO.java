package com.electronics.OnlineElectronics.dto;

import com.electronics.OnlineElectronics.model.User;

public class UserProfileDTO {
    private String fullName;
    private String email;
    private String phone;
    private String address;

    public UserProfileDTO(){}

    public UserProfileDTO(User user) {
        this.fullName = user.getFirstName() + " " + user.getLastName();
        this.email = user.getEmail();
        this.phone = user.getPhoneNumber();
        this.address = user.getAddress();
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getAddress() {
        return address;
    }
}

