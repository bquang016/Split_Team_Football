package com.chimmoccanh.footballsquad;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class FootballSquadApplication {

    public static void main(String[] args) {
        SpringApplication.run(FootballSquadApplication.class, args);
    }
}
