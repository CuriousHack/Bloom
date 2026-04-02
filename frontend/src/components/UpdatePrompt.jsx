import React from 'react';
import { RefreshCw, X } from 'lucide-react';
import { useRegisterSW } from 'virtual:pwa-register/react';

const UpdatePrompt = () => {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('Bloom PWA Active');
    },
  });

  const close = () => setNeedRefresh(false);

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-24 left-6 right-6 z-[100] animate-in fade-in slide-in-from-bottom-10">
      <div className="bg-bloom-brown-dark text-bloom-cream p-4 rounded-[2rem] shadow-2xl flex items-center justify-between border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="bg-bloom-cream/20 p-2 rounded-xl">
            <RefreshCw size={20} className="animate-spin-slow" />
          </div>
          <div>
            <p className="text-xs font-bold">New Version Available</p>
            <p className="text-[10px] opacity-60 uppercase font-bold">Update Bloom now</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => updateServiceWorker(true)}
            className="bg-bloom-cream text-bloom-brown-dark px-4 py-2 rounded-xl text-[10px] font-bold uppercase"
          >
            Update
          </button>
          <button onClick={close} className="p-2 opacity-40">
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdatePrompt;