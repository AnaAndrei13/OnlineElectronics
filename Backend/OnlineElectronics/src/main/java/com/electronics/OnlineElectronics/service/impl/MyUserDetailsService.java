package com.electronics.OnlineElectronics.service.impl;
import com.electronics.OnlineElectronics.service.UserInfoDetails;
import com.electronics.OnlineElectronics.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


@Service
public class MyUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    public MyUserDetailsService(UserRepository userRepository) {
        this.userRepository=userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
             return userRepository.findByEmail(email)
                     .map(UserInfoDetails::new)
                     .orElseThrow(() -> new UsernameNotFoundException("Email not found: " + email));

    }
}

