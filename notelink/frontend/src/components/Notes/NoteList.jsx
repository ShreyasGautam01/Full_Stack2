import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotes } from '../../hooks/useNotes';
import NoteCard from './NoteCard';

export default function NoteList() {
  const { notes, loading, error, fetchNotes } = useNotes();
  const [search, setSearch] = useState('');

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  const filtered = search.trim()
    ? notes.filter(n =>
        n.title.toLowerCase().includes(search.trim().toLowerCase()) ||
        (n.content ?? '').toLowerCase().includes(search.trim().toLowerCase())
      )
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
            type="text"
            placeholder="🔍 Search notes…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setSearch('')}>
              Clear
            </button>
          )}
        </div>
      )}

      {filtered.length === 0 && notes.length > 0 && (
        <div className="page-state">No notes match "{search}"</div>
      )}

      {notes.length === 0 ? (
        <div className="empty-state">
          <p>No notes yet.</p>
          <Link to="/notes/new" className="btn btn-primary">Create your first note</Link>
        </div>
      ) : (
        <div className="note-grid">
          {filtered.map(note => <NoteCard key={note.id} note={note} />)}
        </div>
      )}
    </div>
  );
}