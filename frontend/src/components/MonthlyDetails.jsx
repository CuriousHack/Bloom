import React from 'react';
import { X, Calendar, ArrowRight, Info } from 'lucide-react';

const MonthlyDetail = ({ isOpen, onClose, monthData }) => {
  if (!isOpen || !monthData) return null;

  return (
    <div className="fixed inset-0 z-50 bg-bloom-cream flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="bg-bloom-brown p-8 rounded-b-[3rem] shadow-lg relative">
        <button 
          onClick={onClose}
          className="absolute top-6 left-6 p-2 bg-white/10 rounded-full text-white active:scale-90"
        >
          <X size={20} />
        </button>
        
        <div className="text-center mt-4">
          <h2 className="text-bloom-cream/60 text-xs uppercase tracking-widest font-bold">
            Total for {monthData.month}
          </h2>
          <p className="text-4xl font-bold text-white mt-2">
            ₦{monthData.total.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Transactions List */}
      <main className="flex-1 px-6 pt-10 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-bloom-brown-dark text-base">Transactions</h3>
          <span className="bg-bloom-sand px-3 py-1 rounded-full text-bloom-brown text-xs font-bold">
            {monthData.payments.length} Records
          </span>
        </div>

        <div className="space-y-4 pb-10">
          {monthData.payments.map((payment, index) => (
            <div 
              key={index}
              className="bg-white p-5 rounded-3xl border border-bloom-brown/5 shadow-sm flex items-start gap-4"
            >
              <div className="bg-bloom-sand w-12 h-12 rounded-2xl flex items-center justify-center shrink-0">
                <Calendar className="text-bloom-brown" size={20} />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-bloom-brown-dark">{payment.description || 'Meeting Contribution'}</p>
                    <p className="text-xs text-bloom-brown/50 font-medium">{payment.date}</p>
                  </div>
                  <p className="font-bold text-bloom-brown">₦{payment.amount.toLocaleString()}</p>
                </div>
                
                {/* Expandable/View Better Option */}
                <button className="mt-3 flex items-center gap-1 text-[10px] font-bold uppercase text-bloom-brown/40 hover:text-bloom-brown transition-colors">
                  <Info size={12} />
                  View Full Receipt
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MonthlyDetail;