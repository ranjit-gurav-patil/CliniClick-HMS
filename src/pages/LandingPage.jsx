import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/cliniclick-logo.png'; 
import api from '../api';
import { useRazorpay } from '../hooks/useRazorpay'; // <-- IMPORT HOOK

export default function LandingPage() {
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  const { openCheckout } = useRazorpay(); // <-- INITIALIZE HOOK

  useEffect(() => {
    if (window.location.hash === '#pricing') {
      setTimeout(() => {
        const pricingSection = document.getElementById('pricing');
        if (pricingSection) pricingSection.scrollIntoView({ behavior: 'smooth' });
      }, 300); 
    }
    const fetchPlans = async () => {
      try {
        const response = await api.get('/plans');
        setPlans(response.data.plans);
      } catch (error) {
        console.error("Failed to load plans", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handlePayment = async (planSlug) => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const orderResponse = await api.post('/razorpay/order', 
          { plan_slug: planSlug },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // Use the unified hook
        openCheckout({
          orderData: orderResponse.data,
          onSuccess: () => {
            alert(`Payment Successful! Account activated.`);
            navigate('/dashboard?payment=success');
          }
        });
        
      } catch (error) {
        alert("Failed to initiate payment");
      }
      return;
    }
    navigate(`/register?plan=${planSlug}`);
  };

  return (
    // Changed base background to a soft, clean slate
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-sky-200">
      
      {/* 1. Glassmorphism Navigation Bar */}
      <nav className="fixed w-full z-50 top-0 transition-all duration-300 bg-white/60 backdrop-blur-xl border-b border-white/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            {/* If your logo is white, you may need a dark version of it here, or use text */}
            <img src={logo} alt="CliniClick"  />
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
            <Link to="/features" className="hover:text-sky-600 transition-colors">Features</Link>
            <Link to="/how-it-works" className="hover:text-sky-600 transition-colors">How it Works</Link>
            <Link to="/pricing" className="hover:text-sky-600 transition-colors">Pricing</Link>
            <Link to="/login" className="text-slate-600 hover:text-sky-600 transition-colors ml-4 border-l border-slate-300 pl-8">Sign In</Link>
            <Link to="/register" className="bg-sky-600 text-white px-6 py-2.5 rounded-full hover:bg-sky-500 transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-sky-500/30">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section with Background Image & Glass Overlay */}
      <header className="relative pt-40 pb-32 px-6 text-center overflow-hidden min-h-[90vh] flex flex-col justify-center">
        {/* Background Image Setup */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop')" }}
        ></div>
        {/* Soft Glass Overlay over the image */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-50/90 via-slate-50/80 to-slate-50"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-sky-100 text-sky-700 font-bold text-sm shadow-sm animate-bounce">
            ✨ The #1 Platform for Modern Clinics
          </div>
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter leading-[1.1] mb-8 text-slate-900">
            The brilliant way to <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600">
              run your clinic.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl md:text-2xl text-slate-600 font-medium tracking-tight mb-12">
            Patient records, smart scheduling, and automated billing. All beautifully integrated into one secure, lightning-fast platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white text-lg font-bold rounded-full hover:bg-slate-800 transition-all transform hover:scale-105 shadow-xl shadow-slate-900/20">
              Start your free trial
            </Link>
            <Link to="/pricing" className="w-full sm:w-auto px-8 py-4 bg-white/80 backdrop-blur-md text-slate-900 text-lg font-bold rounded-full border border-slate-200 hover:bg-white transition-all shadow-sm">
              View Pricing
            </Link>
          </div>
        </div>
      </header>

      {/* 3. Trusted By / Social Proof Banner */}
      <section className="py-10 border-y border-slate-200/60 bg-white/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Trusted by 500+ clinics and hospitals across India</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Placeholder SVGs for logos */}
            <h3 className="text-2xl font-black text-slate-800">Apollo<span className="text-sky-500">+</span></h3>
            <h3 className="text-2xl font-black text-slate-800">MedCore</h3>
            <h3 className="text-2xl font-black text-slate-800 border-2 border-slate-800 px-2">CITYCARE</h3>
            <h3 className="text-2xl font-black text-slate-800 italic">LifeLine</h3>
          </div>
        </div>
      </section>

      {/* 4. Glassmorphic Bento-Grid Features */}
      <section id="features" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">Everything you need.<br/>Nothing you don't.</h2>
          <p className="text-xl text-slate-500 font-medium">Built specifically for the workflow of modern doctors.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white/70 backdrop-blur-xl border border-white p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-2 transition-all duration-300 group">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-slate-900">Patient Management</h3>
            <p className="text-slate-500 text-lg leading-relaxed">Keep track of patient records, comprehensive medical histories, past visits, and lab reports all in one centralized, instantly accessible place.</p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-xl border border-white p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-2 transition-all duration-300 group">
            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="text-2xl">🗓️</span>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-slate-900">Smart Scheduling</h3>
            <p className="text-slate-500 text-lg leading-relaxed">Reduce no-shows and perfectly optimize your daily clinic calendar.</p>
          </div>
          
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 p-10 rounded-[2rem] shadow-2xl hover:-translate-y-2 transition-all duration-300 group text-white">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">Secure & Compliant</h3>
            <p className="text-slate-300 text-lg leading-relaxed">Bank-level encryption protecting your patients' highly sensitive medical data.</p>
          </div>
          
          <div className="md:col-span-2 bg-white/70 backdrop-blur-xl border border-white p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-2 transition-all duration-300 group">
            <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="text-2xl">💳</span>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-slate-900">Automated Billing</h3>
            <p className="text-slate-500 text-lg leading-relaxed">Generate instant invoices, accept UPI & Card payments, and track your clinic's revenue seamlessly integrated into your daily workflow.</p>
          </div>
        </div>
      </section>

      {/* 5. How It Works Section */}
      <section id="how-it-works" className="py-24 bg-sky-50/50 border-y border-sky-100">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-slate-900 mb-16">Get started in minutes.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center shadow-lg shadow-sky-100 text-2xl font-black text-sky-600 mb-6">1</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Register your clinic</h3>
              <p className="text-slate-500">Sign up and select a plan. No complex onboarding or installation required.</p>
            </div>
            <div>
              <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center shadow-lg shadow-sky-100 text-2xl font-black text-sky-600 mb-6">2</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Set up your staff</h3>
              <p className="text-slate-500">Add your receptionists and partner doctors to your secure workspace.</p>
            </div>
            <div>
              <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center shadow-lg shadow-sky-100 text-2xl font-black text-sky-600 mb-6">3</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Start treating patients</h3>
              <p className="text-slate-500">Log visits, write digital prescriptions, and manage your waiting room instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Dynamic Pricing Section (Restyled for Light Theme) */}
      <section id="pricing" className="py-32 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center tracking-tight mb-4 text-slate-900">Simple, transparent pricing.</h2>
        <p className="text-xl text-slate-500 font-medium text-center mb-16">Upgrade your clinic today. Cancel anytime.</p>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={
                  plan.is_popular 
                    ? "bg-gradient-to-b from-sky-600 to-blue-700 rounded-[2rem] p-10 transform md:-translate-y-4 shadow-2xl shadow-blue-600/30 relative text-white"
                    : "bg-white/80 backdrop-blur-lg border border-slate-200 rounded-[2rem] p-10 hover:border-sky-300 transition-all shadow-lg shadow-slate-200/50"
                }
              >
                {plan.is_popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-950 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-md">
                    Most Popular
                  </div>
                )}

                <h3 className={`text-xl font-bold mb-4 ${plan.is_popular ? 'text-sky-100' : 'text-slate-500'}`}>
                  {plan.name}
                </h3>
                
                <div className="mb-8">
                  <span className={`text-5xl font-black tracking-tight ${plan.is_popular ? 'text-white' : 'text-slate-900'}`}>₹{plan.price}</span>
                  <span className={plan.is_popular ? 'text-sky-200' : 'text-slate-500'}> {plan.billing_period}</span>
                </div>
                
                <ul className="space-y-4 mb-10">
                  {plan.features.map((feature, index) => (
                    <li key={index} className={`flex items-center gap-3 font-medium ${plan.is_popular ? 'text-sky-50' : 'text-slate-600'}`}>
                      <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs ${plan.is_popular ? 'bg-sky-400/30 text-white' : 'bg-emerald-100 text-emerald-600'}`}>
                        ✓
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button 
                  onClick={() => handlePayment(plan.slug)}
                  className={
                    plan.is_popular
                      ? "block w-full py-4 text-center bg-white text-blue-700 rounded-xl font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-white/20"
                      : "block w-full py-4 text-center bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                  }
                >
                  Select {plan.name}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 7. Beautiful Footer */}
      <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
               <div className="w-8 h-8 bg-sky-600 text-white rounded-lg flex items-center justify-center font-bold">C</div>
               <span className="text-xl font-bold text-white">CliniClick</span>
            </div>
            <p className="max-w-xs text-slate-500">Empowering doctors and clinics in India with next-generation medical software.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Product</h4>
            <ul className="space-y-3">
              <li><Link to="/features" className="hover:text-sky-400 transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-sky-400 transition-colors">Pricing</Link></li>
              <li><Link to="/register" className="hover:text-sky-400 transition-colors">Sign Up</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Support</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="hover:text-sky-400 transition-colors">Contact Us</Link></li>
              <li><Link to="/" className="hover:text-sky-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/" className="hover:text-sky-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-800/50 text-sm flex flex-col md:flex-row justify-between items-center">
          <p>© 2026 CliniClick SaaS. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Made with ❤️ for Healthcare</p>
        </div>
      </footer>

    </div>
  );
}