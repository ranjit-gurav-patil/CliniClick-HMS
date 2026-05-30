import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../api';
import { useRazorpay } from '../../hooks/useRazorpay'; // <-- IMPORT HOOK

export default function Home() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [data, setData] = useState(null);
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  const { openCheckout } = useRazorpay(); // <-- INITIALIZE HOOK

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, plansResponse] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/plans')
        ]);
        setData(statsResponse.data);
        setPlans(plansResponse.data.plans);
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePayment = async (planSlug) => {
    setIsProcessingPayment(true);
    const token = localStorage.getItem('token');

    try {
      const orderResponse = await api.post('/razorpay/order', 
        { plan_slug: planSlug },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Use the unified hook
      openCheckout({
        orderData: orderResponse.data,
        onSuccess: () => {
          alert(`Payment Successful! Your command center is now unlocked.`);
          window.location.reload(); 
        },
        onDismiss: () => setIsProcessingPayment(false)
      });
      
    } catch (error) {
      alert("Failed to initiate payment");
      setIsProcessingPayment(false);
    }
  };

  const isLocked = data && (
    data.stats.subscription_status === 'pending' || 
    data.stats.subscription_status === 'expired' || 
    data.stats.subscription_days_left <= 0
  );

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans selection:bg-sky-200">
      <Sidebar activePage="home" />

      <div className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {user?.name} 👋
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Here is what is happening at your clinic today.</p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600"></div>
            <p className="text-slate-500 font-bold animate-pulse">Verifying secure connection...</p>
          </div>
        ) : isLocked ? (
          <div className="animate-fade-in-up">
            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 mb-8 flex items-start gap-4">
               <div className="text-3xl">🔒</div>
               <div>
                 <h2 className="text-xl font-bold text-rose-900 mb-1">Subscription Inactive</h2>
                 <p className="text-rose-700">
                   {data.stats.subscription_status === 'pending' 
                    ? "Your initial payment is pending. Please select a plan below to unlock your clinic's command center."
                    : "Your subscription has expired. Please renew a plan below to regain access to your patient records."}
                 </p>
               </div>
            </div>

            <h3 className="text-2xl font-extrabold text-slate-900 mb-6 text-center">Select your plan to continue</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div key={plan.id} className={plan.is_popular ? "bg-gradient-to-b from-sky-600 to-blue-700 rounded-[2rem] p-8 shadow-xl shadow-blue-600/20 relative text-white" : "bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm"}>
                  {plan.is_popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-950 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-md">
                      Most Popular
                    </div>
                  )}
                  <h3 className={`text-lg font-bold mb-2 ${plan.is_popular ? 'text-sky-100' : 'text-slate-500'}`}>{plan.name}</h3>
                  <div className="mb-6">
                    <span className={`text-4xl font-black tracking-tight ${plan.is_popular ? 'text-white' : 'text-slate-900'}`}>₹{plan.price}</span>
                    <span className={plan.is_popular ? 'text-sky-200' : 'text-slate-500'}> {plan.billing_period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.slice(0, 4).map((feature, index) => (
                      <li key={index} className={`flex items-center gap-2 text-sm font-medium ${plan.is_popular ? 'text-sky-50' : 'text-slate-600'}`}>
                        <span className={plan.is_popular ? 'text-sky-300' : 'text-emerald-500'}>✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button 
                    onClick={() => handlePayment(plan.slug)}
                    disabled={isProcessingPayment}
                    className={plan.is_popular ? "w-full py-3 text-center bg-white text-blue-700 rounded-xl font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md disabled:opacity-50" : "w-full py-3 text-center bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-xl font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"}
                  >
                    Select {plan.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 animate-fade-in-up">
            <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 text-xl">👥</div>
                <h3 className="text-lg font-bold text-slate-700">Today's Visits</h3>
              </div>
              <h1 className="text-4xl font-black text-slate-900">{data.stats.todays_appointments || 0}</h1>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 text-xl">💳</div>
                <h3 className="text-lg font-bold text-slate-700">Total Patients</h3>
              </div>
              <h1 className="text-4xl font-black text-slate-900">{data.stats.total_patients || 0}</h1>
            </div>
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/20 rounded-full blur-2xl -z-10"></div>
              <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2"><span>⚙️</span> Account Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                  <span className="text-sm text-slate-300 font-medium">Subscription</span>
                  <span className="text-xs font-bold px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-md uppercase tracking-wider">{data.stats.subscription_status}</span>
                </div>
                <div className="flex justify-between items-center bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                  <span className="text-sm text-slate-300 font-medium">Days Remaining</span>
                  <span className="text-sm font-bold text-white">{data.stats.subscription_days_left}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}