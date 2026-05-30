import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/cliniclick-logo.png'; // Ensure you have a logo image in this path

export default function Sidebar({ activePage }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  // State to track which menus are expanded. 
  // It automatically opens the menu if the activePage belongs to it!
  const [openMenus, setOpenMenus] = useState({
    patients: activePage === 'PatientList' || activePage === 'create-patient',
    appointments: activePage === 'appointments' || activePage === 'create-appointment'
  });

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/'; 
  };

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  // A tiny helper component for the Chevron Arrow
  const Chevron = ({ isOpen }) => (
    <svg 
      className={`w-4 h-4 ml-auto transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-400' : 'text-slate-500'}`} 
      fill="none" viewBox="0 0 24 24" stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );

  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col min-h-screen border-r border-slate-800 shadow-2xl">
      {/* Brand Header */}
      <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center gap-4">
        
        {/* The Logo Image */}
        <div className="shrink-0">
          <img 
            src={logo} 
            alt="CliniClick Logo" 
            className="h-30 object-contain drop-shadow-lg" 
          />
        </div>

        {/* The Brand Text */}
       
        
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        
        {/* --- OVERVIEW --- */}
        <button 
          onClick={() => navigate('/dashboard')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
            activePage === 'home' 
              ? 'bg-blue-600/10 text-blue-400 shadow-inner' 
              : 'hover:bg-slate-800 hover:text-white'
          }`}
        >
          <span>📊</span> Overview
        </button>

        {/* --- PATIENTS MENU --- */}
        <div className="space-y-1">
          <button 
            onClick={() => toggleMenu('patients')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
              openMenus.patients || activePage.includes('Patient') 
                ? 'bg-slate-800/50 text-white' 
                : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>🏥</span> Patient Records
            <Chevron isOpen={openMenus.patients} />
          </button>
          
          {/* Patients Submenu */}
          {openMenus.patients && (
            <div className="pl-11 pr-2 py-1 space-y-1">
              <button 
                onClick={() => navigate('/PatientList')}
                className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                  activePage === 'PatientList' ? 'text-blue-400 font-bold bg-blue-600/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                All Patients
              </button>
              <button 
                onClick={() => navigate('/patients/create')} // Make sure this matches your Route
                className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                  activePage === 'create-patient' ? 'text-blue-400 font-bold bg-blue-600/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                + Register Patient
              </button>
            </div>
          )}
        </div>

        {/* --- APPOINTMENTS MENU --- */}
        <div className="space-y-1">
          <button 
            onClick={() => toggleMenu('appointments')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
              openMenus.appointments || activePage.includes('appointment') 
                ? 'bg-slate-800/50 text-white' 
                : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>📅</span> Appointments
            <Chevron isOpen={openMenus.appointments} />
          </button>
          
          {/* Appointments Submenu */}
          {openMenus.appointments && (
            <div className="pl-11 pr-2 py-1 space-y-1">
              <button 
                onClick={() => navigate('/AppointmentsList')} // Make sure this matches your Route
                className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                  activePage === 'appointments-list' ? 'text-blue-400 font-bold bg-blue-600/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                All Appointments
              </button>
              <button 
                onClick={() => navigate('/appointments/create')}
                className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                  activePage === 'appointments' ? 'text-blue-400 font-bold bg-blue-600/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                + Book Appointment
              </button>
            </div>
          )}
        </div>

      </div>

      {/* User Profile & Logout */}
      <div className="p-4 bg-slate-950 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-500 flex items-center justify-center text-white font-bold shadow-lg">
            {user?.name.charAt(0) || '?'}
          </div>
          <div>
            <p className="text-sm font-bold text-white">{user?.name || 'Doctor'}</p>
            <p className="text-xs text-slate-400 capitalize">{user?.role || 'Staff'}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400 rounded-lg transition-colors font-semibold"
        >
          Logout
        </button>
      </div>
    </div>
  );
}