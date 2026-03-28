import React, { useState, useEffect } from 'react';
import { Plus, Wallet, Calendar, ChevronRight, ChevronDown, LogOut } from 'lucide-react';
import AddPaymentModal from '../components/AddPaymentModal'; // Import the modal
import MonthlyDetail from '../components/MonthlyDetails';
import CoopSwitcher from '../components/CoopSwitcher';
import CreateGroupModal from '../components/CreateGroupModal'; // Import the new modal
import api from '../api/axios';

const Dashboard = () => {
    const [groups, setGroups] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [activeCoop, setActiveCoop] = useState(null);

    // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [showCoopSwitcher, setShowCoopSwitcher] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [contributions, setContributions] = useState([]); // Real data from DB



    // 1. Fetch Groups on Load
    useEffect(() => {
        const fetchGroups = async () => {
        try {
            const res = await api.get('/cooperatives');
            setGroups(res.data);
            if (res.data.length > 0) {
            setActiveCoop(res.data[0]); // Default to first group
            }
        } catch (err) {
            console.error("Error fetching groups", err);
        } finally {
            setLoading(false);
        }
        };
        fetchGroups();
    }, []);


  return (
    <div className="min-h-screen bg-bloom-cream pb-24">
      {/* Updated Header in Dashboard.jsx */}
        {/* 2. Dynamic Header */}
      <header className="bg-bloom-brown pt-16 pb-12 px-8 rounded-b-[3rem] shadow-xl relative">
        {activeCoop ? (
          <>
            <div className="flex justify-between items-start mb-6">
              <button 
                onClick={() => setShowCoopSwitcher(true)}
                className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl backdrop-blur-md border border-white/10"
              >
                <span className="text-bloom-cream font-bold text-sm">{activeCoop.name}</span>
                <ChevronDown size={16} className="text-bloom-cream/60" />
              </button>
            </div>
            <p className="text-bloom-cream/60 text-xs uppercase tracking-widest font-bold">Current Balance</p>
            <h2 className="text-4xl font-bold text-white mt-1">₦{(activeCoop.balance || 0).toLocaleString()}</h2>
          </>
        ) : (
          <div className="text-center py-4">
            <h2 className="text-2xl font-bold text-white">No Groups Found</h2>
            <p className="text-bloom-cream/60 text-sm mt-1">Create a group to start tracking</p>
          </div>
        )}
      </header>

      {/* Monthly Records List */}
      <main className="px-6 -mt-6">
        <div className="bg-white rounded-[2.5rem] p-6 shadow-soft min-h-[400px]">
          {!activeCoop ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <button 
                onClick={() => setIsCreateGroupOpen(true)}
                className="bg-bloom-brown text-white px-8 py-4 rounded-2xl font-bold shadow-lg"
              >
                Create My First Group
              </button>
            </div>
          ) : (
            <div>
                <div className="space-y-4">
                {contributions.length > 0 ? (
                    contributions.map((item, idx) => (
                    <button 
                        key={idx}
                        onClick={() => setSelectedMonth(item)}
                        className="w-full flex items-center justify-between p-5 bg-bloom-sand/30 rounded-[2rem] border border-transparent active:border-bloom-brown/20 transition-all">
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
                    ))
                ) : (
                    <div className="text-center py-10 text-bloom-brown/40 italic">
                        No transactions recorded for this group yet.
                    </div>
                )}
                </div>
            </div>
          )}
        </div>
      </main>

      {/* Monthly Detail Slide-over */}
        <MonthlyDetail 
        isOpen={!!selectedMonth} 
        onClose={() => setSelectedMonth(null)} 
        monthData={selectedMonth} />

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

      <CreateGroupModal 
        isOpen={isCreateGroupOpen} 
        onClose={() => setIsCreateGroupOpen(false)} 
        onGroupCreated={(newGroup) => {
          setGroups([...groups, newGroup]);
          setActiveCoop(newGroup);
        }}
      />

      <CoopSwitcher 
        isOpen={showCoopSwitcher}
        onClose={() => setShowCoopSwitcher(false)}
        groups={groups}
        activeId={activeCoop?._id}
        onSelect={(group) => setActiveCoop(group)}
        openCreateModal={() => setIsCreateGroupOpen(true)} // Pass this down!
      />

    </div>
  );
};

export default Dashboard;