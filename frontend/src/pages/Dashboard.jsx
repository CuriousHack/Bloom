import React, { useState, useEffect } from 'react';
import { Plus, ChevronRight, Wallet, Calendar, Users,ListTree, ArrowLeft, User, Home, PieChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';


const formatCompactNumber = (number) => {
  if (number < 1000) return `₦${number}`;
  
  const formatter = Intl.NumberFormat('en-US', {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1
  });
  
  // We manually add the Naira symbol back because 'compact' notation 
  // sometimes struggles with non-standard currency symbols in certain browsers
  return `₦${formatter.format(number).replace('T', 'K')}`; 
};

const Dashboard = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null); // The "Drill Down" state
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch all groups on mount
  useEffect(() => {
    fetchGroups();
  }, []);

  // Fetch contributions whenever a specific group is selected
  useEffect(() => {
    if (selectedGroup) {
      fetchContributions(selectedGroup._id);
    }
  }, [selectedGroup]);

  const fetchGroups = async () => {
    try {
      const res = await api.get('/cooperatives');
      setGroups(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to load your groups");
    }
  };

  const fetchContributions = async (groupId) => {
    try {
      const res = await api.get(`/contributions/${groupId}`);
      setContributions(res.data);
    } catch (err) {
      toast.error("Error loading history");
    }
  };

  const totalGlobalBalance = groups.reduce((acc, curr) => acc + (curr.balance || 0), 0);

  if (loading) return <div className="h-screen flex items-center justify-center bg-bloom-cream text-bloom-brown font-black">BLOOMING...</div>;


  const groupByMonth = (data) => {
    return data.reduce((acc, contribution) => {
      const date = new Date(contribution.date);
      const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      
      if (!acc[monthYear]) {
        acc[monthYear] = {
          monthYear,
          total: 0,
          count: 0,
          payments: []
        };
      }
      
      acc[monthYear].total += contribution.amount;
      acc[monthYear].count += 1;
      acc[monthYear].payments.push(contribution);
      return acc;
    }, {});
  };

  const monthlyData = selectedGroup ? Object.values(groupByMonth(contributions)) : [];
  const currentDisplayBalance = selectedGroup ? (selectedGroup.balance || 0) : totalGlobalBalance;

// We use compact formatting only for very large numbers (e.g., > 10M) 
// to keep the header readable on small screens.
const formattedBalance = currentDisplayBalance > 9999999 
  ? formatCompactNumber(currentDisplayBalance) 
  : currentDisplayBalance.toLocaleString();
  return (
    <div className="min-h-screen bg-bloom-cream pb-32">
      {/* --- ADAPTIVE HEADER --- */}
      <header className="bg-bloom-brown pt-[calc(env(safe-area-inset-top)+2rem)] pb-12 px-8 rounded-b-[3.5rem] shadow-2xl relative z-10">
        <div className="flex justify-between items-center mb-6">
          {selectedGroup ? (
            <button onClick={() => setSelectedGroup(null)} className="p-2 bg-white/10 rounded-full text-white">
              <ArrowLeft size={20} />
            </button>
          ) : (
            <div className="bg-bloom-cream/20 px-4 py-1 rounded-full text-[10px] text-bloom-cream font-bold uppercase tracking-widest">
              Overview
            </div>
          )}
          <button 
            onClick={() => navigate('/transactions/all')} 
            className="w-10 h-10 bg-bloom-cream rounded-2xl flex items-center justify-center text-bloom-brown shadow-lg active:scale-90 transition-transform">
            <ListTree size={20} /> {/* Or use History / LayoutList */}
          </button>
        </div>

        <p className="text-bloom-cream/50 text-xs font-medium uppercase tracking-tighter">
          {selectedGroup ? `Total in ${selectedGroup.name}` : "Total Net Savings"}
        </p>
        <h2 className="text-4xl font-black text-white mt-1 flex items-baseline gap-1 overflow-hidden">
          <span className="text-2xl opacity-40 shrink-0">₦</span>
          <span className="truncate">
            {formattedBalance}
          </span>
        </h2>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="px-6 -mt-6 relative z-20">
        {!selectedGroup ? (
          /* VIEW 1: ALL GROUPS DIRECTORY */
          <div className="space-y-4">
            <h3 className="text-bloom-brown-dark font-black text-sm uppercase tracking-widest ml-2 mb-4">Your Societies</h3>
            {groups.map((group) => (
              <button 
                key={group._id}
                onClick={() => setSelectedGroup(group)}
                className="w-full bg-white p-6 rounded-[2.5rem] shadow-soft border border-bloom-brown/5 flex justify-between items-center active:scale-95 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-bloom-sand/20 rounded-2xl flex items-center justify-center text-bloom-brown">
                    <Users size={24} />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-bloom-brown-dark text-lg">{group.name}</h4>
                    <p className="text-xs text-bloom-brown/40 font-medium">{group.members?.length || 0} Members</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <p className="font-black text-bloom-brown text-lg whitespace-nowrap">
                      {formatCompactNumber(group.balance || 0)}
                    </p>
                    <ChevronRight size={18} className="text-bloom-brown/20" />
                  </div>
              </button>
            ))}
          </div>
        ) : (
          /* VIEW 2: GROUP HISTORY DRILL-DOWN */
            <div className="space-y-6 animate-in slide-in-from-right-10 duration-300">
              <div className="flex justify-between items-center px-2">
                <h3 className="text-bloom-brown-dark font-black text-sm uppercase tracking-widest">History</h3>
                <button 
                  onClick={() => navigate(`/transactions/${selectedGroup._id}`)}
                  className="text-bloom-brown text-xs font-bold underline"
                >
                  View All
                </button>
              </div>
              
              {monthlyData.length > 0 ? (
                monthlyData.map((item) => (
                  <button 
                    key={item.monthYear}
                    onClick={() => navigate(`/transactions/${selectedGroup._id}?month=${item.monthYear}`)}
                    className="w-full bg-white/80 p-6 rounded-[2.5rem] border border-bloom-brown/5 flex justify-between items-center active:scale-95 transition-all shadow-sm"
                  >
                    <div className="flex items-center gap-4 text-left">
                      <div className="w-12 h-12 bg-bloom-sand/20 rounded-2xl flex items-center justify-center text-bloom-brown">
                        <Calendar size={24} />
                      </div>
                      <div>
                        <p className="font-black text-bloom-brown-dark text-lg leading-tight">{item.monthYear}</p>
                        <p className="text-[10px] text-bloom-brown/40 uppercase font-black tracking-widest">
                          {item.count} Payments
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-right">
                      <p className="font-black text-bloom-brown text-lg">₦{item.total.toLocaleString()}</p>
                      <ChevronRight size={18} className="text-bloom-brown/20" />
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-20 opacity-30 font-bold">No contributions for this group.</div>
              )}
            </div>
        )}
      </main>

      {/* --- FLOATING ACTION BUTTON --- */}
      <button 
        className="fixed right-6 bottom-[calc(env(safe-area-inset-bottom)+5rem)] bg-bloom-brown-dark text-white w-16 h-16 rounded-[2rem] shadow-2xl flex items-center justify-center active:scale-90 transition-transform z-40"
        onClick={() => {/* Trigger Add Payment or Create Group Modal */}}
      >
        <Plus size={32} strokeWidth={3} />
      </button>

      {/* --- ADAPTIVE BOTTOM NAVIGATION --- */}

      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-2xl border-t border-bloom-brown/5 px-8 pt-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] flex justify-between items-center z-50">
          <Link to="/dashboard">
            <NavIcon icon={<Home size={24} />} label="Home" active={!selectedGroup} />
          </Link>
          
          <div className="opacity-30 pointer-events-none">
            <NavIcon icon={<PieChart size={24} />} label="Stats" />
          </div>

          <Link to="/profile">
            <NavIcon icon={<User size={24} />} label="Profile" active={false} />
          </Link>
        </nav>
    </div>
  );
};

const NavIcon = ({ icon, label, active }) => (
  <div className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-bloom-brown scale-110' : 'text-bloom-brown/30'}`}>
    {icon}
    <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
  </div>
);

export default Dashboard;