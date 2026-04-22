package com.fullstacktest.notelink.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "notes")
@Getter @Setter @NoArgsConstructor
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    /**
     * User-defined category string (e.g. "Backend", "Security", "Concept").
     * Drives the category-filter bar in the graph view.
     */
    @Column(length = 100)
    private String category;

    /**
     * Custom hex colour for this note's node in the graph view (#RRGGBB).
     * When null the frontend falls back to an auto-colour keyed on category.
     */
    @Column(length = 7)
    private String nodeColor;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "note", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<NoteImage> images = new ArrayList<>();

    public Note(String title, String content, User user) {
        this.title   = title;
        this.content = content;
        this.user    = user;
    }
}