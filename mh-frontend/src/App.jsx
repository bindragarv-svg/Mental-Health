import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Navbar from './components/Navbar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Prediction from './pages/Prediction.jsx';
import History from './pages/History.jsx';
import About from './pages/About.jsx';
import useTheme from './hooks/useTheme.js';

export default function App() {
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();
  return (
    <div className="min-h-screen lg:pl-64">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <Navbar onMenu={() => setOpen(true)} theme={theme} onToggleTheme={toggle} />
      <main className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/predict" element={<Prediction />} />
          <Route path="/history" element={<History />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
}
