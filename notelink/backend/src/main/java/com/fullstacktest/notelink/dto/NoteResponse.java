package com.fullstacktest.notelink.dto;

import com.fullstacktest.notelink.entity.Note;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
public class NoteResponse {

    private final Long            id;
    private final String          title;
    private final String          content;
    private final LocalDateTime   createdAt;
    private final LocalDateTime   updatedAt;
    private final Long            userId;
    private final List<ImageResponse> images;

    public NoteResponse(Note note) {
        this.id        = note.getId();
        this.title     = note.getTitle();
        this.content   = note.getContent();
        this.createdAt = note.getCreatedAt();
        this.updatedAt = note.getUpdatedAt();
        this.userId    = note.getUser().getId();
        this.images    = note.getImages().stream()
                             .map(ImageResponse::new)
                             .collect(Collectors.toList());
    }
}
