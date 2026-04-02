import React, { useState } from 'react';
import { Wallet, X, Banknote, Calendar as CalIcon } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AddPaymentModal = ({ isOpen, onClose, selectedGroup, onPaymentSuccess }) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) return toast.error("Enter a valid amount");

    setIsSubmitting(true);
    const loadingToast = toast.loading("Recording your contribution...");

    try {
      const res = await api.post('/contributions', {
        cooperativeId: selectedGroup._id,
        amount: Number(amount),
        description: description || `Monthly contribution to ${selectedGroup.name}`,
        date: new Date()
      });

      toast.success("Payment Recorded! 💰", { id: loadingToast });
      
      // Trigger refresh in the parent Dashboard
      onPaymentSuccess(res.data); 
      
      // Reset and close
      setAmount("");
      setDescription("");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment failed", { id: loadingToast });
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
        <div className="w-12 h-1.5 bg-bloom-sand/50 rounded-full mx-auto mb-8" />
        
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-green-100 rounded-xl text-green-700">
            <Wallet size={20} />
          </div>
          <h3 className="text-2xl font-black text-bloom-brown-dark">Add Payment</h3>
        </div>
        
        <p className="text-sm text-bloom-brown/40 mb-8 font-medium">
          Contributing to <span className="text-bloom-brown font-bold">{selectedGroup?.name}</span>
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount Input */}
          <div className="bg-bloom-cream/50 p-5 rounded-2xl border border-bloom-brown/10 flex items-center gap-4">
            <span className="text-2xl font-black text-bloom-brown/30">₦</span>
            <input 
              type="number"
              required
              autoFocus
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-transparent w-full outline-none text-bloom-brown-dark font-black text-2xl placeholder:text-bloom-brown/10"
              placeholder="0.00"
              disabled={isSubmitting}
            />
          </div>

          {/* Description Input */}
          <div className="bg-bloom-cream/20 p-4 rounded-2xl border border-bloom-brown/5 flex items-center gap-3">
            <Banknote size={18} className="text-bloom-brown/30" />
            <input 
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-transparent w-full outline-none text-bloom-brown-dark font-bold text-sm"
              placeholder="What is this for? (Optional)"
              disabled={isSubmitting}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting || !amount}
            className="w-full bg-bloom-brown text-white py-5 rounded-[2rem] font-black shadow-xl active:scale-95 disabled:opacity-50 transition-all mt-4"
          >
            {isSubmitting ? "Processing..." : "Confirm Payment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPaymentModal;