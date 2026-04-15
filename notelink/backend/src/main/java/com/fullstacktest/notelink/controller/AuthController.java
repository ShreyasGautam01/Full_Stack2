package com.fullstacktest.notelink.controller;

import com.fullstacktest.notelink.dto.*;
import com.fullstacktest.notelink.entity.ERole;
import com.fullstacktest.notelink.entity.Role;
import com.fullstacktest.notelink.entity.User;
import com.fullstacktest.notelink.repository.RoleRepository;
import com.fullstacktest.notelink.repository.UserRepository;
import com.fullstacktest.notelink.security.jwt.JwtUtils;
import com.fullstacktest.notelink.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository        userRepository;
    private final RoleRepository        roleRepository;
    private final PasswordEncoder       encoder;
    private final JwtUtils              jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<JwtResponse> authenticateUser(@Valid @RequestBody LoginRequest req) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(auth);
        String jwt = jwtUtils.generateJwtToken(auth);

        UserDetailsImpl principal = (UserDetailsImpl) auth.getPrincipal();
        List<String> roles = principal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(
                jwt, principal.getId(), principal.getUsername(), principal.getEmail(), roles));
    }

    @PostMapping("/signup")
    public ResponseEntity<MessageResponse> registerUser(@Valid @RequestBody SignupRequest req) {
        if (userRepository.existsByUsername(req.getUsername())) {
            return ResponseEntity.badRequest()
                                 .body(new MessageResponse("Username is already taken"));
        }
        if (userRepository.existsByEmail(req.getEmail())) {
            return ResponseEntity.badRequest()
                                 .body(new MessageResponse("Email is already in use"));
        }

        User user = new User(req.getUsername(), req.getEmail(), encoder.encode(req.getPassword()));

        Set<String> strRoles = req.getRole();
        Set<Role>   roles    = new HashSet<>();

        if (strRoles == null || strRoles.isEmpty()) {
            roles.add(findRole(ERole.ROLE_USER));
        } else {
            for (String role : strRoles) {
                switch (role.toLowerCase()) {
                    case "admin" -> roles.add(findRole(ERole.ROLE_ADMIN));
                    case "mod"   -> roles.add(findRole(ERole.ROLE_MODERATOR));
                    default      -> roles.add(findRole(ERole.ROLE_USER));
                }
            }
        }

        user.setRoles(roles);
        userRepository.save(user);
        return ResponseEntity.ok(new MessageResponse("User registered successfully"));
    }

    private Role findRole(ERole name) {
        return roleRepository.findByName(name)
                             .orElseThrow(() -> new RuntimeException("Role not found: " + name));
    }
}
