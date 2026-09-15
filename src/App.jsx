import { Routes, Route } from 'react-router-dom';
import BirthdayPage from './pages/BirthdayPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<BirthdayPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}

export default App;
