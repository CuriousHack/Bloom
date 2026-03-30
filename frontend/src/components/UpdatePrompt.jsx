import React from 'react';
import { RefreshCw, X } from 'lucide-react';
import { useRegisterSW } from 'virtual:pwa-register/react';

const UpdatePrompt = () => {
  // needRefresh: True if a new version is found
  // updateServiceWorker: Function to skip waiting and install the new version
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered');
    },
    onRegisterError(error) {
      console.error('SW registration error', error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (!needRefresh && !offlineReady) return null;

  return (
    <div className="fixed bottom-24 left-6 right-6 z-[100] animate-in slide-in-from-bottom-10 duration-500">
      <div className="bg-bloom-brown-dark text-bloom-cream p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-white/10 backdrop-blur-lg">
        <div className="flex items-center gap-3">
          <div className="bg-bloom-cream/20 p-2 rounded-xl">
            <RefreshCw size={20} className={needRefresh ? "animate-spin-slow" : ""} />
          </div>
          <div>
            <p className="text-sm font-bold">
              {needRefresh ? "New Update Available!" : "Ready to work offline"}
            </p>
            <p className="text-[10px] opacity-60 uppercase tracking-wider font-bold">
              {needRefresh ? "Click to refresh Bloom" : "App is cached and ready"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {needRefresh && (
            <button
              onClick={() => updateServiceWorker(true)}
              className="bg-bloom-cream text-bloom-brown-dark px-4 py-2 rounded-xl text-xs font-black uppercase active:scale-95 transition-all"
            >
              Update
            </button>
          )}
          <button onClick={close} className="p-2 opacity-40 hover:opacity-100">
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdatePrompt;