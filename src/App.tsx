import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Chat from './pages/Chat';
import Header from './components/Header';
import { CircularProgress } from '@mui/material';

const SettingsModal = lazy(() => import('./components/SettingsModal'));

const App = () => {
  const location = useLocation();
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to={`/chat/${Date.now()}`} />} />
        <Route path="/chat/:sessionId" element={<Chat />} />
      </Routes>
      {location.search.includes('settings=true') && (
        <Suspense fallback={<CircularProgress color="primary" sx={{ position: 'absolute', top: '50%', left: '50%' }} />}>
          <SettingsModal />
        </Suspense>
      )}
    </>
  );
};

export default App;
