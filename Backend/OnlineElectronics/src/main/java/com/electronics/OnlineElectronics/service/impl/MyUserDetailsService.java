package com.electronics.OnlineElectronics.service.impl;
import com.electronics.OnlineElectronics.model.User;
import com.electronics.OnlineElectronics.service.UserInfoDetails;
import com.electronics.OnlineElectronics.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;


@Service
public class MyUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    public MyUserDetailsService(UserRepository userRepository) {
        this.userRepository=userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
            User user= userRepository.findByEmail(email)
                     .orElseThrow(() -> new UsernameNotFoundException("Email not found: " + email));
        return new UserInfoDetails(
                user.getId(),
                user.getEmail(), // ← username = email
                user.getPassword(),
                getAuthorities(user)
        );
    }

    private Collection<? extends GrantedAuthority> getAuthorities(User user) {
        return Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_" + user.getRole())
        );
    }
}


