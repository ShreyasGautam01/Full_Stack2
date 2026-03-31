package com.AML2A.JWT.DEMO.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.AML2A.JWT.DEMO.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByUsername(String username);

}