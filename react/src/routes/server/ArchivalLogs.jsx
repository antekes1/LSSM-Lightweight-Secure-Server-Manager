import React, { useState } from 'react';
import { Archive, FileText, Download, Trash2, Search, Calendar, HardDrive } from 'lucide-react';

const mockLogs = [
  { id: 1, name: 'syslog-2026-03-01.gz', size: '14.2 MB', date: 'Mar 1, 2026', type: 'archive' },
  { id: 2, name: 'syslog-2026-03-02.gz', size: '12.8 MB', date: 'Mar 2, 2026', type: 'archive' },
  { id: 3, name: 'nginx-access-03.log', size: '4.1 MB', date: 'Mar 3, 2026', type: 'text' },
  { id: 4, name: 'postgresql-03.log', size: '8.5 MB', date: 'Mar 3, 2026', type: 'text' },
  { id: 5, name: 'docker-daemon.log', size: '1.2 MB', date: 'Mar 4, 2026', type: 'text' },
];

const LogsArchive = () => {
  const [selectedLog, setSelectedLog] = useState(mockLogs[2]);

  return (
    <div className="h-full w-full flex flex-col font-poppins text-slate-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shrink-0">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
            <Archive size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Logs Archive</h1>
            <p className="text-slate-400 text-xs mt-0.5">Browse and download historical server logs.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-2 w-full md:w-64">
          <Search size={16} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search logs..." 
            className="bg-transparent text-sm text-white w-full outline-none placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-4 min-h-0">
        
        {/* Lewa: Lista Plików */}
        <div className="rounded-2xl bg-slate-800/40 border border-slate-700/30 flex flex-col overflow-hidden min-h-0">
          <div className="p-4 border-b border-slate-700/50 flex items-center justify-between shrink-0 bg-slate-800/50">
            <h3 className="text-sm font-semibold text-white">Archived Files</h3>
            <span className="text-xs text-slate-400 bg-slate-900/50 px-2 py-1 rounded-md">Total: 40.8 MB</span>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            <div className="space-y-1">
              {mockLogs.map((file) => (
                <div 
                  key={file.id}
                  onClick={() => setSelectedLog(file)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition ${
                    selectedLog.id === file.id ? 'bg-violet-500/10 border border-violet-500/30' : 'hover:bg-slate-700/30 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${file.type === 'archive' ? 'bg-rose-500/10 text-rose-400' : 'bg-sky-500/10 text-sky-400'}`}>
                      <FileText size={18} />
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${selectedLog.id === file.id ? 'text-violet-300' : 'text-slate-200'}`}>{file.name}</p>
                      <p className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <Calendar size={10} /> {file.date} • <HardDrive size={10} /> {file.size}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Prawa: Podgląd logów */}
        <div className="rounded-2xl bg-[#0d1117] border border-slate-700/50 flex flex-col min-h-0 overflow-hidden">
          <div className="p-4 border-b border-slate-700/50 flex items-center justify-between shrink-0 bg-slate-800/80">
            <div>
              <h3 className="text-sm font-semibold text-white">{selectedLog.name}</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Viewing top 100 lines</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg bg-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-600 transition">
                <Download size={16} />
              </button>
              <button className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition">
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {selectedLog.type === 'archive' ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 text-center">
              <Archive size={48} className="mb-4 text-slate-600" />
              <p className="text-sm">This is a compressed gzip archive.</p>
              <p className="text-xs mt-2">Download the file to extract and read its contents.</p>
              <button className="mt-4 px-4 py-2 rounded-lg bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition flex items-center gap-2">
                <Download size={14}/> Download Archive
              </button>
            </div>
          ) : (
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar font-mono text-[11px] leading-relaxed text-slate-300">
              <p><span className="text-slate-500">1</span> <span className="text-sky-400">INFO</span>  [08:00:01] Starting request process for /api/v1/users</p>
              <p><span className="text-slate-500">2</span> <span className="text-sky-400">INFO</span>  [08:00:02] Connected to database instance local_db_01</p>
              <p><span className="text-slate-500">3</span> <span className="text-yellow-400">WARN</span>  [08:00:45] Slow query detected on users table (1500ms)</p>
              <p><span className="text-slate-500">4</span> <span className="text-rose-400">ERROR</span> [08:01:10] Connection timeout to Redis cache server</p>
              <p><span className="text-slate-500">5</span> <span className="text-sky-400">INFO</span>  [08:01:15] Retry attempt 1/3 successful.</p>
              <p><span className="text-slate-500">6</span> <span className="text-sky-400">INFO</span>  [08:05:00] CRON job 'cleanup_temp_files' started</p>
              <p><span className="text-slate-500">7</span> <span className="text-sky-400">INFO</span>  [08:05:02] Deleted 145 temporary files from /var/tmp</p>
              {/* Miejsce na więcej tekstu */}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default LogsArchive;
