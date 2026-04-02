import React, { useState, useEffect } from 'react';
import { Plus, ChevronRight, Wallet, Users, ArrowLeft, User, Home, PieChart } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null); // The "Drill Down" state
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);

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
          <div className="w-10 h-10 bg-bloom-cream rounded-2xl flex items-center justify-center text-bloom-brown font-bold shadow-inner">
            {JSON.parse(localStorage.getItem('user'))?.fullName[0]}
          </div>
        </div>

        <p className="text-bloom-cream/50 text-xs font-medium uppercase tracking-tighter">
          {selectedGroup ? `Total in ${selectedGroup.name}` : "Total Net Savings"}
        </p>
        <h2 className="text-4xl font-black text-white mt-1 flex items-baseline gap-1">
          <span className="text-2xl opacity-40">₦</span>
          {(selectedGroup ? (selectedGroup.balance || 0) : totalGlobalBalance).toLocaleString()}
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
                <div className="flex items-center gap-3">
                  <p className="font-black text-bloom-brown text-lg">₦{(group.balance || 0).toLocaleString()}</p>
                  <ChevronRight size={18} className="text-bloom-brown/20" />
                </div>
              </button>
            ))}
          </div>
        ) : (
          /* VIEW 2: GROUP HISTORY DRILL-DOWN */
          <div className="space-y-6 animate-in slide-in-from-right-10 duration-300">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-bloom-brown-dark font-black text-sm uppercase tracking-widest">Recent Payments</h3>
              <button className="text-bloom-brown text-xs font-bold underline">See All</button>
            </div>
            
            {contributions.length > 0 ? (
              contributions.map((payment) => (
                <div key={payment._id} className="bg-white/60 backdrop-blur-sm p-5 rounded-[2rem] border border-bloom-brown/5 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-700">
                      <Wallet size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-bloom-brown-dark">{new Date(payment.date).toLocaleDateString()}</p>
                      <p className="text-[10px] text-bloom-brown/40 uppercase font-black tracking-widest">{payment.description || 'Monthly Contribution'}</p>
                    </div>
                  </div>
                  <p className="font-black text-bloom-brown">+₦{payment.amount.toLocaleString()}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-20 opacity-30 font-bold">No contributions yet.</div>
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
        <NavIcon icon={<Home size={24} />} label="Home" active={!selectedGroup} />
        <NavIcon icon={<PieChart size={24} />} label="Stats" />
        <NavIcon icon={<User size={24} />} label="Profile" />
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