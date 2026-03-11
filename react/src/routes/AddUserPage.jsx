import React, { useState } from 'react';
import { UserPlus, Mail, KeyRound, Shield, Check, X } from 'lucide-react';

const AddUser = () => {
  const [role, setRole] = useState('user');

  return (
    <div className="min-h-full w-full flex flex-col font-poppins text-slate-200">
      
      {/* Nagłówek */}
      <div className="flex items-center gap-4 mb-8 shrink-0">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/20">
          <UserPlus size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Add New User</h1>
          <p className="text-slate-400 text-xs mt-0.5">Create a new account and assign permissions.</p>
        </div>
      </div>

      {/* Formularz */}
      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-3xl rounded-2xl bg-slate-800/40 border border-slate-700/50 p-6 md:p-8 h-fit">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            
            {/* Dane podstawowe */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-violet-400 border-b border-slate-700/50 pb-2">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-medium ml-1">First Name</label>
                  <input type="text" placeholder="John" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-medium ml-1">Last Name</label>
                  <input type="text" placeholder="Doe" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-medium ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input type="email" placeholder="john.doe@example.com" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition" />
                </div>
              </div>
            </div>

            {/* Bezpieczeństwo i uprawnienia */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-semibold text-violet-400 border-b border-slate-700/50 pb-2">Security & Roles</h3>
              
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-medium ml-1">Temporary Password</label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input type="password" placeholder="••••••••" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition" />
                </div>
                <p className="text-[10px] text-slate-500 ml-1">User will be forced to change this upon first login.</p>
              </div>

              <div className="space-y-2 mt-4">
                <label className="text-xs text-slate-400 font-medium ml-1">Select Role</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {['user', 'editor', 'admin'].map((r) => (
                    <div 
                      key={r} 
                      onClick={() => setRole(r)}
                      className={`cursor-pointer rounded-xl border p-4 flex flex-col items-center justify-center gap-2 transition ${
                        role === r ? 'bg-violet-500/10 border-violet-500 text-violet-400' : 'bg-slate-900/30 border-slate-700 text-slate-400 hover:border-slate-500'
                      }`}
                    >
                      <Shield size={24} className={role === r ? 'text-violet-400' : 'text-slate-500'} />
                      <span className="text-sm font-semibold capitalize">{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Przyciski */}
            <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-slate-700/50">
              <button type="button" className="px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-700 transition flex items-center gap-2">
                <X size={16} /> Cancel
              </button>
              <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-500 hover:to-fuchsia-500 transition shadow-lg shadow-violet-500/20 flex items-center gap-2">
                <Check size={16} /> Create User
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
