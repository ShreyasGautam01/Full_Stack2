package com.fullstacktest.notelink.service;

import com.fullstacktest.notelink.dto.NoteRequest;
import com.fullstacktest.notelink.dto.NoteResponse;
import com.fullstacktest.notelink.entity.Note;
import com.fullstacktest.notelink.entity.User;
import com.fullstacktest.notelink.exception.ResourceNotFoundException;
import com.fullstacktest.notelink.repository.NoteRepository;
import com.fullstacktest.notelink.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class NoteService {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<NoteResponse> getAllNotes(Long userId) {
        return noteRepository.findByUserIdWithImages(userId)
                             .stream()
                             .map(NoteResponse::new)
                             .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public NoteResponse getNoteById(Long id, Long userId) {
        return new NoteResponse(findOwnedNote(id, userId));
    }

    public NoteResponse createNote(NoteRequest request, Long userId) {
        User user = userRepository.findById(userId)
                                  .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        Note note = new Note(request.getTitle(), request.getContent(), user);
        note.setCategory(request.getCategory());
        note.setNodeColor(request.getNodeColor());
        return new NoteResponse(noteRepository.save(note));
    }

    public NoteResponse updateNote(Long id, NoteRequest request, Long userId) {
        Note note = findOwnedNote(id, userId);
        note.setTitle(request.getTitle());
        note.setContent(request.getContent());
        note.setCategory(request.getCategory());
        note.setNodeColor(request.getNodeColor());
        return new NoteResponse(noteRepository.save(note));
    }

    public void deleteNote(Long id, Long userId) {
        Note note = findOwnedNote(id, userId);
        noteRepository.delete(note);
    }

    Note findOwnedNote(Long id, Long userId) {
        return noteRepository.findByIdAndUserId(id, userId)
                             .orElseThrow(() -> new ResourceNotFoundException("Note", id));
    }
}