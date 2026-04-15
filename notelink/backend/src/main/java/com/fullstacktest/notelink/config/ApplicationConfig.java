package com.fullstacktest.notelink.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
@Slf4j
public class ApplicationConfig implements WebMvcConfigurer {

    @Value("${notelink.app.uploadDir}")
    private String uploadDir;

    /**
     * Ensures the upload directory exists on the filesystem at startup.
     * With uploadDir=uploads this creates backend/uploads/ relative to
     * where mvn spring-boot:run is executed.
     */
    @PostConstruct
    public void init() {
        try {
            Path path = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(path);
            log.info("Upload directory ready at: {}", path);
        } catch (IOException e) {
            log.error("Could not create upload directory: {}", e.getMessage());
        }
    }

    /**
     * Registers a resource handler that serves files from the external
     * upload directory at /uploads/**. This replaces the broken
     * classpath:/static/uploads/ approach, which only works for files
     * bundled at compile time, not files written at runtime.
     *
     * The Vite proxy already forwards /uploads/** → localhost:8080, so
     * images load transparently in the dev frontend at the same URL they
     * are stored under.
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        String location = "file:" + uploadPath + "/";
        log.info("Serving uploads at /uploads/** from {}", location);
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(location);
    }
}