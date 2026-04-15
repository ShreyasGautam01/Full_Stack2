import { createContext, useState, useCallback } from 'react';
import NoteService         from '../api/NoteService';
import RelationshipService from '../api/RelationshipService';

export const NoteContext = createContext(null);

export function NoteProvider({ children }) {
  const [notes,         setNotes]         = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState(null);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [notesData, relsData] = await Promise.all([
        NoteService.getAll(),
        RelationshipService.getAll(),
      ]);
      setNotes(notesData);
      setRelationships(relsData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, []);

  const createNote = useCallback(async (data) => {
    const note = await NoteService.create(data);
    setNotes(prev => [note, ...prev]);
    return note;
  }, []);

  const updateNote = useCallback(async (id, data) => {
    const updated = await NoteService.update(id, data);
    setNotes(prev => prev.map(n => n.id === id ? updated : n));
    return updated;
  }, []);

  const deleteNote = useCallback(async (id) => {
    await NoteService.delete(id);
    setNotes(prev => prev.filter(n => n.id !== id));
    setRelationships(prev =>
      prev.filter(r => r.sourceNoteId !== id && r.targetNoteId !== id));
  }, []);

  const createRelationship = useCallback(async (data) => {
    const rel = await RelationshipService.create(data);
    setRelationships(prev => [...prev, rel]);
    return rel;
  }, []);

  const deleteRelationship = useCallback(async (id) => {
    await RelationshipService.delete(id);
    setRelationships(prev => prev.filter(r => r.id !== id));
  }, []);

  /**
   * Called by NoteEditor whenever ImageUploader reports a change
   * (upload or delete). Patches the images array on the matching
   * note in-place so the homepage card shows the correct count
   * immediately without a full re-fetch.
   */
  const syncNoteImages = useCallback((noteId, images) => {
    setNotes(prev =>
      prev.map(n => n.id === noteId ? { ...n, images } : n)
    );
  }, []);

  return (
    <NoteContext.Provider value={{
      notes, relationships, loading, error,
      fetchNotes, createNote, updateNote, deleteNote,
      createRelationship, deleteRelationship,
      syncNoteImages,
    }}>
      {children}
    </NoteContext.Provider>
  );
}