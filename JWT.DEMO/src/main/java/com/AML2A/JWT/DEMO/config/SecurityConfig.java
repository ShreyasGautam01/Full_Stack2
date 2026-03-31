package com.AML2A.JWT.DEMO.config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@SuppressWarnings("deprecation")
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
        .csrf(csrf -> csrf.disable())
        .cors(cors -> cors.disable())
        .formLogin(form -> form.disable())   
        .httpBasic(basic -> basic.disable()) 
        .authorizeHttpRequests(auth -> auth
        		.requestMatchers("/api/**").permitAll()
                .anyRequest().authenticated()
        );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}