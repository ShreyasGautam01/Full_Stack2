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
  Grow,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Fab,
  Breadcrumbs,
  Link,
  ThemeProvider,
  createTheme,
  CssBaseline
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
  Launch as PortalIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// --- THEME CONFIGURATION ---
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#a5d6a7' }, // Soft Sage Green
    secondary: { main: '#90caf9' }, // Calm Blue
    background: { default: '#0a0e14', paper: '#1a1f26' },
  },
  typography: {
    fontFamily: '"Quicksand", "Roboto", "serif"',
    h4: { fontWeight: 700 },
  },
  shape: { borderRadius: 16 },
});

// --- MOCK DATA STRUCTURE (THE MEMORY PALACE) ---
// This illustrates the recursive nature: Environments contain Notes and Portals (Sub-images)
const INITIAL_PALACE = {
  id: 'root',
  name: 'The Grand Library',
  imageUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=2000',
  items: [
    { id: 'note-1', type: 'note', x: 30, y: 45, title: 'Philosophy of Loci', content: 'The method of loci is a strategy for memory enhancement...', color: '#ffd54f' },
    { 
      id: 'portal-1', 
      type: 'portal', 
      x: 75, 
      y: 60, 
      title: 'Enter the Study Desk',
      target: {
        id: 'desk',
        name: 'The Oak Desk',
        imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=2000',
        items: [
          { id: 'note-2', type: 'note', x: 20, y: 30, title: 'Draft Paper', content: 'Finish the material ui project by tonight.', color: '#ef9a9a' },
          { 
            id: 'portal-2', 
            type: 'portal', 
            x: 50, 
            y: 50, 
            title: 'Open the Secret Box',
            target: {
              id: 'box',
              name: 'Inside the Box',
              imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=2000',
              items: [{ id: 'note-3', type: 'note', x: 45, y: 45, title: 'Hidden Key', content: 'Passphrase: 42-Alpha-Theta', color: '#ce93d8' }]
            }
          }
        ]
      }
    }
  ]
};

// --- COMPONENTS ---

const GlassCard = ({ children, sx }) => (
  <Paper
    elevation={0}
    sx={{
      background: 'rgba(26, 31, 38, 0.7)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      p: 2,
      ...sx
    }}
  >
    {children}
  </Paper>
);

const Marker = ({ item, onClick, onHover }) => {
  const isPortal = item.type === 'portal';
  
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.2 }}
      style={{
        position: 'absolute',
        top: `${item.y}%`,
        left: `${item.x}%`,
        transform: 'translate(-50%, -50%)',
        cursor: 'pointer',
        zIndex: 10
      }}
      onClick={(e) => { e.stopPropagation(); onClick(item); }}
    >
      <Tooltip title={item.title} arrow>
        <Box
          sx={{
            width: isPortal ? 48 : 24,
            height: isPortal ? 48 : 24,
            borderRadius: '50%',
            bgcolor: isPortal ? 'primary.main' : (item.color || 'secondary.main'),
            boxShadow: `0 0 20px ${isPortal ? '#a5d6a7' : '#90caf9'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid white',
            animation: 'pulse 2s infinite'
          }}
        >
          {isPortal ? <PortalIcon sx={{ color: '#000' }} /> : <LightbulbIcon sx={{ fontSize: 14, color: '#000' }} />}
        </Box>
      </Tooltip>
      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0px rgba(165, 214, 167, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(165, 214, 167, 0); }
          100% { box-shadow: 0 0 0 0px rgba(165, 214, 167, 0); }
        }
      `}</style>
    </motion.div>
  );
};

