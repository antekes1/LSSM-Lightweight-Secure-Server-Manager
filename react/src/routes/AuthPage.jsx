import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, ArrowLeft } from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-900 font-poppins">
      
      {/* Ozdobne kółka w tle (Neon Glow) */}
      <div className="absolute top-[0%] left-[10%] h-[500px] w-[500px] rounded-full bg-violet-600/30 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[0%] right-[10%] h-[500px] w-[500px] rounded-full bg-fuchsia-600/20 blur-[120px] pointer-events-none" />

      {/* Główny kontener - Dark Glassmorphism */}
      <div className="relative w-full max-w-4xl overflow-hidden rounded-[2.5rem] bg-white/[0.03] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl border border-white/10 min-h-[600px] flex">
        
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
        <div className={`w-1/2 flex flex-col justify-center p-12 transition-all duration-700 ${
          isLogin ? 'opacity-0 translate-x-[20%] pointer-events-none' : 'opacity-100 translate-x-[100%]'
        }`}>
          <h2 className="text-4xl font-bold text-white mb-8">Create Account</h2>
          <div className="space-y-5">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Name" 
                className="w-full rounded-2xl bg-slate-800/50 py-4 pl-12 pr-4 text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-violet-500 transition border border-white/5"
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full rounded-2xl bg-slate-800/50 py-4 pl-12 pr-4 text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-violet-500 transition border border-white/5"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full rounded-2xl bg-slate-800/50 py-4 pl-12 pr-4 text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-violet-500 transition border border-white/5"
              />
            </div>
            <button className="mt-4 w-full rounded-2xl bg-white py-4 text-lg font-bold text-slate-900 shadow-[0_10px_20px_rgba(255,255,255,0.1)] transition-all hover:bg-slate-200 hover:-translate-y-1">
              Sign Up
            </button>
          </div>
        </div>

        {/* Panel formularza (Logowanie) */}
        <div className={`absolute top-0 w-1/2 h-full flex flex-col justify-center p-12 transition-all duration-700 ${
          isLogin ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-20%] pointer-events-none'
        }`}>
          <h2 className="text-4xl font-bold text-white mb-8">Sign In</h2>
          <div className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full rounded-2xl bg-slate-800/50 py-4 pl-12 pr-4 text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-violet-500 transition border border-white/5"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full rounded-2xl bg-slate-800/50 py-4 pl-12 pr-4 text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-violet-500 transition border border-white/5"
              />
            </div>
            
            <div className="flex justify-end">
              <a href="#" className="text-sm font-medium text-fuchsia-400 hover:text-fuchsia-300 transition">
                Forgot your password?
              </a>
            </div>

            <button className="w-full rounded-2xl bg-white py-4 text-lg font-bold text-slate-900 shadow-[0_10px_20px_rgba(255,255,255,0.1)] transition-all hover:bg-slate-200 hover:-translate-y-1">
              Sign In
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;
