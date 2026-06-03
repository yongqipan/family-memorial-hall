import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import MemorialHall from './pages/MemorialHall';
import FamilyTree from './pages/FamilyTree';
import Biography from './pages/Biography';
import MediaGallery from './pages/MediaGallery';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/memorials/:id"
          element={
            <PrivateRoute>
              <MemorialHall />
            </PrivateRoute>
          }
        />
        <Route
          path="/family"
          element={
            <PrivateRoute>
              <FamilyTree />
            </PrivateRoute>
          }
        />
        <Route
          path="/biography/:id"
          element={
            <PrivateRoute>
              <Biography />
            </PrivateRoute>
          }
        />
        <Route
          path="/media"
          element={
            <PrivateRoute>
              <MediaGallery />
            </PrivateRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <PrivateRoute>
              <Messages />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
