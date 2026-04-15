package com.fullstacktest.notelink.repository;

import com.fullstacktest.notelink.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {

    List<Note> findByUserIdOrderByUpdatedAtDesc(Long userId);

    // Eagerly fetch images in one query to avoid N+1
    @Query("SELECT n FROM Note n LEFT JOIN FETCH n.images WHERE n.id = :id AND n.user.id = :userId")
    Optional<Note> findByIdAndUserId(@Param("id") Long id, @Param("userId") Long userId);

    // All notes belonging to a user, with images pre-loaded
    @Query("SELECT DISTINCT n FROM Note n LEFT JOIN FETCH n.images WHERE n.user.id = :userId ORDER BY n.updatedAt DESC")
    List<Note> findByUserIdWithImages(@Param("userId") Long userId);

    boolean existsByIdAndUserId(Long id, Long userId);
}
