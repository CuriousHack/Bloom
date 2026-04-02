import React, { useState } from 'react';
import { X, Users, Sparkles } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const CreateGroupModal = ({ isOpen, onClose, onGroupCreated }) => {
  const [groupName, setGroupName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    setIsSubmitting(true);
    const loadingToast = toast.loading("Planting your new society...");

    try {
      const res = await api.post('/cooperatives', { name: groupName });
      
      // Notify parent to update the list
      onGroupCreated(res.data);
      
      toast.success(`${groupName} is now live! 🌿`, { id: loadingToast });
      setGroupName("");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create group", { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-bloom-brown-dark/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Slide-up Sheet */}
      <div className="relative bg-white w-full max-w-lg rounded-t-[3.5rem] p-10 pb-[calc(env(safe-area-inset-bottom)+2rem)] animate-in slide-in-from-bottom duration-500 shadow-2xl">
        {/* Handle bar for visual cue */}
        <div className="w-12 h-1.5 bg-bloom-sand/50 rounded-full mx-auto mb-8" />
        
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-bloom-sand/20 rounded-xl text-bloom-brown">
            <Users size={20} />
          </div>
          <h3 className="text-2xl font-bold text-bloom-brown-dark">New Society</h3>
        </div>
        
        <p className="text-sm text-bloom-brown/40 mb-8 font-medium">
          Start a new savings journey. What's the name of this group?
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-bloom-cream/50 p-4 rounded-2xl border border-bloom-brown/5">
            <input 
              type="text"
              required
              autoFocus
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="bg-transparent w-full outline-none text-bloom-brown-dark font-semibold text-base placeholder:text-bloom-brown/20"
              placeholder="e.g. December Vacation ✈️"
              disabled={isSubmitting}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting || !groupName.trim()}
            className="w-full bg-bloom-brown text-white py-5 rounded-[2rem] font-bold shadow-xl active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? "Creating..." : (
              <>
                <Sparkles size={18} />
                Create Society
              </>
            )}
          </button>
          
          <button 
            type="button"
            onClick={onClose}
            className="w-full text-center text-[10px] text-bloom-brown/30 font-bold uppercase tracking-widest pt-2"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;