import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../assets/cliniclick-logo.png';
import api from '../../api'; 

export default function Login() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/send-otp', { phone });
      setMessage(`Test Code: ${response.data.test_otp}`);
      setStep(2);
    } catch (error) {
      setMessage('Error: Number not found.');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/verify-otp', { phone, otp });
      
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);
      
      window.location.href = '/dashboard';
    } catch (error) {
      setMessage('Invalid OTP. Try again.');
    }
  };

  return (
    // Clean, modern, light background
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans selection:bg-sky-200 relative overflow-hidden">
      
      {/* Decorative background blur to make it feel premium */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-sky-100/50 blur-3xl mix-blend-multiply"></div>
        <div className="absolute top-[60%] -right-[10%] w-[60%] h-[60%] rounded-full bg-blue-100/40 blur-3xl mix-blend-multiply"></div>
      </div>

      {/* Crisp White SaaS Card */}
      <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 p-8 sm:p-10 w-full max-w-md relative z-10">
        
        <div className="text-center mb-8">
          <Link to="/">
            <img src={logo} alt="CliniClick" className="mx-auto mb-4 h-16 w-auto object-contain hover:scale-105 transition-transform" />
          </Link>
          <p className="text-slate-400 text-sm tracking-widest uppercase font-bold">Secure Staff Portal</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-xl text-center font-medium text-sm border ${
            message.includes('Error') || message.includes('Invalid') 
              ? 'bg-red-50 text-red-600 border-red-100' 
              : 'bg-sky-50 text-sky-700 border-sky-100'
          }`}>
            {message}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-6 animate-fade-in-up">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
              <input 
                type="tel" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                required
                className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all shadow-sm"
                placeholder="Enter registered number"
              />
            </div>
            <button 
              type="submit" 
              className="w-full py-3.5 px-4 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl shadow-lg shadow-sky-600/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Request OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6 animate-fade-in-up">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">6-Digit Security Code</label>
              <input 
                type="text" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                required
                className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 tracking-[0.5em] text-center text-2xl placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all shadow-sm"
                placeholder="••••••"
              />
            </div>
            <button 
              type="submit" 
              className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Verify & Secure Login
            </button>
          </form>
        )}

        {/* The Register Link Section */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-500 font-medium">
            Don't have a clinic account yet?{' '}
            <Link 
              to="/register" 
              className="font-bold text-sky-600 hover:text-sky-500 transition-colors ml-1"
            >
              Register here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}