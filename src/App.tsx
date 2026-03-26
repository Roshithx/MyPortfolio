import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import PortfolioPage from './pages/PortfolioPage';
import AdminPage from './pages/AdminPage';
import { usePortfolioStore } from './store/usePortfolioStore';

function App() {
  const initialize = usePortfolioStore(state => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Routes>
      <Route path="/" element={<PortfolioPage />} />
      <Route path="/editrose/*" element={<AdminPage />} />
    </Routes>
  );
}

export default App;

