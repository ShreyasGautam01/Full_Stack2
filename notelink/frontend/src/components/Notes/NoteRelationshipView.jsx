import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ForceGraph2D from 'react-force-graph-2d';
import { useNotes } from '../../hooks/useNotes';

// ── Relationship type registry ────────────────────────────────────────────────
// Each entry drives: link colour in the graph, badge colour in the panel,
// and the option list in the "Add link" form.
export const REL_TYPES = {
  RELATED_TO:    { label: 'Related to',     color: '#7F77DD' },
  DEPENDS_ON:    { label: 'Depends on',     color: '#EF9F27' },
  CONTRADICTS:   { label: 'Contradicts',    color: '#E24B4A' },
  IS_EXAMPLE_OF: { label: 'Is example of',  color: '#1D9E75' },
  EXTENDS:       { label: 'Extends',        color: '#378ADD' },
  REFERENCES:    { label: 'References',     color: '#D85A30' },
};

const typeColor = (type) => REL_TYPES[type]?.color ?? '#888888';
const typeLabel = (type) => REL_TYPES[type]?.label ?? type;

export default function NoteRelationshipView() {
  const {
    notes, relationships, loading, error, fetchNotes,
    createRelationship, deleteRelationship,
  } = useNotes();
  const navigate = useNavigate();

  // ── State ────────────────────────────────────────────────────────────────
  const [selected,  setSelected]  = useState(null);
  const [search,    setSearch]    = useState('');
  const [linkForm,  setLinkForm]  = useState({ targetId: '', type: 'RELATED_TO' });
  const [linkError, setLinkError] = useState('');
  const [linking,   setLinking]   = useState(false);

  // Responsive canvas sizing
  const canvasWrapRef = useRef();
  const [canvasH, setCanvasH] = useState(480);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  useEffect(() => {
    const el = canvasWrapRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([entry]) => {
      setCanvasH(Math.max(300, entry.contentRect.height));
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // ── Filtered graph data ───────────────────────────────────────────────────
  const graphData = useMemo(() => {
    const term = search.trim().toLowerCase();
    const visible = term
      ? notes.filter(n => n.title.toLowerCase().includes(term))
      : notes;
    const ids = new Set(visible.map(n => String(n.id)));

    return {
      nodes: visible.map(n => ({ id: String(n.id), label: n.title })),
      links: relationships
        .filter(r => ids.has(String(r.sourceNoteId)) && ids.has(String(r.targetNoteId)))
        .map(r => ({
          id:     String(r.id),
          source: String(r.sourceNoteId),
          target: String(r.targetNoteId),
          type:   r.type || 'RELATED_TO',
        })),
    };
  }, [notes, relationships, search]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleNodeClick = useCallback((node) => {
    setSelected(node);
    setLinkForm({ targetId: '', type: 'RELATED_TO' });
    setLinkError('');
  }, []);

  const handleBgClick = useCallback(() => setSelected(null), []);

  const handleCreateLink = async (e) => {
    e.preventDefault();
    if (!selected || !linkForm.targetId) return;
    setLinkError('');
    setLinking(true);
    try {
      await createRelationship({
        sourceNoteId: Number(selected.id),
        targetNoteId: Number(linkForm.targetId),
        type: linkForm.type,
      });
      setLinkForm({ targetId: '', type: 'RELATED_TO' });
    } catch (err) {
      setLinkError(err.response?.data?.message || 'Could not create link.');
    } finally {
      setLinking(false);
    }
  };

  const handleDeleteLink = async (relId) => {
    if (!window.confirm('Delete this relationship?')) return;
    await deleteRelationship(Number(relId));
  };

  // ── Derived data for the side panel ──────────────────────────────────────
  const nodeLinks  = selected
    ? relationships.filter(r =>
        String(r.sourceNoteId) === selected.id ||
        String(r.targetNoteId) === selected.id)
    : [];

  const otherNotes = notes.filter(n => !selected || String(n.id) !== selected.id);

  // ── Guards ────────────────────────────────────────────────────────────────
  if (loading) return <div className="page-state">Loading graph…</div>;
  if (error)   return <div className="page-state error">{error}</div>;

  return (
    <div className="graph-page">
      <header className="page-header">
        <h1>Note graph</h1>
        <span className="hint">{notes.length} notes · {relationships.length} links</span>
      </header>

      {/* ── Search bar ───────────────────────────────────────────────────── */}
      <div className="graph-search">
        <input
          type="text"
          placeholder="🔍 Filter nodes by title…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setSearch('')}>
              Clear
            </button>
            <span className="hint">
              {graphData.nodes.length} / {notes.length} notes
            </span>
          </>
        )}
      </div>

      <div className="graph-layout">

        {/* ── Graph canvas + legend ─────────────────────────────────────── */}
        <div className="graph-canvas" ref={canvasWrapRef}>
          <ForceGraph2D
            graphData={graphData}
            nodeLabel="label"
            nodeAutoColorBy="id"
            nodeCanvasObject={(node, ctx, gs) => {
              const isSel   = selected?.id === node.id;
              const r       = isSel ? 8 : 6;
              const fs      = Math.max(11 / gs, 2.5);

              // Node circle
              ctx.beginPath();
              ctx.arc(node.x, node.y, r, 0, 2 * Math.PI);
              ctx.fillStyle = isSel ? '#7F77DD' : node.color;
              ctx.fill();

              // Selection halo
              if (isSel) {
                ctx.beginPath();
                ctx.arc(node.x, node.y, r + 4, 0, 2 * Math.PI);
                ctx.strokeStyle = 'rgba(127,119,221,0.35)';
                ctx.lineWidth = 2.5;
                ctx.stroke();
              }

              // Label
              if (gs > 0.45) {
                ctx.font         = `${fs}px sans-serif`;
                ctx.fillStyle    = 'rgba(220,218,212,0.95)';
                ctx.textAlign    = 'center';
                ctx.textBaseline = 'top';
                ctx.fillText(node.label, node.x, node.y + r + 3);
              }
            }}
            // ── Link appearance driven entirely by type ────────────────────
            linkColor={(link) => typeColor(link.type)}
            linkWidth={2}
            linkDirectionalArrowLength={7}
            linkDirectionalArrowRelPos={1}
            linkLabel={(link) => typeLabel(link.type)}
            // ── Interaction ───────────────────────────────────────────────
            onNodeClick={handleNodeClick}
            onBackgroundClick={handleBgClick}
            onNodeDoubleClick={(node) => navigate(`/notes/${node.id}/edit`)}
            backgroundColor="transparent"
            height={canvasH}
          />

          {/* ── Type legend ─────────────────────────────────────────────── */}
          <div className="graph-legend">
            {Object.entries(REL_TYPES).map(([key, { label, color }]) => (
              <span key={key} className="legend-item">
                <span className="legend-line" style={{ background: color }} />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* ── Side panel ────────────────────────────────────────────────── */}
        <aside className="graph-panel">
          {selected ? (
            <>
              <h2 className="panel-title">{selected.label}</h2>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => navigate(`/notes/${selected.id}/edit`)}
              >Open note</button>

              <hr className="divider" />

              <p className="panel-section">Links</p>
              {nodeLinks.length === 0
                ? <p className="hint">No links yet.</p>
                : nodeLinks.map(r => {
                    const isSource = String(r.sourceNoteId) === selected.id;
                    const peer     = isSource ? r.targetNoteTitle : r.sourceNoteTitle;
                    const relId    = String(r.id);
                    const color    = typeColor(r.type);
                    return (
                      <div key={relId} className="link-row">
                        <span className="link-arrow" style={{ color }}>
                          {isSource ? '→' : '←'}
                        </span>
                        <span className="link-target" title={peer}>{peer}</span>
                        <span
                          className="link-type-badge"
                          style={{
                            background:  color + '22',
                            color,
                            borderColor: color + '66',
                          }}
                        >
                          {typeLabel(r.type)}
                        </span>
                        <button
                          type="button"
                          className="btn btn-danger btn-xs"
                          onClick={() => handleDeleteLink(relId)}
                        >×</button>
                      </div>
                    );
                  })
              }

              <hr className="divider" />

              <p className="panel-section">Add link from this note</p>
              {linkError && <p className="field-error">{linkError}</p>}

              <form onSubmit={handleCreateLink} className="link-form">
                {/* Target note picker */}
                <select
                  value={linkForm.targetId}
                  onChange={e => setLinkForm(p => ({ ...p, targetId: e.target.value }))}
                  required
                >
                  <option value="">— select target note —</option>
                  {otherNotes.map(n => (
                    <option key={n.id} value={n.id}>{n.title}</option>
                  ))}
                </select>

                {/* Relationship type picker – colour preview inline */}
                <div className="type-selector">
                  {Object.entries(REL_TYPES).map(([key, { label, color }]) => (
                    <label
                      key={key}
                      className={`type-option${linkForm.type === key ? ' selected' : ''}`}
                      style={linkForm.type === key
                        ? { borderColor: color, background: color + '22', color }
                        : {}}
                    >
                      <input
                        type="radio"
                        name="rel-type"
                        value={key}
                        checked={linkForm.type === key}
                        onChange={() => setLinkForm(p => ({ ...p, type: key }))}
                      />
                      <span
                        className="type-dot"
                        style={{ background: color }}
                      />
                      {label}
                    </label>
                  ))}
                </div>

                {/* Preview sentence */}
                {linkForm.targetId && (
                  <p className="link-preview" style={{ color: typeColor(linkForm.type) }}>
                    "{selected.label}"&nbsp;
                    <span style={{ fontStyle: 'italic' }}>
                      {typeLabel(linkForm.type).toLowerCase()}
                    </span>
                    &nbsp;"
                    {otherNotes.find(n => String(n.id) === linkForm.targetId)?.title}"
                  </p>
                )}

                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={linking || !linkForm.targetId}
                >
                  {linking ? 'Adding…' : 'Add link'}
                </button>
              </form>
            </>
          ) : (
            <div className="panel-empty">
              <p>Click a node to inspect its links.</p>
              <p className="hint" style={{ marginTop: '.5rem' }}>
                Double-click a node to open the note.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}