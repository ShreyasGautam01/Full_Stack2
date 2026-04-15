package com.fullstacktest.notelink.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "note_images")
@Getter @Setter @NoArgsConstructor
public class NoteImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false, length = 512)
    private String filePath;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "note_id", nullable = false)
    private Note note;

    public NoteImage(String fileName, String filePath, Note note) {
        this.fileName = fileName;
        this.filePath = filePath;
        this.note     = note;
    }
}
