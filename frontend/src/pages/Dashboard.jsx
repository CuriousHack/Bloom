import React, { useState, useEffect } from 'react';
import { 
  Plus, Calendar, ChevronRight, ChevronDown, 
  LogOut, Wallet, Loader2, PlusCircle 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

// Component Imports
import AddPaymentModal from '../components/AddPaymentModal';
import MonthlyDetail from '../components/MonthlyDetails';
import CoopSwitcher from '../components/CoopSwitcher';
import CreateGroupModal from '../components/CreateGroupModal';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Data State
  const [groups, setGroups] = useState([]);
  const [activeCoop, setActiveCoop] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [showCoopSwitcher, setShowCoopSwitcher] = useState(false);
  const [selectedMonthData, setSelectedMonthData] = useState(null);

  // 1. Fetch all cooperatives on mount
  useEffect(() => {
    fetchInitialData();
  }, []);

  // 2. Fetch contributions whenever the active group changes
  useEffect(() => {
    if (activeCoop?._id) {
      fetchContributions(activeCoop._id);
    }
  }, [activeCoop]);

  const fetchInitialData = async () => {
    try {
      const res = await api.get('/cooperatives');
      setGroups(res.data);
      if (res.data.length > 0) {
        setActiveCoop(res.data[0]);
      }
    } catch (err) {
      console.error("Failed to load groups", err);
      toast.error("Failed to load groups. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchContributions = async (coopId) => {
    try {
      const res = await api.get(`/contributions/${coopId}`);
      toast.success("Contributions loaded successfully! 🌟");
      setContributions(res.data);
    } catch (err) {
        toast.error("Failed to load contributions. Please try again later.");
        console.error("Failed to load contributions", err);
    }
  };

  const handleLogout = () => {
    // 1. Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // 2. Show success toast
    toast.success("Logged out successfully. See you soon! 👋", {
        icon: '🤎', // Custom brown heart icon to match theme
    });

    // 3. Redirect to Login
    navigate('/');
    };

  // 3. Helper: Group raw contributions into Monthly Buckets
  const getMonthlySummary = () => {
    const groups = {};
    contributions.forEach(c => {
      const key = c.monthKey || "Other";
      if (!groups[key]) groups[key] = { month: key, total: 0, payments: [] };
      groups[key].total += c.amount;
      groups[key].payments.push(c);
    });
    return Object.values(groups);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bloom-cream flex items-center justify-center">
        <Loader2 className="animate-spin text-bloom-brown" size={40} />
      </div>
    );
  }

  const monthlyHistory = getMonthlySummary();

  const currentBalance = contributions.reduce((acc, curr) => acc + Number(curr.amount), 0);


  return (
    <div className="min-h-screen bg-bloom-cream pb-24 font-sans">
      {/* Header Section */}
      <header className="bg-bloom-brown px-8 rounded-b-[3.5rem] shadow-xl relative z-10 pt-[calc(env(safe-area-inset-top)+2rem)] pb-12">
        <div className="flex justify-between items-start mb-8">
          {activeCoop ? (
            <button 
              onClick={() => setShowCoopSwitcher(true)}
              className="flex items-center gap-2 bg-white/10 px-4 py-2.5 rounded-2xl backdrop-blur-md border border-white/5 active:scale-95 transition-all"
            >
              <div className="w-6 h-6 bg-bloom-cream rounded-lg flex items-center justify-center shadow-inner">
                <span className="text-bloom-brown text-[10px] font-black uppercase">
                  {activeCoop.name[0]}
                </span>
              </div>
              <span className="text-bloom-cream font-bold text-sm tracking-tight">{activeCoop.name}</span>
              <ChevronDown size={16} className="text-bloom-cream/40" />
            </button>
          ) : (
            <div className="text-bloom-cream/80 font-bold italic">Bloom</div>
          )}
          
          <button 
            onClick={handleLogout}
            className="p-2.5 bg-white/10 rounded-2xl text-white hover:bg-white/20 transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>

        <div className="animate-in fade-in slide-in-from-top-4 duration-700">
          <p className="text-bloom-cream/50 text-[10px] uppercase tracking-[0.3em] font-black">
            Available Balance
          </p>
          <h2 className="text-4xl font-bold text-white mt-1.5 flex items-baseline gap-1">
            <span className="text-2xl opacity-60 font-medium">₦</span>
            {currentBalance.toLocaleString()}
          </h2>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="px-6 -mt-8 relative z-20">
        <div className="bg-white rounded-[3rem] p-7 shadow-soft min-h-[500px] border border-bloom-brown/5">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-extrabold text-bloom-brown-dark text-xl">History</h3>
            <div className="w-8 h-8 bg-bloom-sand/50 rounded-full flex items-center justify-center">
               <Wallet size={16} className="text-bloom-brown" />
            </div>
          </div>

          {/* List of Monthly Records */}
          <div className="space-y-4">
            {activeCoop ? (
              monthlyHistory.length > 0 ? (
                monthlyHistory.map((group, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setSelectedMonthData(group)}
                    className="w-full flex items-center justify-between p-5 bg-bloom-sand/20 rounded-[2.5rem] border border-transparent active:border-bloom-brown/10 active:bg-bloom-sand/40 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-active:shadow-none transition-shadow">
                        <Calendar className="text-bloom-brown" size={20} />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-bloom-brown-dark">{group.month}</p>
                        <p className="text-xs text-bloom-brown/50 font-semibold">{group.payments.length} Payments</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-bloom-brown text-lg">₦{group.total.toLocaleString()}</p>
                      <ChevronRight size={18} className="text-bloom-brown/30" />
                    </div>
                  </button>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                  <div className="w-20 h-20 bg-bloom-sand rounded-full flex items-center justify-center mb-4">
                    <PlusCircle size={32} className="text-bloom-brown" />
                  </div>
                  <p className="font-bold">No Records Found</p>
                  <p className="text-xs">Tap the + to add a payment</p>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-bloom-brown/60 mb-6 font-medium">You haven't joined any groups yet.</p>
                <button 
                  onClick={() => setIsCreateGroupOpen(true)}
                  className="bg-bloom-brown text-white px-10 py-4 rounded-2xl font-bold shadow-xl active:scale-95 transition-all"
                >
                  Create Your First Group
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      {activeCoop && (
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="fixed right-8 bg-bloom-brown-dark text-white rounded-[2rem] shadow-2xl bottom-[calc(env(safe-area-inset-bottom)+2rem)] w-16 h-16 flex items-center justify-center z-40"
        >
          <Plus size={32} strokeWidth={3} />
        </button>
      )}

      {/* Modals & Overlays */}
      <AddPaymentModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        activeCoopId={activeCoop?._id}
        onPaymentAdded={(newPayment) => {
          setContributions([newPayment, ...contributions]);
          setActiveCoop({...activeCoop, balance: (activeCoop.balance || 0) + Number(newPayment.amount)});
        }}
      />

      <MonthlyDetail 
        isOpen={!!selectedMonthData} 
        onClose={() => setSelectedMonthData(null)} 
        monthData={selectedMonthData} 
      />

      <CoopSwitcher 
        isOpen={showCoopSwitcher}
        onClose={() => setShowCoopSwitcher(false)}
        groups={groups}
        activeId={activeCoop?._id}
        onSelect={(group) => setActiveCoop(group)}
        openCreateModal={() => setIsCreateGroupOpen(true)}
      />

      <CreateGroupModal 
        isOpen={isCreateGroupOpen} 
        onClose={() => setIsCreateGroupOpen(false)} 
        onGroupCreated={(newGroup) => {
          setGroups([...groups, newGroup]);
          setActiveCoop(newGroup);
        }}
      />
    </div>
  );
};

export default Dashboard;