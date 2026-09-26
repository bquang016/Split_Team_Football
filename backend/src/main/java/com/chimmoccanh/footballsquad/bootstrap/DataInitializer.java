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

import java.util.List;

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
                    .jerseyNumber(10)
                    .email("admin@chimmoccanh.com")
                    .passwordHash(passwordEncoder.encode("admin123"))
                    .role(UserRole.ADMIN)
                    .status(UserStatus.ACTIVE)
                    .build();
            userRepository.save(admin);
        }

        // Seed initial sample active players if only admin or empty
        if (userRepository.count() <= 1) {
            log.info("Seeding initial active players for demo & testing");
            String defaultPassword = passwordEncoder.encode("123456");

            List<User> samplePlayers = List.of(
                    createUser("quangbui", "Quang Bùi", 7, "quang@chimmoccanh.com", defaultPassword),
                    createUser("minhduc", "Minh Đức", 8, "minhduc@chimmoccanh.com", defaultPassword),
                    createUser("tuananh", "Tuấn Anh", 11, "tuananh@chimmoccanh.com", defaultPassword),
                    createUser("hailong", "Hải Long", 6, "hailong@chimmoccanh.com", defaultPassword),
                    createUser("vanlam", "Văn Lâm", 1, "vanlam@chimmoccanh.com", defaultPassword),
                    createUser("tiendat", "Tiến Đạt", 9, "tiendat@chimmoccanh.com", defaultPassword),
                    createUser("hoangnam", "Hoàng Nam", 14, "hoangnam@chimmoccanh.com", defaultPassword),
                    createUser("vietanh", "Việt Anh", 4, "vietanh@chimmoccanh.com", defaultPassword),
                    createUser("duchuy", "Đức Huy", 15, "duchuy@chimmoccanh.com", defaultPassword),
                    createUser("quanghai", "Quang Hải", 19, "quanghai@chimmoccanh.com", defaultPassword),
                    createUser("congphuong", "Công Phượng", 10, "congphuong@chimmoccanh.com", defaultPassword),
                    createUser("hungdung", "Hùng Dũng", 16, "hungdung@chimmoccanh.com", defaultPassword),
                    createUser("duymanh", "Duy Mạnh", 28, "duymanh@chimmoccanh.com", defaultPassword),
                    createUser("tanloc", "Tấn Lộc", 21, "tanloc@chimmoccanh.com", defaultPassword)
            );

            userRepository.saveAll(samplePlayers);
            log.info("Sample players successfully seeded (14 active players)");
        }
    }

    private User createUser(String username, String fullName, Integer jerseyNumber, String email, String passwordHash) {
        return User.builder()
                .username(username)
                .fullName(fullName)
                .jerseyNumber(jerseyNumber)
                .email(email)
                .passwordHash(passwordHash)
                .role(UserRole.PLAYER)
                .status(UserStatus.ACTIVE)
                .build();
    }
}
