import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, MessageCircle, Gift, BarChart3, Check, Trash2, X } from 'lucide-react';
import API_BASE_URL from "../../settings.jsx"; // Ścieżka importu (upewnij się, że jest poprawna)

const USER_TOKEN = localStorage.getItem("token");

// Przycisk z powiadomieniem
const IconBadge = ({ icon: Icon, count, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 text-slate-600 shadow transition hover:bg-white hover:text-violet-600"
    >
      <Icon size={18} />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-violet-700 px-1.5 text-[10px] font-bold text-white shadow-sm ring-2 ring-[#eef1f5] dark:ring-slate-800">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
};

const Topbar = ({ alerts = [], refreshAlerts }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = alerts.filter((a) => !a.is_read).length;

  // Zamknięcie modala po kliknięciu poza niego
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Funkcja oznaczająca alert jako przeczytany i wysyłająca request do API
  const markAsRead = async (alertId) => {
    try {
      await fetch(`${API_BASE_URL}/core-api/mark_alert_read`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: USER_TOKEN, alert_id: alertId })
      });
      // Odśwież dane nadrzędne
      if (refreshAlerts) refreshAlerts();
    } catch (error) {
      console.error("Nie udało się zaktualizować statusu alertu:", error);
    }
  };

  return (
    <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between z-40">
      <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Dashboard</h2>

      <div className="flex flex-wrap items-center gap-3">
        
        {/* Wyszukiwarka */}
        <div className="flex min-w-[220px] items-center gap-2 rounded-2xl bg-white/80 dark:bg-slate-800/80 px-4 py-3 shadow transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-violet-500/50">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search here..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400 text-slate-700 dark:text-slate-200"
          />
        </div>

        {/* Kontener na ikonki */}
        <div className="flex items-center gap-3 relative">
          <IconBadge icon={Gift} count={0} />
          
          {/* Kontener Dzwoneczka z refem */}
          <div ref={dropdownRef} className="relative">
            <IconBadge 
              icon={Bell} 
              count={unreadCount} 
              onClick={() => setShowDropdown(!showDropdown)} 
            />

            {/* Powiadomienia Modal / Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 top-14 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-800 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-slate-100 dark:border-slate-700 z-50 origin-top-right transition-all animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3 mb-3">
                  <h3 className="font-bold text-slate-800 dark:text-white">Notifications</h3>
                  <button 
                    onClick={() => setShowDropdown(false)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto custom-scrollbar pr-1">
                  {alerts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 text-slate-400">
                      <Bell size={24} className="mb-2 opacity-50" />
                      <p className="text-sm">You have no notifications.</p>
                    </div>
                  ) : (
                    alerts.map((alert) => (
                      <div 
                        key={alert.id} 
                        className={`relative rounded-xl p-3 border transition-colors ${
                          alert.is_read 
                            ? 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 opacity-70' 
                            : 'bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/30'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            alert.alert_type === 'ERROR' ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400' : 
                            alert.alert_type === 'WARN' ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400' :
                            'bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400'
                          }`}>
                            {alert.alert_type}
                          </span>
                          <span className="text-[10px] font-medium text-slate-400">
                            {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300 mt-1.5 pr-6 leading-relaxed">
                          {alert.message}
                        </p>
                        
                        {!alert.is_read && (
                          <button 
                            onClick={() => markAsRead(alert.id)} 
                            className="absolute right-2 bottom-2 p-1.5 text-violet-500 hover:bg-violet-200 dark:hover:bg-violet-500/20 rounded-lg transition"
                            title="Mark as read"
                          >
                            <Check size={14} />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          
          <IconBadge icon={MessageCircle} count={0} />
        </div>

        {/* Przycisk akcji */}
        <button className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow transition hover:scale-105 hover:shadow-lg hover:shadow-violet-500/30">
          Generate Report
          <BarChart3 size={18} />
        </button>
      </div>
    </div>
  );
};

export default Topbar;