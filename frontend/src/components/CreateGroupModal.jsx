import React, { useState } from 'react';
import { X, Users } from 'lucide-react';
import api from '../api/axios';

const CreateGroupModal = ({ isOpen, onClose, onGroupCreated }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/cooperatives', { name });
      onGroupCreated(res.data); // Update the dashboard with the new group
      onClose();
    } catch (err) {
      alert("Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-bloom-brown-dark/40 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-white rounded-t-[3rem] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-bloom-brown-dark">Create New Group</h2>
          <button onClick={onClose} className="p-2 bg-bloom-sand rounded-full text-bloom-brown"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-bloom-brown/60 ml-1">Group Name</label>
            <div className="relative">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-bloom-brown/40" size={20} />
              <input 
                type="text" 
                placeholder="e.g. Wednesday Savings Club"
                className="w-full bg-bloom-sand/30 border-none py-5 pl-12 pr-4 rounded-2xl font-bold focus:ring-2 focus:ring-bloom-brown/20 outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-bloom-brown text-white py-5 rounded-2xl font-bold shadow-lg active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Start Group'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;