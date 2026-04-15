package com.fullstacktest.notelink.repository;

import com.fullstacktest.notelink.entity.NoteImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NoteImageRepository extends JpaRepository<NoteImage, Long> {

    List<NoteImage> findByNoteId(Long noteId);

    Optional<NoteImage> findByIdAndNoteId(Long id, Long noteId);
}
