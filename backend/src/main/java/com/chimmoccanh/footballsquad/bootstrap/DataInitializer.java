package com.chimmoccanh.footballsquad.bootstrap;

import com.chimmoccanh.footballsquad.model.User;
import com.chimmoccanh.footballsquad.model.enums.UserRole;
import com.chimmoccanh.footballsquad.model.enums.UserStatus;
import com.chimmoccanh.footballsquad.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.countByRole(UserRole.ADMIN) == 0) {
            log.info("Creating default administrator account: admin / admin123");
            User admin = User.builder()
                    .username("admin")
                    .fullName("Quản Trị Viên")
                    .jerseyNumber(null)
                    .email("admin@chimmoccanh.com")
                    .passwordHash(passwordEncoder.encode("admin123"))
                    .role(UserRole.ADMIN)
                    .status(UserStatus.ACTIVE)
                    .build();
            userRepository.save(admin);
        }
    }
}
