package com.fullstacktest.notelink.service;

import com.fullstacktest.notelink.dto.RelationshipRequest;
import com.fullstacktest.notelink.dto.RelationshipResponse;
import com.fullstacktest.notelink.entity.Note;
import com.fullstacktest.notelink.entity.Relationship;
import com.fullstacktest.notelink.exception.ResourceNotFoundException;
import com.fullstacktest.notelink.repository.NoteRepository;
import com.fullstacktest.notelink.repository.RelationshipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class RelationshipService {

    private final RelationshipRepository relationshipRepository;
    private final NoteRepository         noteRepository;
    private final NoteService            noteService;

    @Transactional(readOnly = true)
    public List<RelationshipResponse> getAllForUser(Long userId) {
        return relationshipRepository.findAllByUserId(userId)
                                     .stream()
                                     .map(RelationshipResponse::new)
                                     .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RelationshipResponse> getForNote(Long noteId, Long userId) {
        noteService.findOwnedNote(noteId, userId);
        return relationshipRepository.findAllByNoteId(noteId)
                                     .stream()
                                     .map(RelationshipResponse::new)
                                     .collect(Collectors.toList());
    }

    public RelationshipResponse create(RelationshipRequest request, Long userId) {
        Note source = noteService.findOwnedNote(request.getSourceNoteId(), userId);

        Note target = noteRepository.findById(request.getTargetNoteId())
                                    .orElseThrow(() -> new ResourceNotFoundException(
                                            "Note", request.getTargetNoteId()));

        if (source.getId().equals(target.getId())) {
            throw new IllegalArgumentException("A note cannot be linked to itself");
        }

        if (relationshipRepository.existsBySourceNoteIdAndTargetNoteId(
                source.getId(), target.getId())) {
            throw new IllegalArgumentException("This relationship already exists");
        }

        Relationship rel = relationshipRepository.save(
                new Relationship(source, target, request.getType()));

        return new RelationshipResponse(rel);
    }

    public void delete(Long id, Long userId) {
        Relationship rel = relationshipRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Relationship", id));
        relationshipRepository.delete(rel);
    }
}