import { Link } from 'react-router-dom';
import { useNotes } from '../../hooks/useNotes';
import { parseCategories } from '../../utils/categoryHelper';

export default function NoteCard({ note }) {
  const { deleteNote } = useNotes();

  const preview = note.content
    ? note.content.replace(/<[^>]+>/g, '').slice(0, 110)
    : '';

  const accentColor = note.nodeColor || '#534AB7';
  const categories  = parseCategories(note.category);

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!window.confirm(`Delete "${note.title}"?`)) return;
    await deleteNote(note.id);
  };

  return (
    <article className="note-card" style={{ '--card-accent': accentColor }}>
      <Link to={`/notes/${note.id}`} className="note-card-link">

        {/* Category tags */}
        {categories.length > 0 && (
          <div className="note-card-tags">
            {categories.map(cat => (
              <span
                key={cat}
                className="category-badge card-category"
                style={{
                  background:  accentColor + '22',
                  color:       accentColor,
                  borderColor: accentColor + '88',
                }}
              >{cat}</span>
            ))}
          </div>
        )}

        <h2 className="note-card-title">{note.title}</h2>

        {preview && (
          <p className="note-card-preview">
            {preview}{(note.content?.length ?? 0) > 110 ? '…' : ''}
          </p>
        )}

        {/* First image thumbnail */}
        {note.images?.[0] && (
          <div className="note-card-thumb">
            <img
              src={note.images[0].url} alt=""
              loading="lazy"
              onError={e => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
        )}

        <div className="note-card-meta">
          <span>
            {note.images?.length > 0
              ? `${note.images.length} image${note.images.length > 1 ? 's' : ''}`
              : ''}
          </span>
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