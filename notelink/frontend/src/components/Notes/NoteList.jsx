import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotes } from '../../hooks/useNotes';
import { useKeyboard } from '../../hooks/useKeyboard';
import { noteMatchesSearch } from '../../utils/categoryHelper';
import NoteCard from './NoteCard';

export default function NoteList() {
  const { notes, loading, error, fetchNotes } = useNotes();
  const [search, setSearch] = useState('');

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  // Ctrl+K focuses the search field (common convention)
  const searchRef = { current: null };
  useKeyboard([
    { key: 'k', ctrl: true, handler: () => searchRef.current?.focus() },
  ]);

  // Matches title, content, AND any individual category tag
  const filtered = search.trim()
    ? notes.filter(n => noteMatchesSearch(n, search.trim()))
    : notes;

  if (loading) return <div className="page-state">Loading notes…</div>;
  if (error)   return <div className="page-state error">{error}</div>;

  return (
    <div className="note-list-page">
      <header className="page-header">
        <h1>My notes</h1>
        <Link to="/notes/new" className="btn btn-primary">+ New note</Link>
      </header>

      {notes.length > 0 && (
        <div className="note-search">
          <input
            ref={el => { searchRef.current = el; }}
            type="text"
            placeholder="🔍 Search by title, content or category… (Ctrl+K)"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Escape' && setSearch('')}
          />
          {search && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setSearch('')}>
              Clear
            </button>
          )}
        </div>
      )}

      {notes.length > 0 && filtered.length === 0 && (
        <div className="page-state">No notes match "{search}"</div>
      )}

      {notes.length === 0 ? (
        <div className="empty-state">
          <p>No notes yet.</p>
          <Link to="/notes/new" className="btn btn-primary">Create your first note</Link>
        </div>
      ) : (
        <>
          {search && (
            <p className="hint" style={{ marginBottom: '.75rem' }}>
              {filtered.length} of {notes.length} notes
            </p>
          )}
          <div className="note-grid">
            {filtered.map(note => <NoteCard key={note.id} note={note} />)}
          </div>
        </>
      )}
    </div>
  );
}