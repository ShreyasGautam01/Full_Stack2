import { Link } from 'react-router-dom';
import { useNotes } from '../../hooks/useNotes';

export default function NoteCard({ note }) {
  const { deleteNote } = useNotes();

  const preview = note.content
    ? note.content.replace(/<[^>]+>/g, '').slice(0, 120)
    : '';

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!window.confirm(`Delete "${note.title}"?`)) return;
    await deleteNote(note.id);
  };

  return (
    <article className="note-card">
      <Link to={`/notes/${note.id}`} className="note-card-link">
        <h2 className="note-card-title">{note.title}</h2>
        {preview && <p className="note-card-preview">{preview}{note.content?.length > 120 ? '…' : ''}</p>}
        <div className="note-card-meta">
          <span>{note.images?.length > 0 && `${note.images.length} image${note.images.length > 1 ? 's' : ''}`}</span>
          <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
        </div>
      </Link>
      <div className="note-card-actions">
        <Link to={`/notes/${note.id}/edit`} className="btn btn-ghost btn-xs">Edit</Link>
        <button onClick={handleDelete} className="btn btn-danger btn-xs">Delete</button>
      </div>
    </article>
  );
}
