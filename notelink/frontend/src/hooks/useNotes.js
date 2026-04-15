import { useContext } from 'react';
import { NoteContext } from '../context/NoteContext';

export function useNotes() {
  const ctx = useContext(NoteContext);
  if (!ctx) throw new Error('useNotes must be used inside <NoteProvider>');
  return ctx;
}
