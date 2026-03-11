import React, { useState } from 'react';
import { 
  Server, HardDrive, Cpu, MemoryStick, Activity, 
  TerminalSquare, Power, Settings, ShieldCheck, 
  Globe, Network
} from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';

// --- MOCK DATA ---
const serverData = {
  hostname: "ubuntu-prod-db-01",
  state: "online",
  ip_address: "192.168.1.104",
  mac_address: "00:1A:2B:3C:4D:5E",
  os: "Ubuntu 22.04 LTS (x86_64)",
  kernel: "5.15.0-76-generic",
  token: "sk_live_938fh39...",
  last_seen: "2026-03-10 21:26:00",
  boot_time: "2026-02-28 14:00:00",
  hardware: { cpu_cores: 16, total_ram_mb: 65536, total_disk_gb: 2048 },
  live_stats: { cpu_usage: 42.5, ram_usage: 68.2, disk_usage: 55.0, net_in_kbps: 15420, net_out_kbps: 32100 },
};

const chartData = [
  { time: '10:00', cpu: 30, ram: 60 },
  { time: '10:05', cpu: 45, ram: 62 },
  { time: '10:10', cpu: 65, ram: 65 },
  { time: '10:15', cpu: 85, ram: 68 },
  { time: '10:20', cpu: 42, ram: 68 },
];

const servicesData = [
  { name: 'Nginx Proxy Manager', port: '80, 443, 81', domain: 'proxy.local', status: 'running' },
  { name: 'PostgreSQL', port: '5432', domain: 'db.local', status: 'running' },
  { name: 'Docker Daemon', port: '2375', domain: '-', status: 'running' },
  { name: 'Redis', port: '6379', domain: 'cache.local', status: 'stopped' },
];

