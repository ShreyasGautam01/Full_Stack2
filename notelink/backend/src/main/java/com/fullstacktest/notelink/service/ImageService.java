package com.fullstacktest.notelink.service;

import com.fullstacktest.notelink.dto.ImageResponse;
import com.fullstacktest.notelink.entity.Note;
import com.fullstacktest.notelink.entity.NoteImage;
import com.fullstacktest.notelink.exception.ResourceNotFoundException;
import com.fullstacktest.notelink.repository.NoteImageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ImageService {

    private final NoteImageRepository imageRepository;
    private final NoteService         noteService;

    @Value("${notelink.app.uploadDir}")
    private String uploadDir;

    private static final List<String> ALLOWED_TYPES =
            List.of("image/jpeg", "image/png", "image/gif", "image/webp");

    @Transactional(readOnly = true)
    public List<ImageResponse> getImagesForNote(Long noteId, Long userId) {
        noteService.findOwnedNote(noteId, userId);   // ownership check
        return imageRepository.findByNoteId(noteId)
                              .stream()
                              .map(ImageResponse::new)
                              .collect(Collectors.toList());
    }

    public ImageResponse uploadImage(Long noteId, MultipartFile file, Long userId) throws IOException {
        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw new IllegalArgumentException(
                    "Unsupported file type. Allowed: JPEG, PNG, GIF, WEBP");
        }

        Note note = noteService.findOwnedNote(noteId, userId);

        String ext      = getExtension(file.getOriginalFilename());
        String fileName = UUID.randomUUID() + ext;
        Path   target   = Paths.get(uploadDir).resolve(fileName);

        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        NoteImage image = imageRepository.save(
                new NoteImage(fileName, target.toString(), note));

        log.info("Uploaded image {} for note {}", fileName, noteId);
        return new ImageResponse(image);
    }

    public void deleteImage(Long imageId, Long noteId, Long userId) {
        noteService.findOwnedNote(noteId, userId);   // ownership check

        NoteImage image = imageRepository.findByIdAndNoteId(imageId, noteId)
                                         .orElseThrow(() -> new ResourceNotFoundException(
                                                 "Image", imageId));

        try {
            Files.deleteIfExists(Paths.get(image.getFilePath()));
        } catch (IOException e) {
            log.warn("Could not delete file {}: {}", image.getFilePath(), e.getMessage());
        }

        imageRepository.delete(image);
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "";
        return filename.substring(filename.lastIndexOf('.'));
    }
}
