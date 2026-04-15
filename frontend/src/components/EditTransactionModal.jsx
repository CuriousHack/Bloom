import React, { useState, useEffect } from 'react';
import { Wallet, Trash2 } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const EditTransactionModal = ({ isOpen, onClose, transaction, onUpdateSuccess }) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (transaction) {
      setAmount(transaction.amount);
      setDescription(transaction.description || "");
      setDate(new Date(transaction.date).toISOString().split('T')[0]);
    }
  }, [transaction]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/contributions/${transaction._id}`, { amount, description, date });
      onUpdateSuccess(res.data);
      onClose();
      toast.success("Payment updated! ✨");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center">
      <div className="absolute inset-0 bg-bloom-brown-dark/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-lg rounded-t-[3.5rem] p-10 pb-[calc(env(safe-area-inset-bottom)+2rem)] animate-in slide-in-from-bottom duration-300">
        <div className="w-12 h-1.5 bg-bloom-sand/50 rounded-full mx-auto mb-8" />
        <h3 className="text-xl font-bold text-bloom-brown-dark mb-6">Edit Payment</h3>
        
        <form onSubmit={handleUpdate} className="space-y-4">
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-bloom-cream/50 p-5 rounded-2xl font-black text-2xl outline-none"
          />
          <input 
            type="text" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-bloom-cream/20 p-4 rounded-2xl outline-none font-medium text-sm"
          />
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-bloom-cream/20 p-4 rounded-2xl outline-none font-medium text-sm"
          />
          <button type="submit" className="w-full bg-bloom-brown text-white py-5 rounded-[2rem] font-bold shadow-xl">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditTransactionModal;