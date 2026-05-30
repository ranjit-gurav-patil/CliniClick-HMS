// CHANGE HERE: Imported HashRouter instead of BrowserRouter
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import LandingPage from './pages/LandingPage';
import DashboardHome from './pages/Dashboard/Home';
import CreatePatient from './pages/Patients/Create';
import PatientList from './pages/Patients/List';
import CreateAppointment from './pages/Appointments/Create';
import AppointmentsList from './pages/Appointments/List';
import Register from './pages/Register';

function App() {
  // 1. Safely check if a user is logged in
  const user = localStorage.getItem('user');
  const isAuthenticated = !!user; // Converts it to a strict true/false boolean

  return (
    // Because we imported HashRouter 'as Router' above, this tag stays exactly the same!
    <Router>
      <Routes>
        {/* The Landing Page Route: If logged in, go to dashboard. If not, show marketing page. */}
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} 
        />

        {/* The Login Route: */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
        />
        
        {/* The Register Route (Placeholder for now) */}
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} 
        />
        
        {/* The Dashboard Route: If logged in, show it. If not, kick them to Login. */}
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <DashboardHome /> : <Navigate to="/" replace />} 
        />
        
        {/* The Patient Registration Route */}
        <Route 
          path="/patients/create" 
          element={isAuthenticated ? <CreatePatient /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/PatientList" 
          element={isAuthenticated ? <PatientList /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/appointments/create" 
          element={isAuthenticated ? <CreateAppointment /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/AppointmentsList" 
          element={isAuthenticated ? <AppointmentsList /> : <Navigate to="/" replace />} 
        />
      </Routes>
    </Router>
  );
}

export default App;