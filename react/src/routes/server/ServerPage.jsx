import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Server, HardDrive, Cpu, MemoryStick, Activity, 
  TerminalSquare, Power, Settings, ShieldCheck, 
  Globe, Network, Loader2
} from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';

import API_BASE_URL from "../../settings.jsx";
import { useToast } from "../../contexts/ToastContext";

const USER_TOKEN = localStorage.getItem("token");

const ServerDetails = () => {
  const { id } = useParams();
  const { showToast } = useToast();
  
  const [activeTab, setActiveTab] = useState('logs');
  const [serverData, setServerData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Placeholder do wykresów (do momentu aż FastAPI nie wyśle prawdziwej historii np. poprzez websockets/influxdb)
  const chartData = [
    { time: '10:00', cpu: 30, ram: 60 },
    { time: '10:05', cpu: 45, ram: 62 },
    { time: '10:10', cpu: serverData?.cpu_usage || 0, ram: serverData?.ram_usage || 0 },
  ];

  // Placeholder serwisów
  const servicesData = [
    { name: 'Agent', port: '8000', domain: '-', status: serverData?.state === 'online' ? 'running' : 'stopped' }
  ];

  // ============================================
  // LOGIKA KOMUNIKACJI Z FASTAPI
  // ============================================
  const fetchServerDetails = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/server-api/view_server`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          token: USER_TOKEN,
          id: parseInt(id) 
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.server) {
        setServerData(data.server);
      } else {
        console.error("Server API Error:", data);
      }
    } catch (error) {
      console.error("Failed to fetch server details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let timeoutId;
    let isMounted = true;

    const pollServer = async () => {
      if (!isMounted) return;
      await fetchServerDetails();
      timeoutId = setTimeout(pollServer, 3000); // Polling co 3 sekundy
    };

    pollServer();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [id]);

  const handleReboot = async () => {
    // Jeżeli dodasz logikę rebootu do API, tu wywołaj strzał
    showToast("Reboot Requested", "Komenda reboot została wysłana do serwera", "info");
  };

  // ============================================
  // WYŚWIETLANIE EKRANU W TRAKCIE ŁADOWANIA
  // ============================================
  if (loading && !serverData) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="animate-spin text-violet-500" size={48} />
      </div>
    );
  }

  if (!serverData) {
    return <div className="p-8 text-rose-500 font-bold">Serwer nie został znaleziony!</div>;
  }

  // ============================================
  // GŁÓWNY WIDOK
  // ============================================
  return (
    <div className="h-full w-full flex flex-col font-poppins text-slate-200">
      
      <div className="flex flex-row items-center justify-between gap-4 mb-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/20">
            <Server size={24} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">{serverData.hostname || "Unknown Host"}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                 serverData.state === 'online' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                 serverData.state === 'booting' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 
                 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}>
                {serverData.state}
              </span>
            </div>
            <p className="text-slate-400 flex items-center gap-1.5 mt-0.5 text-xs">
              <Globe size={12} /> {serverData.ip_address} • {serverData.os || "Unknown OS"}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={handleReboot}
            className="flex items-center gap-2 rounded-lg bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition"
          >
            <Power size={14} className="text-rose-500" /> Reboot
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-500 transition shadow-md shadow-violet-600/20">
            <Settings size={14} /> Manage
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-4 min-h-0">
        
        <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
          <div className="rounded-2xl bg-slate-800/40 p-5 shrink-0">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <ShieldCheck size={16} className="text-violet-400" /> Identity & System
            </h3>
            <div className="space-y-3.5 text-xs">
              <InfoRow label="MAC Address" value={serverData.mac_address || "-"} />
              <InfoRow label="Kernel" value={serverData.kernel || "-"} />
              <InfoRow label="Agent Token" value={serverData.token ? serverData.token.substring(0, 12) + "..." : "-"} isSecret />
              <InfoRow label="Last Seen" value={serverData.last_seen ? new Date(serverData.last_seen).toLocaleString() : "Never"} />
              <InfoRow label="Boot Time" value={serverData.boot_time ? new Date(serverData.boot_time).toLocaleString() : "-"} />
            </div>
          </div>

          <div className="rounded-2xl bg-slate-800/40 p-5 shrink-0">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Cpu size={16} className="text-fuchsia-400" /> Hardware Specs
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <StatBox icon={Cpu} label="CPU Cores" value={`${serverData.cpu_cores || 0} vCPU`} color="text-sky-400" />
              <StatBox icon={MemoryStick} label="RAM" value={`${serverData.total_ram_mb ? (serverData.total_ram_mb / 1024).toFixed(0) : 0} GB`} color="text-fuchsia-400" />
              <StatBox icon={HardDrive} label="Storage" value={`${serverData.total_disk_gb || 0} GB`} color="text-emerald-400" />
              <StatBox icon={Network} label="Network" value="1 Gbps" color="text-violet-400" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 min-h-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 shrink-0">
            <UsageCard title="CPU Usage" value={serverData.cpu_usage || 0} suffix="%" trend="LIVE" />
            <UsageCard title="RAM Usage" value={serverData.ram_usage || 0} suffix="%" trend="LIVE" />
            <UsageCard title="Disk I/O" value={serverData.disk_usage || 0} suffix="%" trend="LIVE" />
            <div className="rounded-2xl bg-[#1e2333]/60 p-4 border border-violet-500/10 flex flex-col justify-between">
               <p className="text-xs text-slate-400 font-medium">Network Traffic</p>
               <div className="flex justify-between items-end mt-1">
                 <div>
                   <p className="text-emerald-400 text-[10px]">↓ {serverData.net_in_kbps ? (serverData.net_in_kbps / 1024).toFixed(1) : 0} MB/s</p>
                   <p className="text-sky-400 text-[10px] mt-0.5">↑ {serverData.net_out_kbps ? (serverData.net_out_kbps / 1024).toFixed(1) : 0} MB/s</p>
                 </div>
                 <Activity size={20} className="text-violet-400/50" />
               </div>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-800/40 p-4 flex flex-col shrink-0 h-[220px]">
            <h3 className="text-sm font-semibold text-white mb-2">Resource Utilization</h3>
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
                  <p><span className="text-slate-500">Logi na żywo wymagają połączenia WebSocket z backendem...</span></p>
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
      <p className="text-[10px] text-emerald-400 mt-1">{trend}</p>
    </div>
  );
};

export default ServerDetails;
