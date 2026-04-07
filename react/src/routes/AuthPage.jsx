import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, ArrowRight, ArrowLeft, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SERVER_URL from "../settings.jsx";

import { useToast } from "../contexts/ToastContext";

const AuthPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast(); // <- Podpięcie toastów

  const [isLogin, setIsLogin] = useState(true);

  // Stan formularza logowania
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Stan formularza rejestracji (UI)
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [verPin, setVerPin] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/'); 
    }
  }, [navigate]);

  // --- LOGOWANIE ---
  const loginUser = async (e) => {
    e.preventDefault();
    if (!loginUsername || !loginPassword) {
      showToast("Warning", "Please fill in username and password.", "warning");
      return;
    }
    
    const formData = new URLSearchParams();
    formData.append('username', loginUsername);
    formData.append('password', loginPassword);

    try {
      const response = await fetch(`${SERVER_URL}/auth-api/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: formData.toString(), 
      });
      
      // Zawsze najpierw pobieramy JSON (błędy HTTP w FastAPI też zwracają JSON np. {"detail": "..."})
      const data = await response.json().catch(() => ({})); 

      if (!response.ok) {
        // Rzucenie błędem z komunikatem z backendu
        throw new Error(data.detail || "Nie udało się wybudzić serwera");
      }
      
      // Zapisujemy token (pamiętaj o odpowiednim kluczu: access_token)
      localStorage.setItem('token', data.access_token || data.acces_token);
      showToast("Success", "Zalogowano pomyślnie!", "success");
      navigate('/');
    } catch (error) {
      showToast("Error", error.message || "Nie udało się wybudzić serwera", "error");
    }
  };

  // --- REJESTRACJA (Na razie puste/tymczasowe dla toastów) ---
  const registerUser = (e) => {
    e.preventDefault();
    showToast("Info", "Rejestracja jest chwilowo zablokowana do testów logowania.", "info");
  };

  const handleSendPin = (e) => {
    e.preventDefault();
    showToast("Info", "Wysyłanie PIN-u chwilowo zablokowane.", "info");
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-900 font-poppins">
      
      <div className="absolute top-[0%] left-[10%] h-[500px] w-[500px] rounded-full bg-violet-600/30 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[0%] right-[10%] h-[500px] w-[500px] rounded-full bg-fuchsia-600/20 blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-4xl overflow-hidden rounded-[2.5rem] bg-white/[0.03] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl border border-white/10 min-h-[650px] flex">
        
        {/* Przesuwny panel z gradientem */}
        <div 
          className={`absolute top-2 bottom-2 w-[calc(50%-16px)] rounded-[2rem] bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-600 z-20 flex flex-col items-center justify-center p-10 text-center text-white shadow-[0_0_40px_rgba(124,58,237,0.3)] transition-all duration-700 ease-in-out ${
            isLogin ? 'left-2 translate-x-[100%]' : 'left-2 translate-x-0'
          }`}
        >
          <h2 className="text-4xl font-bold mb-4">
            {isLogin ? 'Hello, Friend!' : 'Welcome Back!'}
          </h2>
          <p className="text-white/80 text-lg mb-8">
            {isLogin 
              ? 'Enter your personal details and start journey with us' 
              : 'To keep connected with us please login with your personal info'}
          </p>
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="rounded-2xl border-2 border-white/80 bg-white/10 backdrop-blur-md px-8 py-3 font-semibold transition-all hover:bg-white hover:text-violet-800 hover:scale-105 flex items-center gap-2"
          >
            {isLogin ? (
              <><ArrowLeft size={20}/> Sign Up</>
            ) : (
              <>Sign In <ArrowRight size={20}/></>
            )}
          </button>
        </div>

        {/* Panel formularza (Rejestracja) */}
        <div className={`w-1/2 flex flex-col justify-center px-10 py-6 transition-all duration-700 ${
          isLogin ? 'opacity-0 translate-x-[20%] pointer-events-none' : 'opacity-100 translate-x-[100%]'
        }`}>
          <h2 className="text-3xl font-bold text-white mb-6">Create Account</h2>
          <form onSubmit={registerUser} className="space-y-3">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl bg-slate-800/50 py-3 pl-11 pr-4 text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-violet-500 transition border border-white/5 text-sm"
              />
            </div>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl bg-slate-800/50 py-3 pl-11 pr-4 text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-violet-500 transition border border-white/5 text-sm"
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl bg-slate-800/50 py-3 pl-11 pr-4 text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-violet-500 transition border border-white/5 text-sm"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl bg-slate-800/50 py-3 pl-11 pr-4 text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-violet-500 transition border border-white/5 text-sm"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="password" placeholder="Re-enter password" value={password2} onChange={(e) => setPassword2(e.target.value)}
                className="w-full rounded-xl bg-slate-800/50 py-3 pl-11 pr-4 text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-violet-500 transition border border-white/5 text-sm"
              />
            </div>
            
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="text" placeholder="Verification Code" value={verPin} onChange={(e) => setVerPin(e.target.value)}
                  className="w-full rounded-xl bg-slate-800/50 py-3 pl-11 pr-4 text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-violet-500 transition border border-white/5 text-sm"
                />
              </div>
              <button type="button" onClick={handleSendPin} className="px-4 text-sm font-semibold text-white bg-violet-600/50 hover:bg-violet-600 rounded-xl transition-colors whitespace-nowrap border border-violet-500/50">
                Send Pin
              </button>
            </div>

            <button type="submit" className="mt-2 w-full rounded-xl bg-white py-3 text-base font-bold text-slate-900 shadow-[0_10px_20px_rgba(255,255,255,0.1)] transition-all hover:bg-slate-200 hover:-translate-y-1">
              Sign Up
            </button>
          </form>
        </div>

        {/* Panel formularza (Logowanie) */}
        <div className={`absolute top-0 w-1/2 h-full flex flex-col justify-center p-12 transition-all duration-700 ${
          isLogin ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-20%] pointer-events-none'
        }`}>
          <h2 className="text-4xl font-bold text-white mb-8">Sign In</h2>
          <form onSubmit={loginUser} className="space-y-5">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input type="text" placeholder="Username" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)}
                className="w-full rounded-2xl bg-slate-800/50 py-4 pl-12 pr-4 text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-violet-500 transition border border-white/5"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full rounded-2xl bg-slate-800/50 py-4 pl-12 pr-4 text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-violet-500 transition border border-white/5"
              />
            </div>
            
            <div className="flex justify-end">
              <a href="#" className="text-sm font-medium text-fuchsia-400 hover:text-fuchsia-300 transition">
                Forgot your password?
              </a>
            </div>

            <button type="submit" className="w-full rounded-2xl bg-white py-4 text-lg font-bold text-slate-900 shadow-[0_10px_20px_rgba(255,255,255,0.1)] transition-all hover:bg-slate-200 hover:-translate-y-1">
              Sign In
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;