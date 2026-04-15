package com.fullstacktest.notelink.repository;

import com.fullstacktest.notelink.entity.ERole;
import com.fullstacktest.notelink.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findByName(ERole name);
}
