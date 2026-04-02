import React from 'react';
import { X, Check, PlusCircle } from 'lucide-react';

  const CoopSwitcher = ({ isOpen, onClose, groups, activeId, onSelect, openCreateModal }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-bloom-brown-dark/50 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose}></div>
      
      <div className="relative w-full max-w-md bg-bloom-cream rounded-t-[3rem] p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-bloom-brown-dark">Your Groups</h2>
          <button onClick={onClose} className="p-2 bg-bloom-sand rounded-full text-bloom-brown"><X size={20} /></button>
        </div>

        <div className="space-y-3 mb-8">
          {groups.map((group) => (
            <button
              key={group.id}
              onClick={() => { onSelect(group); onClose(); }}
              className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${
                activeId === group.id 
                ? 'border-bloom-brown bg-white shadow-md' 
                : 'border-transparent bg-bloom-sand/50 text-bloom-brown/60'
              }`}
            >
              <span className="font-bold text-base">{group.name}</span>
              {activeId === group.id && <Check size={20} className="text-bloom-brown" />}
            </button>
          ))}

          <button 
            onClick={() => {
                onClose();      // Close the switcher
                openCreateModal(); // Open the create group modal
                
            }}
            className="w-full flex items-center justify-center gap-2 p-5 rounded-2xl border-2 border-dashed border-bloom-brown/30 text-bloom-brown font-bold mt-4"
            >
            <PlusCircle size={20} />
            Create New Group
            </button>
        </div>
      </div>
    </div>
  );
};

export default CoopSwitcher;


