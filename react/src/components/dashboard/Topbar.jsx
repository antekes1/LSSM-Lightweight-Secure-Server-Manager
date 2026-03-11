import React from 'react';
import { Search, Bell, MessageCircle, Gift, BarChart3 } from 'lucide-react';

const IconBadge = ({ icon: Icon, count }) => {
  return (
    <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 text-slate-600 shadow">
      <Icon size={18} />
      <span className="absolute -right-1 -top-1 min-w-[20px] rounded-full bg-violet-700 px-1.5 py-0.5 text-[10px] font-bold text-white">
        {count}
      </span>
    </button>
  );
};

const Topbar = () => {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <h2 className="text-3xl font-bold text-white">Dashboard</h2>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex min-w-[220px] items-center gap-2 rounded-2xl bg-white/80 px-4 py-3 shadow">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search here..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>

        <IconBadge icon={Gift} count={2} />
        <IconBadge icon={Bell} count={12} />
        <IconBadge icon={MessageCircle} count={5} />

        <button className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-700 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow">
          Generate Report
          <BarChart3 size={18} />
        </button>
      </div>
    </div>
  );
};

export default Topbar;
