package com.fullstacktest.notelink.controller;

import com.fullstacktest.notelink.dto.ImageResponse;
import com.fullstacktest.notelink.security.services.UserDetailsImpl;
import com.fullstacktest.notelink.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/notes/{noteId}/images")
@RequiredArgsConstructor
public class ImageController {

    private final ImageService imageService;

    @GetMapping
    public ResponseEntity<List<ImageResponse>> getAll(
            @PathVariable Long noteId,
            @AuthenticationPrincipal UserDetailsImpl user) {
        return ResponseEntity.ok(imageService.getImagesForNote(noteId, user.getId()));
    }

    @PostMapping
    public ResponseEntity<ImageResponse> upload(
            @PathVariable Long noteId,
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetailsImpl user) throws IOException {
        return ResponseEntity.status(HttpStatus.CREATED)
                             .body(imageService.uploadImage(noteId, file, user.getId()));
    }

    @DeleteMapping("/{imageId}")
    public ResponseEntity<Void> delete(
            @PathVariable Long noteId,
            @PathVariable Long imageId,
            @AuthenticationPrincipal UserDetailsImpl user) {
        imageService.deleteImage(imageId, noteId, user.getId());
        return ResponseEntity.noContent().build();
    }
}
