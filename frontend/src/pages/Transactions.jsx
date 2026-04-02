import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Wallet, Search, Filter, Calendar as CalendarIcon, Users } from 'lucide-react';
import api from '../api/axios';

const Transactions = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [allPayments, setAllPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedGroupName, setSelectedGroupName] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // If groupId is 'all', we hit a new endpoint (or fetch all groups)
        const endpoint = groupId === 'all' ? '/contributions' : `/contributions/${groupId}`;
        const res = await api.get(endpoint);
        setAllPayments(res.data);
      } catch (err) {
        console.log(err);
        console.error("Error fetching transactions");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [groupId]);

  // 🧪 The Powerful Filter Logic
  const filteredPayments = useMemo(() => {
    return allPayments.filter(p => {
      const dateObj = new Date(p.date);
      const month = dateObj.toLocaleString('default', { month: 'long' });
      const year = dateObj.getFullYear().toString();
      const monthYear = `${month} ${year}`;
      const groupName = p.cooperativeId?.name || "General";

      const matchesSearch = 
        p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.amount.toString().includes(searchTerm) ||
        groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dateObj.toLocaleDateString().includes(searchTerm);

      const matchesMonth = selectedMonth === "All" || monthYear === selectedMonth;
      const matchesGroup = selectedGroupName === "All" || groupName === selectedGroupName;

      return matchesSearch && matchesMonth && matchesGroup;
    });
  }, [allPayments, searchTerm, selectedMonth, selectedGroupName]);

  // Get unique months and groups for the filter dropdowns
  const uniqueMonths = ["All", ...new Set(allPayments.map(p => 
    new Date(p.date).toLocaleString('default', { month: 'long', year: 'numeric' })
  ))];
  
  const uniqueGroups = ["All", ...new Set(allPayments.map(p => p.cooperativeId?.name || "General"))];

  return (
    <div className="min-h-screen bg-bloom-cream pb-12">
      {/* --- STICKY SEARCH HEADER --- */}
      <header className="bg-bloom-brown pt-[calc(env(safe-area-inset-top)+1rem)] pb-6 px-6 sticky top-0 z-50 rounded-b-[2.5rem] shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 bg-white/10 rounded-full text-white">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-black text-white">
            {groupId === 'all' ? 'Global Ledger' : 'Transactions'}
          </h1>
        </div>

        {/* Search Bar */}
        <div className="bg-white/10 backdrop-blur-md flex items-center px-4 py-3 rounded-2xl border border-white/10">
          <Search size={18} className="text-bloom-cream/40 mr-3" />
          <input 
            type="text" 
            placeholder="Search amount, group, or date..."
            className="bg-transparent w-full outline-none text-white placeholder:text-bloom-cream/30 font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {/* --- FILTERS --- */}
      <div className="px-6 py-4 flex gap-2 overflow-x-auto no-scrollbar">
        <FilterSelect 
          icon={<CalendarIcon size={14}/>} 
          options={uniqueMonths} 
          value={selectedMonth} 
          onChange={setSelectedMonth} 
        />
        {groupId === 'all' && (
          <FilterSelect 
            icon={<Users size={14}/>} 
            options={uniqueGroups} 
            value={selectedGroupName} 
            onChange={setSelectedGroupName} 
          />
        )}
      </div>

      {/* --- TRANSACTION LIST --- */}
      <main className="px-6 space-y-4">
        {filteredPayments.length > 0 ? (
          filteredPayments.map((p) => (
            <div key={p._id} className="bg-white p-5 rounded-[2rem] shadow-soft border border-bloom-brown/5 flex justify-between items-center animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-bloom-sand/20 rounded-xl flex items-center justify-center text-bloom-brown">
                  <Wallet size={20} />
                </div>
                <div>
                  <p className="font-bold text-bloom-brown-dark text-sm">{new Date(p.date).toLocaleDateString()}</p>
                  <p className="text-[10px] text-bloom-brown/40 uppercase font-black tracking-widest">
                    {p.cooperativeId?.name || 'Bloom'} • {p.description || 'Contribution'}
                  </p>
                </div>
              </div>
              <p className="font-black text-bloom-brown">₦{p.amount.toLocaleString()}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-20 opacity-20 font-black uppercase tracking-widest">
            No results found
          </div>
        )}
      </main>
    </div>
  );
};

const FilterSelect = ({ icon, options, value, onChange }) => (
  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-bloom-brown/5 shadow-sm shrink-0">
    <span className="text-bloom-brown/40">{icon}</span>
    <select 
      className="bg-transparent outline-none text-xs font-bold text-bloom-brown-dark appearance-none"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

export default Transactions;