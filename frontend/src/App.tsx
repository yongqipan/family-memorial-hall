import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from './pages/Login';
import Register from './pages/Register';
import MemorialHall from './pages/MemorialHall';
import FamilyTree from './pages/FamilyTree';
import Biography from './pages/Biography';
import MediaGallery from './pages/MediaGallery';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* 公共路由 */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 受保护路由 */}
          <Route
            element={
              <PrivateRoute>
                <Routes />
              </PrivateRoute>
            }
          >
            <Route path="/" element={<Navigate to="/memorials" replace />} />
            <Route path="/memorials/:id" element={<MemorialHall />} />
            <Route path="/family" element={<FamilyTree />} />
            <Route path="/memorials/:id/biography" element={<Biography />} />
            <Route path="/memorials/:id/media" element={<MediaGallery />} />
            <Route path="/memorials/:id/messages" element={<Messages />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
