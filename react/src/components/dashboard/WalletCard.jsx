import React from 'react';
import { RotateCw, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WalletCard = () => {
  const navigate = useNavigate();
  return (
    <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-600 p-6 text-white shadow-lg">
      <div className="absolute left-6 top-6 flex gap-2 opacity-40">
        <div className="h-10 w-10 rounded-full bg-white" />
        <div className="-ml-4 h-10 w-10 rounded-full bg-white" />
        <h1 className='flex self-center text-2xl text-white'>Servers:</h1>
      </div>

      <div className="pt-16">
        <div className='flex flex-row'>
        <button onClick={() => navigate("server/1")} className='flex w-2/3'>
        <div className='flex border rounded-2xl w-full px-3 py-2 justify-between items-center'>
          <h1>Ubuntu Server</h1>
          <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50/80 px-2 py-1 border border-emerald-100/50">
            <CheckCircle2 size={14} className="text-emerald-500" />
            <span className="text-sm font-medium text-slate-600">Up</span>
          </div>
        </div>
        </button>
        <div className='flex rounded-2xl px-5 py-2 justify-between items-center ml-[2%] text-violet-800 bg-gray-300'>
          Wake server
        </div>
        </div>
      </div>
    </div>
  );
};

export default WalletCard;
