import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import api from '../../api';


export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch patients when the page loads
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        // Because of your master api.js, this actually calls http://localhost:8000/api/patients
        // AND it automatically attaches your JWT token!
        const response = await api.get('/patients');
        setPatients(response.data.patients);
      } catch (error) {
        console.error("Failed to fetch patients", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPatients();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans selection:bg-blue-200">
      <Sidebar activePage="patients" />

      <div className="flex-1 p-8 lg:p-12 overflow-y-auto">
        
        {/* Page Header with Action Button */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              Patient Directory
            </h1>
            <p className="text-slate-500 font-medium">
              Manage and view all registered patients.
            </p>
          </div>
          <button 
            onClick={() => navigate('/patients/create')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <span>➕</span> Add New Patient
          </button>
        </div>

        {/* The Data Table */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider border-b border-slate-100">
                  <th className="px-6 py-4 font-semibold">Patient Name</th>
                  <th className="px-6 py-4 font-semibold">Phone</th>
                  <th className="px-6 py-4 font-semibold">Age</th>
                  <th className="px-6 py-4 font-semibold">Blood Group</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-400 font-medium">
                      Loading patient data...
                    </td>
                  </tr>
                ) : patients.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-400 font-medium">
                      No patients found. Click "Add New Patient" to get started.
                    </td>
                  </tr>
                ) : (
                  patients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800">
                        {patient.user?.name || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-medium">
                        {patient.user?.phone || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {patient.age} yrs
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-red-100 text-red-700 font-bold rounded-full text-xs">
                          {patient.blood_group || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-blue-600 hover:text-blue-800 font-bold text-sm">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}

              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}