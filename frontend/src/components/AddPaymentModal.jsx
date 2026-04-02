import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AddPaymentModal = ({ isOpen, onClose, activeCoopId, onPaymentAdded }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0], // Default to today
    description: ''
  });

 
  const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Use a promise-based toast for better UX
  const savingPromise = api.post('/contributions', { ...formData, cooperativeId: activeCoopId });

  toast.promise(savingPromise, {
    loading: 'Recording payment...',
    success: (res) => {
      onPaymentAdded(res.data);
      onClose();
      return 'Payment saved successfully! 💰';
    },
    error: (err) => err.response?.data?.message || 'Could not save payment',
  });
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-bloom-brown-dark/40 backdrop-blur-[2px]">
      {/* Clickable Backdrop */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Slide-up Content */}
      <div className="relative w-full max-w-md bg-white rounded-t-[3rem] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-bloom-brown-dark">Add Contribution</h2>
          <button onClick={onClose} className="p-2 bg-bloom-sand rounded-full text-bloom-brown active:scale-90 transition-transform">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6 pb-[env(safe-area-inset-bottom)]">
          {/* Amount Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-bloom-brown/60 ml-1">Amount Paid</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-bloom-brown-dark text-lg">₦</span>
              <input 
                type="number" 
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className="w-full bg-bloom-sand/30 border-none py-5 pl-10 pr-4 rounded-2xl text-xl font-bold focus:ring-2 focus:ring-bloom-brown/20 outline-none transition-all placeholder:text-bloom-brown/20"
                required
              />
            </div>
          </div>

          {/* Date Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-bloom-brown/60 ml-1">Payment Date</label>
            <input 
              type="date" 
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full bg-bloom-sand/30 border-none py-4 px-4 rounded-2xl font-semibold text-bloom-brown-dark focus:ring-2 focus:ring-bloom-brown/20 outline-none"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-bloom-brown/60 ml-1">Description / Note</label>
            <textarea 
              placeholder="e.g. Mid-month meeting contribution"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-bloom-sand/30 border-none py-4 px-4 rounded-2xl font-medium focus:ring-2 focus:ring-bloom-brown/20 outline-none h-24 resize-none placeholder:text-bloom-brown/30"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-bloom-brown hover:bg-bloom-brown-dark text-white py-5 rounded-2xl font-bold shadow-lg shadow-bloom-brown/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Saving...</span>
              </>
            ) : (
              "Confirm & Save"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPaymentModal;