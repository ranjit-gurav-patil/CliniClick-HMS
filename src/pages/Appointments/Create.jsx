import { useState, useEffect } from 'react';
import api from '../../api'; 
import Sidebar from '../../components/Sidebar';

export default function CreateAppointment() {
  const [patients, setPatients] = useState([]);
  const [departments, setDepartments] = useState([]); // <-- 1. New State for Departments
  
  const [formData, setFormData] = useState({
    patient_id: '',
    department_id: '', // <-- Start empty
    symptoms: ''
  });
  
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  // 2. Fetch BOTH patients and departments when the page loads
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Promise.all fetches both APIs at the exact same time!
        const [patientsRes, departmentsRes] = await Promise.all([
          api.get('/patients'),
          api.get('/departments')
        ]);
        
        setPatients(patientsRes.data.patients);
        setDepartments(departmentsRes.data.departments);

        // Optional: Automatically select the first department if it exists
        if (departmentsRes.data.departments.length > 0) {
          setFormData(prev => ({ 
            ...prev, 
            department_id: departmentsRes.data.departments[0].id 
          }));
        }

      } catch (error) {
        console.error("Failed to load data");
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await api.post('/visits/create', formData);
      
      setStatus({ 
        type: 'success', 
        message: 'Appointment successfully booked!' 
      });
      // Reset the form
      setFormData({ ...formData, patient_id: '', symptoms: '' }); 
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: error.response?.data?.message || 'Failed to book appointment.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans selection:bg-blue-200">
      
      <Sidebar activePage="appointments" />

      <div className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <div className="mb-10 max-w-3xl">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            Book Appointment
          </h1>
          <p className="text-slate-500 font-medium">
            Schedule a new visit for an existing patient.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 max-w-3xl">
          
          {status.message && (
            <div className={`mb-6 p-4 rounded-xl font-medium border ${
              status.type === 'success' 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-red-50 text-red-700 border-red-200'
            }`}>
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              
              {/* THE PATIENT DROPDOWN */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Select Patient</label>
                <select 
                  name="patient_id"
                  value={formData.patient_id}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                >
                  <option value="">-- Choose a registered patient --</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.user?.name} (Phone: {patient.user?.phone})
                    </option>
                  ))}
                </select>
              </div>

              {/* THE NEW DYNAMIC DEPARTMENT DROPDOWN */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Department</label>
                <select 
                  name="department_id"
                  value={formData.department_id}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                >
                  <option value="">-- Choose a department --</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Symptoms / Reason for Visit</label>
                <textarea 
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
                  placeholder="Briefly describe the patient's symptoms..."
                ></textarea>
              </div>

            </div>

            <div className="pt-4 border-t border-slate-100">
              <button 
                type="submit" 
                disabled={isLoading || patients.length === 0 || departments.length === 0}
                className={`w-full md:w-auto px-8 py-3 rounded-xl text-white font-bold shadow-lg transition-all ${
                  isLoading || patients.length === 0 || departments.length === 0
                    ? 'bg-slate-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/25 transform hover:-translate-y-0.5'
                }`}
              >
                {isLoading ? 'Booking...' : 'Confirm Appointment'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
} 