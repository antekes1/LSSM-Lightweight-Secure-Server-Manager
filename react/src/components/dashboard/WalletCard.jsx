import React, { useState } from 'react';
import { RotateCw, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from "../../settings.jsx"
import { useToast } from "../../contexts/ToastContext"

const WalletCard = ({ servers = [], refreshServers }) => {
  const navigate = useNavigate();
  const [wakingId, setWakingId] = useState(null);

  const { showToast } = useToast();

  const handleWakeServer = async (serverId, e) => {
    e.stopPropagation(); 
    setWakingId(serverId);
    
    try {
      const response = await fetch(`${API_BASE_URL}/server-api/wake_server/${serverId}`);
      const data = await response.json();
      
      if (response.ok) {
        showToast("Server Wake", `Status: ${data.status}`, "success");
        if(refreshServers) refreshServers(); 
      } else {
        showToast("Error", data.detail || "Nie udało się wybudzić serwera", "error");
      }
    } catch (error) {
      console.error("Error waking server:", error);
      showToast("Network Error", "Wystąpił problem z połączeniem", "error");
    } finally {
      setWakingId(null);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-600 p-6 text-white shadow-lg min-h-[350px]">
      <div className="absolute left-6 top-6 flex gap-2 opacity-40">
        <div className="h-10 w-10 rounded-full bg-white" />
        <div className="-ml-4 h-10 w-10 rounded-full bg-white" />
        <h1 className='flex self-center text-2xl text-white ml-2'>Servers List:</h1>
      </div>

      <div className="pt-20 space-y-3 h-full overflow-y-auto max-h-[400px] custom-scrollbar pr-2">
        {servers.length === 0 ? (
          <p className="text-slate-300 text-center mt-10">Brak serwerów do wyświetlenia.</p>
        ) : (
          servers.map((server) => (
            <div key={server.id} className='flex flex-row items-center gap-3'>
              
              {/* Przycisk przejścia do szczegółów */}
              <button 
                onClick={() => navigate(`/server/${server.id}`)} 
                className='flex-1 border border-white/20 bg-white/5 hover:bg-white/10 transition rounded-2xl px-4 py-3 flex justify-between items-center'
              >
                <div className="flex flex-col items-start">
                  <span className="font-semibold">{server.hostname || `Server #${server.id}`}</span>
                  <span className="text-xs text-white/60">{server.ip_address}</span>
                </div>
                
                {/* Status Badge */}
                <div className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 border ${
                  server.state === 'online' ? 'bg-emerald-500/20 border-emerald-500/30' : 
                  server.state === 'booting' ? 'bg-yellow-500/20 border-yellow-500/30' :
                  'bg-rose-500/20 border-rose-500/30'
                }`}>
                  {server.state === 'online' ? <CheckCircle2 size={14} className="text-emerald-400" /> : 
                   server.state === 'booting' ? <Loader2 size={14} className="text-yellow-400 animate-spin" /> :
                   <XCircle size={14} className="text-rose-400" />}
                  <span className="text-xs font-medium capitalize text-white">{server.state}</span>
                </div>
              </button>

              {/* Przycisk Wake On LAN */}
              <button 
                onClick={(e) => handleWakeServer(server.id, e)}
                disabled={server.state === 'online' || server.state === 'booting' || wakingId === server.id}
                className={`flex rounded-xl px-5 py-3 justify-center items-center font-medium transition-all ${
                  server.state === 'online' || server.state === 'booting'
                    ? 'bg-slate-800/30 text-slate-400 cursor-not-allowed'
                    : 'bg-white text-violet-800 hover:bg-slate-200 cursor-pointer shadow-lg'
                }`}
              >
                {wakingId === server.id ? <Loader2 size={18} className="animate-spin" /> : 'Wake'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WalletCard;