export default function App() {
  const [navigationStack, setNavigationStack] = useState([INITIAL_PALACE]);
  const [activeNote, setActiveNote] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [revealLevel, setRevealLevel] = useState(0); // For the "Step-by-step" reveal

  const currentLevel = useMemo(() => navigationStack[navigationStack.length - 1], [navigationStack]);

  // Initial Reveal Sequence
  useEffect(() => {
    const timer = setTimeout(() => setRevealLevel(1), 800);
    const timer2 = setTimeout(() => setRevealLevel(2), 1600);
    return () => { clearTimeout(timer); clearTimeout(timer2); };
  }, [currentLevel]);

  const handleMarkerClick = (item) => {
    if (item.type === 'portal') {
      setRevealLevel(0);
      setNavigationStack([...navigationStack, item.target]);
    } else {
      setActiveNote(item);
    }
  };

  const handleGoBack = () => {
    if (navigationStack.length > 1) {
      setRevealLevel(0);
      setNavigationStack(navigationStack.slice(0, -1));
    }
  };

  const handleCanvasClick = (e) => {
    if (!editMode) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const newNote = {
      id: Date.now().toString(),
      type: 'note',
      x,
      y,
      title: 'New Memory',
      content: '',
      color: '#ffffff'
    };
    setActiveNote(newNote);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ height: '100vh', width: '100vw', overflow: 'hidden', bgcolor: 'background.default', position: 'relative' }}>
        
        {/* TOP BAR / BREADCRUMBS */}
        <AppBar position="absolute" sx={{ background: 'transparent', boxShadow: 'none', top: 20 }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton 
                onClick={() => setSidebarOpen(true)}
                sx={{ bgcolor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)' }}
              >
                <CollectionsIcon />
              </IconButton>
              
              <GlassCard sx={{ py: 0.5, px: 2 }}>
                <Breadcrumbs separator={<Typography sx={{ color: 'white' }}>/</Typography>}>
                  {navigationStack.map((lvl, index) => (
                    <Typography key={lvl.id} sx={{ color: index === navigationStack.length - 1 ? 'primary.main' : 'white', fontWeight: 600 }}>
                      {lvl.name}
                    </Typography>
                  ))}
                </Breadcrumbs>
              </GlassCard>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                variant="contained" 
                startIcon={<EditIcon />}
                onClick={() => setEditMode(!editMode)}
                sx={{ 
                  borderRadius: 10, 
                  bgcolor: editMode ? 'error.main' : 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(5px)',
                  '&:hover': { bgcolor: editMode ? 'error.dark' : 'rgba(255,255,255,0.2)' }
                }}
              >
                {editMode ? 'Exit Designer' : 'Design Mode'}
              </Button>
              {navigationStack.length > 1 && (
                <Fab size="small" onClick={handleGoBack} color="secondary">
                  <ArrowBackIcon />
                </Fab>
              )}
            </Box>
          </Toolbar>
        </AppBar>

        {/* MAIN SPATIAL CANVAS */}
        <Box 
          sx={{ 
            height: '100%', 
            width: '100%', 
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={handleCanvasClick}
        >
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentLevel.id}
              initial={{ scale: 1.1, opacity: 0, filter: 'blur(20px)' }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                filter: revealLevel > 0 ? 'blur(0px)' : 'blur(20px)' 
              }}
              exit={{ scale: 0.9, opacity: 0, filter: 'blur(20px)' }}
              transition={{ duration: 0.8 }}
              style={{
                width: '100%',
                height: '100%',
                backgroundImage: `url(${currentLevel.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
              }}
            >
              {/* VIGNETTE OVERLAY */}
              <Box sx={{ 
                position: 'absolute', 
                inset: 0, 
                boxShadow: 'inset 0 0 150px rgba(0,0,0,0.8)',
                pointerEvents: 'none'
              }} />

              {/* RENDER ITEMS (NOTES/PORTALS) */}
              {revealLevel > 1 && currentLevel.items.map((item) => (
                <Marker 
                  key={item.id} 
                  item={item} 
                  onClick={handleMarkerClick}
                />
              ))}

              {/* EDIT MODE INSTRUCTION */}
              {editMode && (
                <Fade in={true}>
                  <Box sx={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)' }}>
                    <GlassCard>
                      <Typography variant="body2" sx={{ color: 'white' }}>
                        Click anywhere on the image to plant a new Memory Anchor
                      </Typography>
                    </GlassCard>
                  </Box>
                </Fade>
              )}
            </motion.div>
          </AnimatePresence>
        </Box>

        {/* NOTE EDITOR DIALOG */}
        <Dialog 
          open={Boolean(activeNote)} 
          onClose={() => setActiveNote(null)}
          PaperProps={{
            sx: {
              background: 'rgba(30, 35, 45, 0.9)',
              backdropFilter: 'blur(15px)',
              borderRadius: 5,
              border: '1px solid rgba(255,255,255,0.1)',
              width: '100%',
              maxWidth: 500
            }
          }}
        >
          <Box sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h5" sx={{ fontFamily: 'serif', fontStyle: 'italic' }}>
                Refining the Memory...
              </Typography>
              <IconButton onClick={() => setActiveNote(null)} size="small">
                <CloseIcon />
              </IconButton>
            </Box>

            <TextField
              fullWidth
              label="Anchor Title"
              variant="standard"
              defaultValue={activeNote?.title}
              sx={{ mb: 4, '& .MuiInput-root': { fontSize: '1.5rem' } }}
            />

            <TextField
              fullWidth
              multiline
              rows={6}
              label="Deep Thought / Content"
              variant="outlined"
              defaultValue={activeNote?.content}
              sx={{ bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 2 }}
            />

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button variant="text" onClick={() => setActiveNote(null)}>Discard</Button>
              <Button variant="contained" startIcon={<SaveIcon />} onClick={() => setActiveNote(null)}>
                Store in Palace
              </Button>
            </Box>
          </Box>
        </Dialog>

        {/* COLLECTION DRAWER */}
        <Drawer anchor="left" open={isSidebarOpen} onClose={() => setSidebarOpen(false)}>
          <Box sx={{ width: 300, bgcolor: 'background.paper', height: '100%' }}>
            <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <CollectionsIcon color="primary" />
              <Typography variant="h6">Your Palaces</Typography>
            </Box>
            <Divider sx={{ opacity: 0.1 }} />
            <List>
              <ListItem button selected onClick={() => setSidebarOpen(false)}>
                <ListItemIcon><BookIcon color="primary" /></ListItemIcon>
                <ListItemText primary="The Grand Library" secondary="3 Locations • 5 Notes" />
              </ListItem>
              <ListItem button disabled>
                <ListItemIcon><AddIcon /></ListItemIcon>
                <ListItemText primary="Create New Palace" />
              </ListItem>
            </List>
          </Box>
        </Drawer>

        {/* FOOTER HINT */}
        <Box sx={{ position: 'absolute', bottom: 20, right: 20 }}>
          <Tooltip title="Help / Guide">
            <Fab color="primary" size="small">
              <LightbulbIcon />
            </Fab>
          </Tooltip>
        </Box>
      </Box>
    </ThemeProvider>
  );
}