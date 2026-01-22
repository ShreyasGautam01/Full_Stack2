import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  TextField,
  Button,
  AppBar,
  Toolbar,
  Paper,
  Tooltip,
  Fade,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  Fab,
  Breadcrumbs,
  ThemeProvider,
  createTheme,
  CssBaseline,
  GlobalStyles,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stack,
  alpha,
  Slider
} from '@mui/material';
import {
  Add as AddIcon,
  Book as BookIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  Collections as CollectionsIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Lightbulb as LightbulbIcon,
  Launch as GatewayIcon,
  Delete as DeleteIcon,
  Note as NoteIcon,
  Settings as SettingsIcon,
  Palette as PaletteIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// --- COLOR PALETTE ---
const ACCENT_COLORS = [
  { name: 'Sage', hex: '#a5d6a7' },
  { name: 'Sky', hex: '#90caf9' },
  { name: 'Lavender', hex: '#ce93d8' },
  { name: 'Amber', hex: '#ffe082' },
  { name: 'Rose', hex: '#ef9a9a' },
  { name: 'Teal', hex: '#80cbc4' },
  { name: 'Slate', hex: '#b0bec5' },
  { name: 'Coral', hex: '#ffccbc' }
];

const DEFAULT_THEME_COLOR = '#a5d6a7';

// --- THEME ---
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: DEFAULT_THEME_COLOR },
    secondary: { main: '#90caf9' },
    background: { default: '#0a0e14', paper: '#1a1f26' },
    error: { main: '#ef5350' }
  },
  typography: {
    fontFamily: '"Quicksand", "Roboto", "sans-serif"',
    h4: { fontWeight: 700 },
  },
  shape: { borderRadius: 16 },
});

// --- CONSTANTS ---
const STORAGE_KEY = 'locicanvas_v2_data';
const INITIAL_DATA = [
  {
    id: 'root',
    name: 'The Grand Library',
    imageUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=2000',
    items: [
      { id: 'note-1', type: 'note', x: 30, y: 45, title: 'Philosophy of Loci', content: 'The method of loci is a strategy for memory enhancement...', color: '#ffe082' },
      { 
        id: 'gateway-1', 
        type: 'gateway', 
        x: 75, 
        y: 60, 
        title: 'Gateway to Study Desk',
        targetId: 'desk',
        color: '#a5d6a7'
      }
    ]
  },
  {
    id: 'desk',
    name: 'The Oak Desk',
    imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=2000',
    items: [
      { id: 'note-2', type: 'note', x: 20, y: 30, title: 'Draft Paper', content: 'Finish the project.', color: '#ef9a9a' }
    ]
  }
];

// --- HELPER COMPONENTS ---
const GlassCard = ({ children, sx }) => (
  <Paper elevation={0} sx={{ background: 'rgba(26, 31, 38, 0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.1)', p: 2, ...sx }}>
    {children}
  </Paper>
);

const Marker = ({ item, onClick, isEditMode, onDelete }) => {
  const isGateway = item.type === 'gateway';
  const itemColor = item.color || DEFAULT_THEME_COLOR;
  
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.2, zIndex: 100 }}
      style={{ position: 'absolute', top: `${item.y}%`, left: `${item.x}%`, transform: 'translate(-50%, -50%)', cursor: 'pointer', zIndex: 10 }}
      onClick={(e) => { e.stopPropagation(); onClick(item); }}
    >
      <Tooltip title={isEditMode ? `${item.title} (Right-click to delete)` : item.title} arrow>
        <Box sx={{ 
          width: isGateway ? 48 : 28, height: isGateway ? 48 : 28, borderRadius: '50%', 
          bgcolor: alpha(itemColor, 0.2), 
          boxShadow: `0 0 15px ${itemColor}`, 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          border: `2px solid ${itemColor}`, backdropFilter: 'blur(4px)',
          transition: 'all 0.3s ease'
        }}>
          {isGateway ? <GatewayIcon sx={{ fontSize: 24, color: itemColor }} /> : <LightbulbIcon sx={{ fontSize: 16, color: itemColor }} />}
        </Box>
      </Tooltip>
      {isEditMode && (
        <IconButton 
          size="small" 
          sx={{ position: 'absolute', top: -12, right: -12, bgcolor: 'error.main', width: 22, height: 22, '&:hover': { bgcolor: 'error.dark' }, zIndex: 101 }} 
          onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
        >
          <DeleteIcon sx={{ fontSize: 14, color: 'white' }} />
        </IconButton>
      )}
    </motion.div>
  );
};