const ServerDetails = () => {
  const [activeTab, setActiveTab] = useState('logs');

  return (
    /* Ważne: h-full flex flex-col żeby zająć 100% wysokości prawej kolumny AdminLayout */
    <div className="h-full w-full flex flex-col font-poppins text-slate-200">
      
      {/* HEADER - zajmuje tylko tyle miejsca ile potrzebuje */}
      <div className="flex flex-row items-center justify-between gap-4 mb-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/20">
            <Server size={24} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">{serverData.hostname}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {serverData.state}
              </span>
            </div>
            <p className="text-slate-400 flex items-center gap-1.5 mt-0.5 text-xs">
              <Globe size={12} /> {serverData.ip_address} • {serverData.os}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-lg bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition">
            <Power size={14} className="text-rose-500" /> Reboot
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-500 transition shadow-md shadow-violet-600/20">
            <Settings size={14} /> Manage
          </button>
        </div>
      </div>

      {/* GŁÓWNA SIATKA - flex-1 każe jej wypełnić resztę ekranu w dół, min-h-0 pozwala uniknąć scrolla */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-4 min-h-0">
        
        {/* LEWA KOLUMNA: Informacje (stała szerokość na dużych ekranach) */}
        <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
          
          {/* Identity & System */}
          <div className="rounded-2xl bg-slate-800/40 p-5 shrink-0">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <ShieldCheck size={16} className="text-violet-400" /> Identity & System
            </h3>
            <div className="space-y-3.5 text-xs">
              <InfoRow label="MAC Address" value={serverData.mac_address} />
              <InfoRow label="Kernel" value={serverData.kernel} />
              <InfoRow label="Agent Token" value={serverData.token.substring(0, 12) + "..."} isSecret />
              <InfoRow label="Last Seen" value={serverData.last_seen} />
              <InfoRow label="Boot Time" value={serverData.boot_time} />
            </div>
          </div>

          {/* Hardware Specs */}
          <div className="rounded-2xl bg-slate-800/40 p-5 shrink-0">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Cpu size={16} className="text-fuchsia-400" /> Hardware Specs
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <StatBox icon={Cpu} label="CPU Cores" value={`${serverData.hardware.cpu_cores} vCPU`} color="text-sky-400" />
              <StatBox icon={MemoryStick} label="RAM" value={`${(serverData.hardware.total_ram_mb / 1024).toFixed(0)} GB`} color="text-fuchsia-400" />
              <StatBox icon={HardDrive} label="Storage" value={`${serverData.hardware.total_disk_gb} GB`} color="text-emerald-400" />
              <StatBox icon={Network} label="Network" value="1 Gbps" color="text-violet-400" />
            </div>
          </div>
        </div>

        {/* PRAWA KOLUMNA: Karty z użyciem, Wykres i Logi */}
        <div className="flex flex-col gap-4 min-h-0">
          
          {/* 4 Karty z Górnymi Statystykami */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 shrink-0">
            <UsageCard title="CPU Usage" value={serverData.live_stats.cpu_usage} suffix="%" trend="+2.4%" />
            <UsageCard title="RAM Usage" value={serverData.live_stats.ram_usage} suffix="%" trend="+0.8%" />
            <UsageCard title="Disk I/O" value={serverData.live_stats.disk_usage} suffix="%" trend="-1.2%" />
            <div className="rounded-2xl bg-[#1e2333]/60 p-4 border border-violet-500/10 flex flex-col justify-between">
               <p className="text-xs text-slate-400 font-medium">Network Traffic</p>
               <div className="flex justify-between items-end mt-1">
                 <div>
                   <p className="text-emerald-400 text-[10px]">↓ {(serverData.live_stats.net_in_kbps / 1024).toFixed(1)} MB/s</p>
                   <p className="text-sky-400 text-[10px] mt-0.5">↑ {(serverData.live_stats.net_out_kbps / 1024).toFixed(1)} MB/s</p>
                 </div>
                 <Activity size={20} className="text-violet-400/50" />
               </div>
            </div>
          </div>

          {/* Performance Chart - Dynamiczna wysokość zależna od ekranu */}
          <div className="rounded-2xl bg-slate-800/40 p-4 flex flex-col shrink-0 h-[220px]">
            <h3 className="text-sm font-semibold text-white mb-2">Resource Utilization (Live)</h3>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorRam" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d946ef" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#d946ef" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', fontSize: '12px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="cpu" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorCpu)" />
                  <Area type="monotone" dataKey="ram" stroke="#d946ef" strokeWidth={2} fillOpacity={1} fill="url(#colorRam)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Active Services & Logs - Wypełnia całą resztę miejsca (flex-1) */}
          <div className="rounded-2xl bg-slate-800/40 flex flex-col flex-1 min-h-0 overflow-hidden">
            <div className="flex border-b border-slate-700/50 shrink-0">
              <button 
                onClick={() => setActiveTab('services')}
                className={`flex-1 py-3 text-xs font-semibold transition ${activeTab === 'services' ? 'bg-slate-700/30 text-white border-b-2 border-violet-500' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Local Services
              </button>
              <button 
                onClick={() => setActiveTab('logs')}
                className={`flex-1 py-3 text-xs font-semibold transition ${activeTab === 'logs' ? 'bg-slate-700/30 text-white border-b-2 border-violet-500' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <span className="flex items-center justify-center gap-1.5"><TerminalSquare size={14}/> Live Logs</span>
              </button>
            </div>

            {/* Kontener na zawartość tabów - sam się scrolluje jeśli zawartość jest za długa, ale nie powiększa całego okna */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
              {activeTab === 'services' && (
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-700/50">
                      <th className="pb-2 font-medium">Service Name</th>
                      <th className="pb-2 font-medium">Domain</th>
                      <th className="pb-2 font-medium">Ports</th>
                      <th className="pb-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {servicesData.map((svc, i) => (
                      <tr key={i} className="border-b border-slate-700/30 last:border-0">
                        <td className="py-3 font-medium text-slate-200">{svc.name}</td>
                        <td className="py-3 text-violet-400">{svc.domain}</td>
                        <td className="py-3 text-slate-400 font-mono">{svc.port}</td>
                        <td className="py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium ${
                            svc.status === 'running' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                          }`}>
                            <span className={`h-1 w-1 rounded-full ${svc.status === 'running' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                            {svc.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === 'logs' && (
                <div className="font-mono text-[11px] leading-relaxed text-slate-300">
                  <p><span className="text-emerald-400">[10:15:22]</span> systemd: Started Nginx Proxy Manager.</p>
                  <p><span className="text-emerald-400">[10:15:23]</span> kernel: [ 102.341] eth0: link up, 1000Mbps, full-duplex</p>
                  <p><span className="text-emerald-400">[10:15:24]</span> ufw: Blocked incoming connection from 192.168.1.55 on port 22</p>
                  <p><span className="text-yellow-400">[10:15:45]</span> [WARN] Agent heartbeat delayed by 2 seconds.</p>
                  <p><span className="text-emerald-400">[10:16:01]</span> postgres: database system is ready to accept connections.</p>
                  <p><span className="text-emerald-400">[10:18:10]</span> docker: Container 8f23bc started successfully.</p>
                  <p className="animate-pulse text-slate-500 mt-2">_</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// --- Komponenty Pomocnicze ---
const InfoRow = ({ label, value, isSecret }) => (
  <div className="flex justify-between items-center py-1.5 border-b border-slate-700/30 last:border-0">
    <span className="text-slate-400">{label}</span>
    <span className={`font-medium ${isSecret ? 'font-mono text-fuchsia-400' : 'text-slate-200'}`}>
      {value}
    </span>
  </div>
);

const StatBox = ({ icon: Icon, label, value, color }) => (
  <div className="bg-slate-900/30 rounded-xl p-3 border border-slate-700/30 flex flex-col items-center justify-center text-center">
    <Icon className={`mb-1.5 ${color}`} size={18} />
    <p className="text-[10px] text-slate-400 mb-0.5">{label}</p>
    <p className="font-semibold text-slate-200 text-sm">{value}</p>
  </div>
);

const UsageCard = ({ title, value, suffix, trend }) => {
  const isHigh = value > 80;
  return (
    <div className="rounded-2xl bg-slate-800/40 p-4 relative overflow-hidden flex flex-col justify-between">
      <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r ${isHigh ? 'from-rose-500 to-red-500' : 'from-violet-500 to-fuchsia-500'}`} style={{ width: `${value}%` }} />
      <p className="text-xs text-slate-400 font-medium">{title}</p>
      <div className="mt-1 flex items-baseline gap-1.5">
        <h4 className={`text-2xl font-bold ${isHigh ? 'text-rose-400' : 'text-white'}`}>{value}</h4>
        <span className="text-slate-400 font-medium text-xs mb-0.5">{suffix}</span>
      </div>
      <p className="text-[10px] text-emerald-400 mt-1">{trend} vs last hour</p>
    </div>
  );
};

export default ServerDetails;
