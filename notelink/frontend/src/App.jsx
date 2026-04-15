import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { NoteProvider } from './context/NoteContext';

import Navigation           from './components/Layout/Navigation';
import ProtectedRoute       from './components/Layout/ProtectedRoute';
import Login                from './components/Auth/Login';
import Register             from './components/Auth/Register';
import NoteList             from './components/Notes/NoteList';
import NoteEditor           from './components/Notes/NoteEditor';
import NoteRelationshipView from './components/Notes/NoteRelationshipView';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NoteProvider>
          <Navigation />
          <main className="main-content">
            <Routes>
              {/* Public routes */}
              <Route path="/login"    element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/"              element={<NoteList />} />
                <Route path="/notes/new"     element={<NoteEditor />} />
                <Route path="/notes/:id"     element={<NoteEditor />} />
                <Route path="/notes/:id/edit" element={<NoteEditor />} />
                <Route path="/graph"         element={<NoteRelationshipView />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </NoteProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
