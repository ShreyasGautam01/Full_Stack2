package com.fullstacktest.notelink.controller;

import com.fullstacktest.notelink.dto.RelationshipRequest;
import com.fullstacktest.notelink.dto.RelationshipResponse;
import com.fullstacktest.notelink.security.services.UserDetailsImpl;
import com.fullstacktest.notelink.service.RelationshipService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/relationships")
@RequiredArgsConstructor
public class RelationshipController {

    private final RelationshipService relationshipService;

    @GetMapping
    public ResponseEntity<List<RelationshipResponse>> getAll(
            @AuthenticationPrincipal UserDetailsImpl user) {
        return ResponseEntity.ok(relationshipService.getAllForUser(user.getId()));
    }

    @GetMapping("/note/{noteId}")
    public ResponseEntity<List<RelationshipResponse>> getForNote(
            @PathVariable Long noteId,
            @AuthenticationPrincipal UserDetailsImpl user) {
        return ResponseEntity.ok(relationshipService.getForNote(noteId, user.getId()));
    }

    @PostMapping
    public ResponseEntity<RelationshipResponse> create(
            @Valid @RequestBody RelationshipRequest request,
            @AuthenticationPrincipal UserDetailsImpl user) {
        return ResponseEntity.status(HttpStatus.CREATED)
                             .body(relationshipService.create(request, user.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl user) {
        relationshipService.delete(id, user.getId());
        return ResponseEntity.noContent().build();
    }
}
