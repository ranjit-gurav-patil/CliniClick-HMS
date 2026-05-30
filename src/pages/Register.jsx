import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import logo from '../assets/cliniclick-logo.png';
import api from '../api';
import { useRazorpay } from '../hooks/useRazorpay'; // <-- IMPORT HOOK

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [plans, setPlans] = useState([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [selectedPlanSlug, setSelectedPlanSlug] = useState(searchParams.get('plan') || '');
  
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', hospital_name: ''
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const { openCheckout } = useRazorpay(); // <-- INITIALIZE HOOK

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get('/plans');
        setPlans(response.data.plans);
        if (!selectedPlanSlug && response.data.plans.length > 0) {
          setSelectedPlanSlug(response.data.plans[0].slug);
        }
      } catch (error) {
        console.error("Failed to load plans", error);
      } finally {
        setIsLoadingPlans(false);
      }
    };
    fetchPlans();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlanSlug) return alert("Please select a plan first.");
    setIsProcessing(true);

    try {
      const response = await api.post('/razorpay/guest-order', {
        ...formData,
        plan_slug: selectedPlanSlug
      });

      // Use the unified hook
      openCheckout({
        orderData: response.data,
        sessionToken: response.data.token,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        onSuccess: () => {
          alert(`Payment Successful! Account activated.`);
          navigate('/dashboard?payment=success');
        },
        onDismiss: () => {
          setIsProcessing(false);
          alert("Payment cancelled. Your account was created but is pending activation. Please log in to complete your payment.");
          navigate('/login');
        }
      });

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Registration failed. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8 font-sans selection:bg-sky-200">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-sky-100/50 blur-3xl mix-blend-multiply"></div>
        <div className="absolute top-[60%] -right-[10%] w-[60%] h-[60%] rounded-full bg-blue-100/40 blur-3xl mix-blend-multiply"></div>
      </div>
      <div className="max-w-7xl w-full bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 overflow-hidden relative z-10 flex flex-col lg:flex-row">
        
        {/* LEFT PANEL */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-slate-100">
          <div className="mb-10">
            <Link to="/" className="inline-block mb-6">
              <img src={logo} alt="CliniClick" className="h-12 w-auto object-contain hover:scale-105 transition-transform" />
            </Link>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create your clinic account</h2>
            <p className="mt-2 text-slate-500 font-medium">Already have an account? <Link to="/login" className="font-bold text-sky-600 hover:text-sky-500 transition-colors">Sign in securely</Link></p>
          </div>
          <form className="space-y-6" onSubmit={handleRegisterSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Clinic / Hospital Name</label>
                <input name="hospital_name" type="text" required value={formData.hospital_name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all shadow-sm" placeholder="Apollo City Center" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Your Full Name (Admin)</label>
                <input name="name" type="text" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all shadow-sm" placeholder="Dr. Sarah Connor" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                <input name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all shadow-sm" placeholder="sarah@apollo.com" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                <input name="phone" type="tel" required value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all shadow-sm" placeholder="9876543210" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Secure Password</label>
                <input name="password" type="password" required value={formData.password} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all shadow-sm" placeholder="••••••••" />
              </div>
            </div>
            <div className="pt-4">
              <button type="submit" disabled={isProcessing} className="w-full py-4 px-4 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl shadow-lg shadow-sky-600/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2">
                {isProcessing ? 'Connecting to Payment Gateway...' : 'Complete Registration & Pay'}
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 bg-slate-50/50">
          <h3 className="text-xl font-extrabold text-slate-900 mb-6">Select your subscription plan</h3>
          {isLoadingPlans ? (
             <div className="flex justify-center items-center h-40"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div></div>
          ) : (
            <div className="space-y-4">
              {plans.map((plan) => (
                <div key={plan.id} onClick={() => setSelectedPlanSlug(plan.slug)} className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all ${selectedPlanSlug === plan.slug ? 'border-sky-500 bg-white shadow-lg shadow-sky-500/10' : 'border-slate-200 bg-white hover:border-sky-300 shadow-sm'}`}>
                  <div className={`absolute top-6 right-6 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selectedPlanSlug === plan.slug ? 'border-sky-500 bg-sky-500' : 'border-slate-300'}`}>
                    {selectedPlanSlug === plan.slug && <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                  </div>
                  <div className="pr-12">
                    <h4 className="text-lg font-bold text-slate-900 mb-1">{plan.name}</h4>
                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="text-3xl font-black text-slate-900">₹{plan.price}</span>
                      <span className="text-sm font-medium text-slate-500">{plan.billing_period}</span>
                    </div>
                    <ul className="space-y-2 mt-4">
                      {plan.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-slate-600 font-medium"><span className="text-sky-500">✓</span> {feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-4">
            <span className="text-2xl">🔒</span>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">Payments are processed securely via Razorpay. Your card details are never stored on our servers.</p>
          </div>
        </div>
      </div>
    </div>
  );
}