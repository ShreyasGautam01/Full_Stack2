import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import NoteService from '../../api/NoteService';
import RelationshipService from '../../api/RelationshipService';
import { REL_TYPES } from './NoteRelationshipView';

export default function NoteDetail() {
  const { id }     = useParams();
  const navigate   = useNavigate();

  const [note,     setNote]     = useState(null);
  const [links,    setLinks]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [lightbox, setLightbox] = useState(null); // { url, name, index }

  useEffect(() => {
    Promise.all([
      NoteService.getById(id),
      RelationshipService.getForNote(id).catch(() => []),
    ])
      .then(([noteData, relsData]) => {
        setNote(noteData);
        setLinks(relsData);
      })
      .catch(() => setError('Note not found or you do not have access.'))
      .finally(() => setLoading(false));
  }, [id]);

  // Keyboard navigation for lightbox
  const handleKeyDown = useCallback((e) => {
    if (!lightbox || !note?.images?.length) return;
    if (e.key === 'Escape')      setLightbox(null);
    if (e.key === 'ArrowRight')  setLightbox(lb => {
      const next = (lb.index + 1) % note.images.length;
      return { ...note.images[next], index: next };
    });
    if (e.key === 'ArrowLeft')   setLightbox(lb => {
      const prev = (lb.index - 1 + note.images.length) % note.images.length;
      return { ...note.images[prev], index: prev };
    });
  }, [lightbox, note]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (loading) return <div className="page-state">Loading…</div>;
  if (error)   return <div className="page-state error">{error}</div>;
  if (!note)   return null;

  const accentColor = note.nodeColor || '#534AB7';

  return (
    <div className="note-detail-page">

      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div className="note-detail-topbar">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>← Back</button>
        <div style={{ flex: 1 }} />
        <Link to={`/notes/${id}/edit`} className="btn btn-primary btn-sm">Edit note</Link>
      </div>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="note-detail-header" style={{ borderLeftColor: accentColor }}>
        {note.category && (
          <span
            className="category-badge"
            style={{
              background:  accentColor + '22',
              color:       accentColor,
              borderColor: accentColor + '88',
            }}
          >
            {note.category}
          </span>
        )}
        <h1 className="note-detail-title">{note.title}</h1>
        <p className="note-detail-meta">
          Last updated {new Date(note.updatedAt).toLocaleDateString(undefined, {
            year: 'numeric', month: 'long', day: 'numeric',
          })}
          {note.images?.length > 0 && ` · ${note.images.length} image${note.images.length > 1 ? 's' : ''}`}
        </p>
      </header>

      {/* ── Body grid: content + sidebar ────────────────────────────────── */}
      <div className="note-detail-grid">

        {/* Left: content + images ─────────────────────────────────────── */}
        <div className="note-detail-main">

          {/* Content */}
          <section className="note-content-section">
            {note.content
              ? note.content.split('\n').map((line, i) =>
                  line.trim()
                    ? <p key={i} className="note-content-line">{line}</p>
                    : <div key={i} className="note-content-spacer" />
                )
              : <p className="hint">No content yet. <Link to={`/notes/${id}/edit`}>Add some →</Link></p>
            }
          </section>

          {/* Image gallery */}
          {note.images?.length > 0 && (
            <section className="note-gallery-section">
              <h3 className="section-heading">
                Images
                <span className="section-count">{note.images.length}</span>
              </h3>
              <div className="gallery-grid">
                {note.images.map((img, idx) => (
                  <button
                    key={img.id}
                    type="button"
                    className="gallery-thumb"
                    onClick={() => setLightbox({ ...img, index: idx })}
                    title="Click to view full size"
                  >
                    <img
                      src={img.url}
                      alt=""
                      loading="lazy"
                      onError={e => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div className="gallery-broken">🖼</div>
                    <div className="gallery-overlay">⤢ View</div>
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right sidebar: linked notes ─────────────────────────────────── */}
        {links.length > 0 && (
          <aside className="note-detail-sidebar">
            <h3 className="section-heading">Linked notes</h3>
            {links.map(r => {
              const isSource = String(r.sourceNoteId) === id;
              const peerId   = isSource ? r.targetNoteId   : r.sourceNoteId;
              const peerTitle = isSource ? r.targetNoteTitle : r.sourceNoteTitle;
              const typeInfo = REL_TYPES[r.type] || { label: r.type, color: '#888' };
              return (
                <Link
                  key={r.id}
                  to={`/notes/${peerId}`}
                  className="linked-note-row"
                >
                  <span
                    className="linked-note-arrow"
                    style={{ color: typeInfo.color }}
                  >{isSource ? '→' : '←'}</span>
                  <span className="linked-note-title">{peerTitle}</span>
                  <span
                    className="link-type-badge"
                    style={{
                      background:  typeInfo.color + '22',
                      color:       typeInfo.color,
                      borderColor: typeInfo.color + '66',
                    }}
                  >{typeInfo.label}</span>
                </Link>
              );
            })}
          </aside>
        )}
      </div>

      {/* ── Lightbox ────────────────────────────────────────────────────── */}
      {lightbox && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          onClick={() => setLightbox(null)}
        >
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button
              className="lightbox-close"
              aria-label="Close"
              onClick={() => setLightbox(null)}
            >×</button>

            {note.images.length > 1 && (
              <button
                className="lightbox-nav lightbox-prev"
                aria-label="Previous image"
                onClick={() => {
                  const prev = (lightbox.index - 1 + note.images.length) % note.images.length;
                  setLightbox({ ...note.images[prev], index: prev });
                }}
              >‹</button>
            )}

            <img
              src={lightbox.url}
              alt={lightbox.fileName}
              className="lightbox-img"
            />

            {note.images.length > 1 && (
              <button
                className="lightbox-nav lightbox-next"
                aria-label="Next image"
                onClick={() => {
                  const next = (lightbox.index + 1) % note.images.length;
                  setLightbox({ ...note.images[next], index: next });
                }}
              >›</button>
            )}

            <p className="lightbox-caption">
              {lightbox.index + 1} / {note.images.length}
              <span style={{ marginLeft: '.75rem', opacity: .6 }}>
                {lightbox.fileName}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}