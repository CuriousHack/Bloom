import React, { useState } from 'react';
import { Plus, Wallet, Calendar, ChevronRight, ChevronDown, LogOut } from 'lucide-react';
import AddPaymentModal from '../components/AddPaymentModal'; // Import the modal
import MonthlyDetail from '../components/MonthlyDetails';
import CoopSwitcher from '../components/CoopSwitcher';

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);


  //mocks
  const [selectedMonth, setSelectedMonth] = useState(null);

  const [activeCoop, setActiveCoop] = useState({ id: 1, name: 'Main Society' });
    const [showCoopSwitcher, setShowCoopSwitcher] = useState(false);

    const myCooperatives = [
    { id: 1, name: 'Main Society', balance: 83000 },
    { id: 2, name: 'Building Project', balance: 120000 },
    { id: 3, name: 'Holiday Fund', balance: 15000 }
    ];

// Mock Data Structure
    const monthlyHistory = [
    {
        month: 'March 2026',
        total: 45000,
        payments: [
        { amount: 20000, date: '2026-03-05', description: '1st Monthly Meeting' },
        { amount: 25000, date: '2026-03-19', description: '2nd Monthly Meeting + Levy' }
        ]
    },
    {
        month: 'February 2026',
        total: 30000,
        payments: [
        { amount: 15000, date: '2026-02-04', description: 'Regular Meeting' },
        { amount: 15000, date: '2026-02-18', description: 'Regular Meeting' }
        ]
    }
    ];


  return (
    <div className="min-h-screen bg-bloom-cream pb-24">
      {/* Header Card */}
      {/* <header className="bg-bloom-brown pt-16 pb-12 px-8 rounded-b-[3rem] shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <div className="w-10 h-10 bg-bloom-cream/20 rounded-xl flex items-center justify-center">
            <span className="text-bloom-cream font-serif italic font-bold">B</span>
          </div>
          <button className="text-bloom-cream/80 text-sm font-medium">Logout</button>
        </div>
        <p className="text-bloom-cream/60 text-xs uppercase tracking-[0.2em] font-bold">Total Contribution</p>
        <h2 className="text-4xl font-bold text-white mt-1">₦0.00</h2>
      </header> */}

      {/* Updated Header in Dashboard.jsx */}
        <header className="bg-bloom-brown pt-16 pb-12 px-8 rounded-b-[3rem] shadow-xl relative">
        <div className="flex justify-between items-start mb-6">
            {/* Dynamic Group Switcher */}
            <button 
            onClick={() => setShowCoopSwitcher(true)}
            className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl backdrop-blur-md border border-white/10 active:scale-95 transition-all"
            >
            <div className="w-6 h-6 bg-bloom-cream rounded-lg flex items-center justify-center">
                <span className="text-bloom-brown text-xs font-bold">{activeCoop.name[0]}</span>
            </div>
            <span className="text-bloom-cream font-bold text-sm">{activeCoop.name}</span>
            <ChevronDown size={16} className="text-bloom-cream/60" />
            </button>
            
            <button className="p-2 bg-white/10 rounded-xl text-white">
            <LogOut size={20} />
            </button>
        </div>
        
        <p className="text-bloom-cream/60 text-xs uppercase tracking-[0.2em] font-bold">Current Balance</p>
        <h2 className="text-4xl font-bold text-white mt-1">₦{(activeCoop?.balance || 0).toLocaleString()}</h2>
        </header>

      {/* Monthly Records List */}
      <main className="px-6 -mt-6">
        <div className="bg-white rounded-[2.5rem] p-6 shadow-soft min-h-[400px]">
          <div className="flex justify-between items-center mb-6 px-2">
            <h3 className="font-bold text-bloom-brown-dark text-lg">History</h3>
            <span className="text-bloom-brown text-sm font-semibold">Filter</span>
          </div>

          {/* Empty State (We'll map real data here later) */}
          {/* <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-bloom-sand w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Calendar className="text-bloom-brown/40" size={28} />
            </div>
            <p className="text-bloom-brown-dark font-bold">No payments yet</p>
            <p className="text-bloom-brown/50 text-sm max-w-[200px] mt-1">Tap the button below to record your first meeting payment.</p>
          </div> */}





          {/* // Add this to your return statement under the "History" title: */}
            <div className="space-y-4">
            {monthlyHistory.map((item, idx) => (
                <button 
                key={idx}
                onClick={() => setSelectedMonth(item)}
                className="w-full flex items-center justify-between p-5 bg-bloom-sand/30 rounded-[2rem] border border-transparent active:border-bloom-brown/20 transition-all"
                >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Calendar className="text-bloom-brown" size={18} />
                    </div>
                    <div className="text-left">
                    <p className="font-bold text-bloom-brown-dark">{item.month}</p>
                    <p className="text-xs text-bloom-brown/50">{item.payments.length} Payments</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <p className="font-bold text-bloom-brown">₦{item.total.toLocaleString()}</p>
                    <ChevronRight size={18} className="text-bloom-brown/30" />
                </div>
                </button>
            ))}
            </div>

            





        </div>
      </main>

      {/* Monthly Detail Slide-over */}
        <MonthlyDetail 
        isOpen={!!selectedMonth} 
        onClose={() => setSelectedMonth(null)} 
        monthData={selectedMonth} />

      {/* Mobile Floating Action Button */}
      {/* Floating Action Button (FAB) */}
      <button 
        onClick={() => setIsModalOpen(true)} // Open modal on click
        className="fixed bottom-8 right-8 w-16 h-16 bg-bloom-brown-dark text-white rounded-2xl shadow-2xl flex items-center justify-center active:scale-90 transition-transform z-40"
      >
        <Plus size={32} />
      </button>

      {/* The Modal */}
      <AddPaymentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      <CoopSwitcher 
        isOpen={showCoopSwitcher}
        onClose={() => setShowCoopSwitcher(false)}
        groups={myCooperatives}
        activeId={activeCoop.id}
        onSelect={(group) => setActiveCoop(group)}
      />

    </div>
  );
};

export default Dashboard;