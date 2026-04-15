package com.fullstacktest.notelink.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "relationships")
@Getter @Setter @NoArgsConstructor
public class Relationship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_note_id", nullable = false)
    private Note sourceNote;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_note_id", nullable = false)
    private Note targetNote;

    /**
     * Semantic type of the relationship. Must be one of the values defined
     * in the frontend REL_TYPES map:
     *   RELATED_TO | DEPENDS_ON | CONTRADICTS | IS_EXAMPLE_OF | EXTENDS | REFERENCES
     * Defaults to RELATED_TO if not specified.
     */
    @Column(nullable = false, length = 50)
    private String type = "RELATED_TO";

    public Relationship(Note sourceNote, Note targetNote, String type) {
        this.sourceNote = sourceNote;
        this.targetNote = targetNote;
        this.type = (type != null && !type.isBlank()) ? type : "RELATED_TO";
    }
}