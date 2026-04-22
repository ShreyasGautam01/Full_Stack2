package com.fullstacktest.notelink.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class NoteRequest {

    @NotBlank
    @Size(max = 255)
    private String title;

    private String content;

    @Size(max = 100)
    private String category;

    /** Hex colour, e.g. #7F77DD. Null = use graph auto-colour. */
    @Size(max = 7)
    private String nodeColor;
}