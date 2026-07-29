import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ConsentProvider } from './context/ConsentContext';
import { LabGate } from './components/LabGate';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Privacy } from './pages/Privacy';
import './App.css';

function App() {
  return (
    <LabGate>
      <AuthProvider>
        <ConsentProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/privacy" element={<Privacy />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ConsentProvider>
      </AuthProvider>
    </LabGate>
  );
}

export default App;
