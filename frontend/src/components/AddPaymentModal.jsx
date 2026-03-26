import React from 'react';
import { X } from 'lucide-react'; // Use any currency icon if Naira isn't available

const AddPaymentModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-bloom-brown-dark/40 backdrop-blur-[2px]">
      {/* Clickable Backdrop to close */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Slide-up Content */}
      <div className="relative w-full max-w-md bg-white rounded-t-[3rem] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-bloom-brown-dark">New Payment</h2>
          <button onClick={onClose} className="p-2 bg-bloom-sand rounded-full text-bloom-brown">
            <X size={20} />
          </button>
        </div>

        <form className="space-y-6">
          {/* Amount Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-bloom-brown/60 ml-1">Amount Paid</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-bloom-brown-dark">₦</span>
              <input 
                type="number" 
                placeholder="0.00"
                className="w-full bg-bloom-sand/30 border-none py-5 pl-10 pr-4 rounded-2xl text-xl font-bold focus:ring-2 focus:ring-bloom-brown/20 outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Date Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-bloom-brown/60 ml-1">Date of Meeting</label>
            <input 
              type="date" 
              className="w-full bg-bloom-sand/30 border-none py-4 px-4 rounded-2xl font-medium focus:ring-2 focus:ring-bloom-brown/20 outline-none"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-bloom-brown/60 ml-1">Description</label>
            <textarea 
              placeholder="e.g. Mid-month contribution"
              className="w-full bg-bloom-sand/30 border-none py-4 px-4 rounded-2xl font-medium focus:ring-2 focus:ring-bloom-brown/20 outline-none h-24 resize-none"
            ></textarea>
          </div>

          {/* Submit */}
          <button 
            type="submit"
            className="w-full bg-bloom-brown text-white py-5 rounded-2xl font-bold shadow-lg shadow-bloom-brown/20 active:scale-[0.98] transition-all"
          >
            Confirm & Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPaymentModal;