package com.fullstacktest.notelink.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class RelationshipRequest {

    @NotNull
    private Long sourceNoteId;

    @NotNull
    private Long targetNoteId;

    /**
     * Relationship type — must be one of:
     * RELATED_TO, DEPENDS_ON, CONTRADICTS, IS_EXAMPLE_OF, EXTENDS, REFERENCES
     */
    @NotBlank
    private String type = "RELATED_TO";
}