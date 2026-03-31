package com.AML2A.JWT.DEMO.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.AML2A.JWT.DEMO.repository.UserRepository;
import com.AML2A.JWT.DEMO.security.JwtUtil;

@Service
public class AuthService {
	@Autowired
    UserRepository repo;

    @Autowired
    JwtUtil jwtUtil;

    public String login(String username, String password) {

        var user = repo.findByUsername(username);

        if(user != null && user.getPassword().equals(password)) {
            return jwtUtil.generateToken(username);
        }

        return "Invalid Credentials";
    }
}