// --- MAIN APPLICATION ---
export default function App() {
  // --- GLOBAL DATA STATE ---
  const [palaces, setPalaces] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_DATA;
    } catch (e) { return INITIAL_DATA; }
  });
  
  // --- NAVIGATION STATE ---
  const [navStack, setNavStack] = useState(['root']);
  const currentLevelId = navStack[navStack.length - 1];
  const currentLevel = useMemo(() => palaces.find(p => p.id === currentLevelId) || palaces[0], [palaces, currentLevelId]);

  // --- UI STATE ---
  const [editMode, setEditMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [revealLevel, setRevealLevel] = useState(0);

  // --- INTERACTION STATE ---
  const [contextMenu, setContextMenu] = useState(null); // { mouseX, mouseY }
  const [clickPos, setClickPos] = useState(null); // { x, y } (percentage)
  
  // --- DIALOGS STATE ---
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // The item object being edited
  const [gatewayDialogOpen, setGatewayDialogOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false); // Palace settings

  // --- PERSISTENCE EFFECT ---
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(palaces));
  }, [palaces]);

  // --- REVEAL ANIMATION ---
  useEffect(() => {
    setRevealLevel(0);
    const t1 = setTimeout(() => setRevealLevel(1), 300); // Image clear
    const t2 = setTimeout(() => setRevealLevel(2), 800); // Icons appear
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [currentLevelId]);

  // --- CORE LOGIC: CANVAS CLICKS ---
  const handleCanvasClick = (event) => {
    if (!editMode) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setClickPos({ x, y });
    setContextMenu(contextMenu === null ? { mouseX: event.clientX - 2, mouseY: event.clientY - 4 } : null);
  };

  const initiateCreate = (type) => {
    setContextMenu(null);
    if (type === 'note') {
      const newItem = {
        id: `note-${Date.now()}`,
        type: 'note',
        x: clickPos.x,
        y: clickPos.y,
        title: '',
        content: '',
        color: DEFAULT_THEME_COLOR
      };
      setEditingItem(newItem);
      setEditorOpen(true);
    } else if (type === 'gateway') {
      setGatewayDialogOpen(true);
    }
  };

  // --- CORE LOGIC: DATA UPDATES ---
  const handleSaveNote = (itemData) => {
    setPalaces(prev => prev.map(p => {
      if (p.id !== currentLevelId) return p;
      const exists = p.items.find(i => i.id === itemData.id);
      return exists 
        ? { ...p, items: p.items.map(i => i.id === itemData.id ? itemData : i) }
        : { ...p, items: [...p.items, itemData] };
    }));
    setEditorOpen(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (itemId) => {
    if (window.confirm("Delete this memory permanently?")) {
      setPalaces(prev => prev.map(p => 
        p.id === currentLevelId 
          ? { ...p, items: p.items.filter(i => i.id !== itemId) } 
          : p
      ));
      setEditorOpen(false); // Close editor if open
    }
  };

  const handleCreateGateway = (targetPalaceId, isNew = false, newPalaceName = '', newPalaceUrl = '') => {
    let finalTargetId = targetPalaceId;
    setPalaces(prev => {
      let newState = [...prev];
      if (isNew) {
        finalTargetId = `palace-${Date.now()}`;
        const newPalace = {
          id: finalTargetId,
          name: newPalaceName,
          imageUrl: newPalaceUrl || 'https://images.unsplash.com/photo-1516528387618-afa90b13e000?auto=format&fit=crop&q=80&w=2000',
          items: []
        };
        newState.push(newPalace);
      }
      const gatewayItem = {
        id: `gateway-${Date.now()}`,
        type: 'gateway',
        x: clickPos.x,
        y: clickPos.y,
        title: isNew ? `Gateway to ${newPalaceName}` : 'Gateway',
        targetId: finalTargetId,
        color: DEFAULT_THEME_COLOR
      };
      return newState.map(p => p.id === currentLevelId ? { ...p, items: [...p.items, gatewayItem] } : p);
    });
    setGatewayDialogOpen(false);
  };

  // --- CORE LOGIC: ENVIRONMENT SETTINGS ---
  const handleUpdateEnvironment = (newName, newUrl) => {
    setPalaces(prev => prev.map(p => p.id === currentLevelId ? { ...p, name: newName, imageUrl: newUrl } : p));
    setSettingsOpen(false);
  };

  const handleCreateNewEnvironment = (name, url) => {
      const newId = `palace-${Date.now()}`;
      const newPalace = { id: newId, name, imageUrl: url, items: [] };
      setPalaces([...palaces, newPalace]);
      setNavStack([newId]);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={{ 
        'html, body, #root': { margin: 0, padding: 0, width: '100vw', height: '100vh', overflow: 'hidden', bgcolor: '#0a0e14' },
        '::selection': { background: alpha(DEFAULT_THEME_COLOR, 0.3), color: '#fff' }
      }} />
      
      <Box sx={{ height: '100vh', width: '100vw', position: 'relative' }}>
        
        {/* --- HEADER --- */}
        <AppBar position="absolute" sx={{ background: 'transparent', boxShadow: 'none', top: 20, pointerEvents: 'none' }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pointerEvents: 'auto' }}>
              <IconButton onClick={() => setSidebarOpen(true)} sx={{ bgcolor: 'rgba(0,0,0,0.5)', color: 'white', '&:hover': { bgcolor: 'primary.main', color: 'black' } }}>
                <CollectionsIcon />
              </IconButton>
              <GlassCard sx={{ py: 0.5, px: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Breadcrumbs separator={<Typography sx={{ color: 'white', opacity: 0.5 }}>/</Typography>}>
                  {navStack.map((id, i) => {
                    const p = palaces.find(x => x.id === id);
                    return (
                      <Typography key={id} sx={{ 
                        color: i === navStack.length - 1 ? 'primary.main' : 'white', 
                        fontWeight: i === navStack.length - 1 ? 700 : 400,
                        cursor: i < navStack.length - 1 ? 'pointer' : 'default'
                      }} onClick={() => i < navStack.length - 1 && setNavStack(navStack.slice(0, i + 1))}>
                        {p?.name || 'Unknown'}
                      </Typography>
                    );
                  })}
                </Breadcrumbs>
                <IconButton size="small" onClick={() => setSettingsOpen(true)} sx={{ color: 'white', opacity: 0.7 }}>
                  <SettingsIcon fontSize="small" />
                </IconButton>
              </GlassCard>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, pointerEvents: 'auto' }}>
              <Button 
                variant="contained" 
                startIcon={<EditIcon />} 
                onClick={() => setEditMode(!editMode)} 
                sx={{ 
                  borderRadius: 10, 
                  bgcolor: editMode ? 'error.main' : 'rgba(255,255,255,0.1)', 
                  backdropFilter: 'blur(10px)',
                  boxShadow: editMode ? '0 0 20px rgba(239, 83, 80, 0.4)' : 'none',
                  '&:hover': { bgcolor: editMode ? 'error.dark' : 'rgba(255,255,255,0.2)' }
                }}
              >
                {editMode ? 'Stop Designing' : 'Design Mode'}
              </Button>
              {navStack.length > 1 && (
                <Fab size="small" onClick={() => setNavStack(prev => prev.slice(0, -1))} color="secondary">
                  <ArrowBackIcon />
                </Fab>
              )}
            </Box>
          </Toolbar>
        </AppBar>

        {/* --- CANVAS --- */}
        <Box 
          sx={{ height: '100%', width: '100%', position: 'relative', cursor: editMode ? 'crosshair' : 'default' }} 
          onClick={handleCanvasClick}
        >
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentLevelId}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1, filter: revealLevel > 0 ? 'blur(0px)' : 'blur(40px)' }}
              exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ width: '100%', height: '100%', backgroundImage: `url(${currentLevel?.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
              <Box sx={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, transparent 60%, rgba(0,0,0,0.7) 100%)', pointerEvents: 'none' }} />
              
              {revealLevel > 1 && currentLevel?.items.map(item => (
                <Marker 
                  key={item.id} 
                  item={item} 
                  isEditMode={editMode} 
                  onDelete={handleDeleteItem} 
                  onClick={(it) => {
                    if (it.type === 'gateway') {
                      setNavStack([...navStack, it.targetId]);
                    } else {
                      setEditingItem(it);
                      setEditorOpen(true);
                    }
                  }} 
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </Box>

        {/* --- DIALOGS --- */}
        
        {/* 1. Context Menu */}
        <Menu
          open={contextMenu !== null}
          onClose={() => setContextMenu(null)}
          anchorReference="anchorPosition"
          anchorPosition={contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined}
          PaperProps={{ sx: { bgcolor: 'rgba(20,20,20,0.95)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' } }}
        >
          <MenuItem onClick={() => initiateCreate('note')}>
            <ListItemIcon><NoteIcon color="secondary" fontSize="small" /></ListItemIcon>
            <ListItemText primary="Place Memory" />
          </MenuItem>
          <MenuItem onClick={() => initiateCreate('gateway')}>
            <ListItemIcon><GatewayIcon color="primary" fontSize="small" /></ListItemIcon>
            <ListItemText primary="Open Gateway" />
          </MenuItem>
        </Menu>

        {/* 2. Note Editor with Color Harmony */}
        <Dialog 
          open={editorOpen} 
          onClose={() => setEditorOpen(false)}
          TransitionComponent={GrowTransition}
          PaperProps={{ sx: { borderRadius: 4, bgcolor: '#1a1f26', minWidth: 400, border: '1px solid rgba(255,255,255,0.1)' } }}
        >
          {editingItem && (
            <NoteEditorForm 
              initialItem={editingItem} 
              onSave={handleSaveNote} 
              onDelete={handleDeleteItem}
              onCancel={() => setEditorOpen(false)} 
            />
          )}
        </Dialog>

        {/* 3. Gateway Creator */}
        <Dialog open={gatewayDialogOpen} onClose={() => setGatewayDialogOpen(false)}>
          <GatewaySetupForm 
            palaces={palaces} 
            currentId={currentLevelId} 
            onSubmit={handleCreateGateway} 
            onCancel={() => setGatewayDialogOpen(false)} 
          />
        </Dialog>

        {/* 4. Environment Settings */}
        <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)}>
          {currentLevel && (
            <EnvironmentSettingsForm 
              currentName={currentLevel.name} 
              currentUrl={currentLevel.imageUrl} 
              onSave={handleUpdateEnvironment} 
              onCancel={() => setSettingsOpen(false)} 
            />
          )}
        </Dialog>

        {/* 5. Sidebar */}
        <Drawer anchor="left" open={sidebarOpen} onClose={() => setSidebarOpen(false)} PaperProps={{ sx: { width: 320, bgcolor: '#0f1217' } }}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ fontFamily: 'serif', fontStyle: 'italic', mb: 2 }}>Palace Collection</Typography>
            <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
            <List>
              {palaces.map(p => (
                <ListItem key={p.id} disablePadding>
                  <ListItemButton 
                    selected={navStack.includes(p.id)}
                    onClick={() => { setNavStack([p.id]); setSidebarOpen(false); }}
                    sx={{ borderRadius: 2, mb: 1 }}
                  >
                    <ListItemIcon><BookIcon color={navStack.includes(p.id) ? 'primary' : 'inherit'} /></ListItemIcon>
                    <ListItemText primary={p.name} secondary={`${p.items.length} memories`} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Button fullWidth startIcon={<AddIcon />} variant="outlined" sx={{ mt: 2 }} onClick={() => setSettingsOpen(true)}>
                New Environment...
            </Button>
            {/* Note: This button opens settings for creating NEW env logic in real app, simplified here to reuse settings or add new dialog logic if needed */}
          </Box>
        </Drawer>

        {/* Help Button */}
        <Box sx={{ position: 'absolute', bottom: 30, right: 30 }}>
          <Tooltip title="Guide">
            <Fab color="primary" onClick={() => setHelpOpen(true)}><LightbulbIcon /></Fab>
          </Tooltip>
        </Box>

        <Snackbar open={editMode} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert severity="info" sx={{ width: '100%', bgcolor: 'rgba(33, 150, 243, 0.9)' }}>
            Design Mode: Click anywhere to add Memories or Gateways.
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

// --- MODULES ---

function NoteEditorForm({ initialItem, onSave, onDelete, onCancel }) {
  const [formData, setFormData] = useState(initialItem);
  const accentColor = formData.color || DEFAULT_THEME_COLOR;

  return (
    <Box sx={{ p: 4, borderTop: `6px solid ${accentColor}` }}>
      <Typography variant="h6" sx={{ mb: 3, color: accentColor }}>
        {formData.title ? 'Edit Memory' : 'New Memory'}
      </Typography>
      
      <TextField 
        fullWidth autoFocus label="Title" variant="filled" sx={{ mb: 3 }}
        value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
      />
      
      <TextField 
        fullWidth multiline rows={6} label="Content" variant="filled" 
        value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})}
        sx={{ bgcolor: alpha(accentColor, 0.05) }}
      />
      
      <Box sx={{ mt: 3 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block' }}>Color Harmony</Typography>
        <Stack direction="row" spacing={1}>
          {ACCENT_COLORS.map(c => (
            <Tooltip key={c.hex} title={c.name}>
              <Box 
                onClick={() => setFormData({ ...formData, color: c.hex })}
                sx={{ 
                  width: 24, height: 24, borderRadius: '50%', bgcolor: c.hex, cursor: 'pointer',
                  border: formData.color === c.hex ? '2px solid white' : 'none',
                  boxShadow: formData.color === c.hex ? '0 0 10px white' : 'none'
                }} 
              />
            </Tooltip>
          ))}
        </Stack>
      </Box>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <IconButton onClick={() => onDelete(formData.id)} color="error" title="Delete Memory">
          <DeleteIcon />
        </IconButton>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button onClick={onCancel} color="inherit">Cancel</Button>
          <Button variant="contained" onClick={() => onSave(formData)} sx={{ bgcolor: accentColor, '&:hover': { bgcolor: accentColor } }}>
            Save
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

function GatewaySetupForm({ palaces, currentId, onSubmit, onCancel }) {
  const [mode, setMode] = useState('existing'); 
  const [targetId, setTargetId] = useState('');
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');

  // Circular reference protection
  const availablePalaces = palaces.filter(p => p.id !== currentId);

  const handleSubmit = () => {
    if (mode === 'existing' && targetId) onSubmit(targetId, false);
    else if (mode === 'new' && newName) onSubmit(null, true, newName, newUrl);
  };

  return (
    <Box sx={{ p: 4, width: 400 }}>
      <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <GatewayIcon color="primary" /> Configure Gateway
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        <Button variant={mode === 'existing' ? 'contained' : 'outlined'} onClick={() => setMode('existing')} size="small" fullWidth>Link Existing</Button>
        <Button variant={mode === 'new' ? 'contained' : 'outlined'} onClick={() => setMode('new')} size="small" fullWidth>Create New</Button>
      </Box>

      {mode === 'existing' ? (
        <FormControl fullWidth>
          <InputLabel>Destination</InputLabel>
          <Select value={targetId} label="Destination" onChange={(e) => setTargetId(e.target.value)}>
            {availablePalaces.length === 0 && <MenuItem disabled>No other environments</MenuItem>}
            {availablePalaces.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
          </Select>
        </FormControl>
      ) : (
        <>
          <TextField fullWidth label="Environment Name" value={newName} onChange={e => setNewName(e.target.value)} sx={{ mb: 2 }} />
          <TextField fullWidth label="Image URL (Optional)" value={newUrl} onChange={e => setNewUrl(e.target.value)} helperText="Leave empty for default" />
        </>
      )}

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={mode === 'existing' && !targetId}>Create Link</Button>
      </Box>
    </Box>
  );
}

function EnvironmentSettingsForm({ currentName, currentUrl, onSave, onCancel }) {
  const [name, setName] = useState(currentName);
  const [url, setUrl] = useState(currentUrl);

  return (
    <Box sx={{ p: 4, width: 400 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>Environment Settings</Typography>
      <TextField fullWidth label="Environment Name" value={name} onChange={e => setName(e.target.value)} sx={{ mb: 3 }} />
      <TextField fullWidth label="Background Image URL" value={url} onChange={e => setUrl(e.target.value)} sx={{ mb: 3 }} />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button variant="contained" onClick={() => onSave(name, url)}>Update Environment</Button>
      </Box>
    </Box>
  );
}

const GrowTransition = React.forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />;
});