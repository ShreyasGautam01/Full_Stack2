package com.fullstacktest.notelink.controller;

import com.fullstacktest.notelink.dto.NoteRequest;
import com.fullstacktest.notelink.dto.NoteResponse;
import com.fullstacktest.notelink.security.services.UserDetailsImpl;
import com.fullstacktest.notelink.service.NoteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NoteController {

    private final NoteService noteService;

    @GetMapping
    public ResponseEntity<List<NoteResponse>> getAll(
            @AuthenticationPrincipal UserDetailsImpl user) {
        return ResponseEntity.ok(noteService.getAllNotes(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<NoteResponse> getOne(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl user) {
        return ResponseEntity.ok(noteService.getNoteById(id, user.getId()));
    }

    @PostMapping
    public ResponseEntity<NoteResponse> create(
            @Valid @RequestBody NoteRequest request,
            @AuthenticationPrincipal UserDetailsImpl user) {
        return ResponseEntity.status(HttpStatus.CREATED)
                             .body(noteService.createNote(request, user.getId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NoteResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody NoteRequest request,
            @AuthenticationPrincipal UserDetailsImpl user) {
        return ResponseEntity.ok(noteService.updateNote(id, request, user.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl user) {
        noteService.deleteNote(id, user.getId());
        return ResponseEntity.noContent().build();
    }
}
