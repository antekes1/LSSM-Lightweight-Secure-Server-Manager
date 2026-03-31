import React, { createContext, useContext, useState } from 'react';
import { XIcon, CheckCircle2, AlertCircle, Info } from 'lucide-react';

// Tworzymy Context
const ToastContext = createContext();

// Hook do łatwego użycia w komponentach
export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    show: false,
    title: '',
    body: '',
    type: 'info'
  });

  const showToast = (title, body, type = 'info') => {
    setToast({ show: true, title, body, type });

    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  const closeToast = () => setToast(prev => ({ ...prev, show: false }));

  const iconMap = {
    success: <CheckCircle2 className="text-emerald-500 mr-2" size={20} />,
    error: <AlertCircle className="text-rose-500 mr-2" size={20} />,
    info: <Info className="text-violet-500 mr-2" size={20} />
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {toast.show && (
        <div className="fixed bottom-5 right-5 z-[9999] w-80 md:w-96 rounded-2xl bg-white dark:bg-slate-800 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.2)] border border-slate-200 dark:border-slate-700 transition-all animate-in slide-in-from-bottom-5">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
            <div className="flex items-center">
              {iconMap[toast.type]}
              <strong className="text-slate-800 dark:text-white font-semibold text-sm">
                {toast.title}
              </strong>
            </div>
            <button
              onClick={closeToast}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
              aria-label="Close"
            >
              <XIcon size={18} />
            </button>
          </div>
          <div className="pt-3 text-sm text-slate-600 dark:text-slate-300">
            {toast.body}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};
