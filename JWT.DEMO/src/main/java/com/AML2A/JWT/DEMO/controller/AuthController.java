package com.AML2A.JWT.DEMO.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.AML2A.JWT.DEMO.service.AuthService;

@RestController
@RequestMapping("/api")
public class AuthController {
	@Autowired
    AuthService service;

    @PostMapping("/login")
    public String login(@RequestParam String username,
                        @RequestParam String password) {
    	System.out.println("Login API Hit");
        return service.login(username, password);
    }

    @GetMapping("/hello")
    public String hello() {
        return "Hello! JWT Authentication Successful";
    }
}