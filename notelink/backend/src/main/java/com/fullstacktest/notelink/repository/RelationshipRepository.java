package com.fullstacktest.notelink.repository;

import com.fullstacktest.notelink.entity.Relationship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RelationshipRepository extends JpaRepository<Relationship, Long> {

    // All relationships where either note belongs to the given user
    @Query("""
            SELECT r FROM Relationship r
            JOIN FETCH r.sourceNote src
            JOIN FETCH r.targetNote tgt
            WHERE src.user.id = :userId OR tgt.user.id = :userId
            """)
    List<Relationship> findAllByUserId(@Param("userId") Long userId);

    // Relationships for a specific note (both directions)
    @Query("""
            SELECT r FROM Relationship r
            JOIN FETCH r.sourceNote src
            JOIN FETCH r.targetNote tgt
            WHERE src.id = :noteId OR tgt.id = :noteId
            """)
    List<Relationship> findAllByNoteId(@Param("noteId") Long noteId);

    // Verify the caller owns at least one of the two notes before allowing delete
    @Query("""
            SELECT r FROM Relationship r
            JOIN r.sourceNote src
            JOIN r.targetNote tgt
            WHERE r.id = :id AND (src.user.id = :userId OR tgt.user.id = :userId)
            """)
    Optional<Relationship> findByIdAndUserId(@Param("id") Long id, @Param("userId") Long userId);

    boolean existsBySourceNoteIdAndTargetNoteId(Long sourceNoteId, Long targetNoteId);
}
