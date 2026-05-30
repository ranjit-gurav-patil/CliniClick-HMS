import { useState, useEffect } from 'react';
import api from '../../api'; 
import Sidebar from '../../components/Sidebar';

export default function AppointmentsList() {
  const [visits, setVisits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const response = await api.get('/visits');
        setVisits(response.data.visits);
      } catch (error) {
        console.error("Failed to load appointments", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVisits();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans selection:bg-blue-200">
      
      {/* Notice we pass the exact activePage name that matches your Sidebar rules */}
      <Sidebar activePage="appointments-list" />

      <div className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              All Appointments
            </h1>
            <p className="text-slate-500 font-medium">
              Manage and view all scheduled patient visits.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Patient Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Symptoms / Reason</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date Scheduled</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500 font-medium">
                      Loading appointments...
                    </td>
                  </tr>
                ) : visits.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500 font-medium">
                      No appointments scheduled yet.
                    </td>
                  </tr>
                ) : (
                  visits.map((visit) => (
                    <tr key={visit.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{visit.patient?.user?.name || 'Unknown'}</div>
                        <div className="text-xs text-slate-500 font-medium mt-0.5">Blood: {visit.patient?.blood_group}</div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-600">
                        {visit.patient?.user?.phone}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                          {visit.department?.name || 'General'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                        {visit.symptoms || 'No symptoms provided'}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-600">
                        {new Date(visit.created_at).toLocaleDateString()}
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