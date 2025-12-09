package com.electronics.OnlineElectronics.config;

import com.electronics.OnlineElectronics.model.User;
import com.electronics.OnlineElectronics.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminCreator implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminCreator(UserRepository userRepository,
                        PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {

        if (userRepository.findByRole("ADMIN").isEmpty()) {

            User admin = new User();
            admin.setFirstName("Matei");
            admin.setLastName("Marinescu");
            admin.setEmail("admin@shop.com");


            String plainPassword = "parolaAdmin123";


            admin.setPassword(passwordEncoder.encode(plainPassword));
            admin.setRole("ADMIN");
            userRepository.save(admin);

        }
    }
}

