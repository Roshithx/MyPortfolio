import { Routes, Route } from 'react-router-dom';
import PortfolioPage from './pages/PortfolioPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<PortfolioPage />} />
      <Route path="/editrose/*" element={<AdminPage />} />
    </Routes>
  );
}

export default App;
