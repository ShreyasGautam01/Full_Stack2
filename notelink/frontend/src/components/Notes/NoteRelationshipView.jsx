import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ForceGraph2D from 'react-force-graph-2d';
import { useNotes } from '../../hooks/useNotes';
import {
  parseCategories, allCategories,
  noteMatchesSearch, noteMatchesCategories,
  categoryColor,
} from '../../utils/categoryHelper';

export const REL_TYPES = {
  RELATED_TO:    { label: 'Related to',    color: '#7F77DD' },
  DEPENDS_ON:    { label: 'Depends on',    color: '#EF9F27' },
  CONTRADICTS:   { label: 'Contradicts',   color: '#E24B4A' },
  IS_EXAMPLE_OF: { label: 'Is example of', color: '#1D9E75' },
  EXTENDS:       { label: 'Extends',       color: '#378ADD' },
  REFERENCES:    { label: 'References',    color: '#D85A30' },
};

const typeColor = (t) => REL_TYPES[t]?.color ?? '#888';
const typeLabel = (t) => REL_TYPES[t]?.label ?? t;

export default function NoteRelationshipView() {
  const {
    notes, relationships, loading, error,
    fetchNotes, createRelationship, deleteRelationship,
  } = useNotes();
  const navigate = useNavigate();

  // ── Filters ───────────────────────────────────────────────────────────────
  const [search,           setSearch]           = useState('');
  const [activeCategories, setActiveCategories] = useState(new Set());

  // ── Selection ─────────────────────────────────────────────────────────────
  const [selected,  setSelected]  = useState(null);
  const [linkForm,  setLinkForm]  = useState({ targetId: '', type: 'RELATED_TO' });
  const [linkError, setLinkError] = useState('');
  const [linking,   setLinking]   = useState(false);

  // ── Canvas sizing ─────────────────────────────────────────────────────────
  const canvasRef = useRef();
  const graphRef  = useRef();
  const [canvasH, setCanvasH] = useState(500);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([e]) => setCanvasH(Math.max(360, e.contentRect.height)));
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const g = graphRef.current;
    if (!g) return;
    g.d3Force('charge')?.strength(-250);
    g.d3Force('link')?.distance(90);
  }, [loading]);

  // ── Derived: lookup table, category list ──────────────────────────────────
  const noteById   = useMemo(
    () => Object.fromEntries(notes.map(n => [String(n.id), n])),
    [notes]
  );

  const categories = useMemo(() => allCategories(notes), [notes]);

  const toggleCategory = (cat) =>
    setActiveCategories(prev => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });

  // ── Graph data – search checks title, content AND categories ─────────────
  const graphData = useMemo(() => {
    const visible = notes.filter(n => {
      // Text search: matches title, content, or any category tag
      const matchText = !search.trim() || noteMatchesSearch(n, search.trim());
      // Category pills: OR across selected pills, each note may have multiple cats
      const matchCat  = noteMatchesCategories(n, activeCategories);
      return matchText && matchCat;
    });
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
  }, [notes, relationships, search, activeCategories]);

  // ── Stats for the "nothing selected" panel ────────────────────────────────
  const stats = useMemo(() => {
    const deg = {};
    notes.forEach(n => { deg[n.id] = 0; });
    relationships.forEach(r => {
      deg[r.sourceNoteId] = (deg[r.sourceNoteId] || 0) + 1;
      deg[r.targetNoteId] = (deg[r.targetNoteId] || 0) + 1;
    });
    const top = [...notes]
      .map(n => ({ ...n, degree: deg[n.id] || 0 }))
      .sort((a, b) => b.degree - a.degree)
      .slice(0, 5)
      .filter(n => n.degree > 0);

    // Count notes per category (a note with 2 cats is counted in both)
    const catCounts = {};
    notes.forEach(n => {
      const cats = parseCategories(n.category);
      if (cats.length === 0) {
        catCounts['—'] = (catCounts['—'] || 0) + 1;
      } else {
        cats.forEach(c => { catCounts[c] = (catCounts[c] || 0) + 1; });
      }
    });

    return { top, catCounts };
  }, [notes, relationships]);

  // ── Event handlers ────────────────────────────────────────────────────────
  const handleNodeClick = useCallback((node) => {
    setSelected(node);
    setLinkForm({ targetId: '', type: 'RELATED_TO' });
    setLinkError('');
  }, []);

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

  const nodeLinks  = selected
    ? relationships.filter(r =>
        String(r.sourceNoteId) === selected.id ||
        String(r.targetNoteId) === selected.id)
    : [];

  const otherNotes = notes.filter(n => !selected || String(n.id) !== selected.id);

  if (loading) return <div className="page-state">Loading graph…</div>;
  if (error)   return <div className="page-state error">{error}</div>;

  return (
    <div className="graph-page">
      <header className="page-header">
        <h1>Note graph</h1>
        <span className="hint">
          {graphData.nodes.length} / {notes.length} notes · {relationships.length} links
        </span>
      </header>

      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <div className="graph-toolbar">
        {/* Text search – matches title, content AND any category tag */}
        <div className="graph-search-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Filter by title, content or category tag…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Escape' && setSearch('')}
          />
          {search && (
            <button type="button" className="btn btn-ghost btn-xs"
              onClick={() => setSearch('')}>Clear</button>
          )}
        </div>

        {/* Category pills – filter by clicking tags (OR logic) */}
        {categories.length > 0 && (
          <div className="cat-filter-row">
            <button
              type="button"
              className={`cat-pill${activeCategories.size === 0 ? ' active' : ''}`}
              onClick={() => setActiveCategories(new Set())}
            >All</button>
            {categories.map(cat => {
              const isActive = activeCategories.has(cat);
              const color    = categoryColor(cat, notes);
              return (
                <button
                  key={cat} type="button"
                  className={`cat-pill${isActive ? ' active' : ''}`}
                  style={isActive
                    ? { background: color + '33', color, borderColor: color + '88' }
                    : {}}
                  onClick={() => toggleCategory(cat)}
                >
                  {cat}
                  <span className="cat-pill-count">{stats.catCounts[cat] ?? 0}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Main layout ─────────────────────────────────────────────────── */}
      <div className="graph-layout">

        {/* Canvas */}
        <div className="graph-canvas" ref={canvasRef}>
          <ForceGraph2D
            ref={graphRef}
            graphData={graphData}
            nodeCanvasObject={(node, ctx, gs) => {
              const note  = noteById[node.id];
              const cats  = parseCategories(note?.category);
              // Colour priority: explicit nodeColor > first category colour > auto
              const color = note?.nodeColor
                || (cats.length > 0 ? categoryColor(cats[0], notes) : node.color);
              const isSel = selected?.id === node.id;
              const r     = isSel ? 9 : 6;

              if (isSel) {
                ctx.beginPath();
                ctx.arc(node.x, node.y, r + 5, 0, 2 * Math.PI);
                ctx.fillStyle = color + '30';
                ctx.fill();
              }

              ctx.beginPath();
              ctx.arc(node.x, node.y, r, 0, 2 * Math.PI);
              ctx.fillStyle = color;
              ctx.fill();

              if (isSel) {
                ctx.beginPath();
                ctx.arc(node.x, node.y, r, 0, 2 * Math.PI);
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 1.5 / gs;
                ctx.stroke();
              }

              if (gs > 0.5) {
                const fs = Math.max(10 / gs, 2);
                const maxChars = Math.floor(60 / (fs * 0.55));
                const lbl = node.label.length > maxChars
                  ? node.label.slice(0, maxChars - 1) + '…'
                  : node.label;
                ctx.font = `${isSel ? '600' : '400'} ${fs}px sans-serif`;
                ctx.fillStyle    = 'rgba(230,228,222,0.95)';
                ctx.textAlign    = 'center';
                ctx.textBaseline = 'top';
                ctx.fillText(lbl, node.x, node.y + r + 3 / gs);
              }
            }}
            nodePointerAreaPaint={(node, color, ctx) => {
              ctx.fillStyle = color;
              ctx.beginPath();
              ctx.arc(node.x, node.y, 10, 0, 2 * Math.PI);
              ctx.fill();
            }}
            linkColor={link => typeColor(link.type)}
            linkWidth={2}
            linkDirectionalArrowLength={8}
            linkDirectionalArrowRelPos={1}
            linkLabel={link => typeLabel(link.type)}
            onNodeClick={handleNodeClick}
            onBackgroundClick={() => setSelected(null)}
            onNodeDoubleClick={node => navigate(`/notes/${node.id}`)}
            backgroundColor="transparent"
            height={canvasH}
          />

          <div className="graph-legend">
            {Object.entries(REL_TYPES).map(([key, { label, color }]) => (
              <span key={key} className="legend-item">
                <span className="legend-line" style={{ background: color }} />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Side panel */}
        <aside className="graph-panel">
          {selected ? (
            <SelectedPanel
              selected={selected}
              note={noteById[selected.id]}
              notes={notes}
              nodeLinks={nodeLinks}
              otherNotes={otherNotes}
              linkForm={linkForm}
              setLinkForm={setLinkForm}
              linkError={linkError}
              linking={linking}
              onCreateLink={handleCreateLink}
              onDeleteLink={handleDeleteLink}
              onOpen={() => navigate(`/notes/${selected.id}`)}
            />
          ) : (
            <StatsPanel
              notes={notes}
              graphData={graphData}
              stats={stats}
              categories={categories}
              activeCategories={activeCategories}
            />
          )}
        </aside>
      </div>
    </div>
  );
}

// ── Selected-node panel ───────────────────────────────────────────────────────
function SelectedPanel({ selected, note, notes, nodeLinks, otherNotes,
                         linkForm, setLinkForm, linkError, linking,
                         onCreateLink, onDeleteLink, onOpen }) {
  const accentColor = note?.nodeColor || '#7F77DD';
  const cats = parseCategories(note?.category);
  return (
    <>
      {cats.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.3rem', marginBottom: '.5rem' }}>
          {cats.map(c => (
            <span key={c} className="category-badge"
              style={{ background: categoryColor(c, notes) + '22',
                       color:       categoryColor(c, notes),
                       borderColor: categoryColor(c, notes) + '88' }}>
              {c}
            </span>
          ))}
        </div>
      )}
      <h2 className="panel-title">{selected.label}</h2>
      <div style={{ display: 'flex', gap: '.5rem', marginBottom: '.75rem' }}>
        <button className="btn btn-ghost btn-sm" onClick={onOpen}>Open note</button>
        <span className="hint" style={{ alignSelf: 'center' }}>
          {nodeLinks.length} link{nodeLinks.length !== 1 ? 's' : ''}
        </span>
      </div>

      <hr className="divider" />
      <p className="panel-section">Links</p>
      {nodeLinks.length === 0
        ? <p className="hint">No links yet.</p>
        : nodeLinks.map(r => {
            const isSrc = String(r.sourceNoteId) === selected.id;
            const peer  = isSrc ? r.targetNoteTitle : r.sourceNoteTitle;
            const color = typeColor(r.type);
            return (
              <div key={r.id} className="link-row">
                <span className="link-arrow" style={{ color }}>{isSrc ? '→' : '←'}</span>
                <span className="link-target" title={peer}>{peer}</span>
                <span className="link-type-badge"
                  style={{ background: color + '22', color, borderColor: color + '66' }}>
                  {typeLabel(r.type)}
                </span>
                <button type="button" className="btn btn-danger btn-xs"
                  onClick={() => onDeleteLink(String(r.id))}>×</button>
              </div>
            );
          })
      }

      <hr className="divider" />
      <p className="panel-section">Add link from this note</p>
      {linkError && <p className="field-error">{linkError}</p>}
      <form onSubmit={onCreateLink} className="link-form">
        <select
          value={linkForm.targetId}
          onChange={e => setLinkForm(p => ({ ...p, targetId: e.target.value }))}
          required
        >
          <option value="">— select target note —</option>
          {otherNotes.map(n => <option key={n.id} value={n.id}>{n.title}</option>)}
        </select>
        <div className="type-selector">
          {Object.entries(REL_TYPES).map(([key, { label, color }]) => (
            <label key={key}
              className={`type-option${linkForm.type === key ? ' selected' : ''}`}
              style={linkForm.type === key
                ? { borderColor: color, background: color + '22', color }
                : {}}>
              <input type="radio" name="rel-type" value={key}
                checked={linkForm.type === key}
                onChange={() => setLinkForm(p => ({ ...p, type: key }))} />
              <span className="type-dot" style={{ background: color }} />
              {label}
            </label>
          ))}
        </div>
        {linkForm.targetId && (
          <p className="link-preview" style={{ color: typeColor(linkForm.type) }}>
            "{selected.label}" <em>{typeLabel(linkForm.type).toLowerCase()}</em> "
            {otherNotes.find(n => String(n.id) === linkForm.targetId)?.title}"
          </p>
        )}
        <button type="submit" className="btn btn-primary btn-sm"
          disabled={linking || !linkForm.targetId}>
          {linking ? 'Adding…' : 'Add link'}
        </button>
      </form>
    </>
  );
}

// ── Stats panel ───────────────────────────────────────────────────────────────
function StatsPanel({ notes, graphData, stats, categories, activeCategories }) {
  return (
    <div className="stats-panel">
      <p className="panel-section">Overview</p>
      <div className="stats-row">
        <div className="stat-box">
          <span className="stat-value">{graphData.nodes.length}</span>
          <span className="stat-label">Visible</span>
        </div>
        <div className="stat-box">
          <span className="stat-value">{graphData.links.length}</span>
          <span className="stat-label">Links</span>
        </div>
        <div className="stat-box">
          <span className="stat-value">{notes.length}</span>
          <span className="stat-label">Total</span>
        </div>
      </div>

      {stats.top.length > 0 && (
        <>
          <p className="panel-section" style={{ marginTop: '1rem' }}>Most connected</p>
          {stats.top.map(n => {
            const cats  = parseCategories(n.category);
            const color = n.nodeColor || (cats[0] ? categoryColor(cats[0]) : '#7F77DD');
            return (
              <div key={n.id} className="stats-note-row">
                <span className="stats-dot" style={{ background: color }} />
                <span className="stats-title" title={n.title}>{n.title}</span>
                <span className="stats-degree">{n.degree}</span>
              </div>
            );
          })}
        </>
      )}

      {categories.length > 0 && (
        <>
          <p className="panel-section" style={{ marginTop: '1rem' }}>Categories</p>
          {Object.entries(stats.catCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([cat, count]) => {
              const color    = cat !== '—' ? categoryColor(cat) : '#888';
              const isActive = activeCategories.has(cat);
              return (
                <div key={cat} className={`cat-stat-row${isActive ? ' highlighted' : ''}`}>
                  <span className="stats-dot" style={{ background: color }} />
                  <span className="stats-title">{cat}</span>
                  <span className="stats-degree">{count}</span>
                </div>
              );
            })
          }
        </>
      )}

      <p className="hint" style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '.8rem' }}>
        Click a node · Double-click to open
      </p>
    </div>
  );
}