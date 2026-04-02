import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, PieChart, TrendingUp, Target, Award } from 'lucide-react';
import api from '../api/axios';

const Stats = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/cooperatives');
        setGroups(res.data);
      } catch (err) {
        console.error("Stats fetch failed");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const totalSavings = groups.reduce((acc, g) => acc + (g.balance || 0), 0);

  // Calculate percentages for the ring chart
  let cumulativePercent = 0;
  const segments = groups.map((g, i) => {
    const percent = totalSavings > 0 ? ((g.balance || 0) / totalSavings) * 100 : 0;
    const start = cumulativePercent;
    cumulativePercent += percent;
    return { ...g, percent, start };
  });

  if (loading) return <div className="h-screen bg-bloom-cream flex items-center justify-center font-black text-bloom-brown">ANALYZING...</div>;

  return (
    <div className="min-h-screen bg-bloom-cream pb-32">
      {/* --- HEADER --- */}
      <header className="bg-white pt-[calc(env(safe-area-inset-top)+1rem)] pb-8 px-8 rounded-b-[3rem] shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 bg-bloom-sand/20 rounded-full text-bloom-brown">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-black text-bloom-brown-dark">Financial Insights</h1>
        </div>

        {/* --- CUSTOM RING CHART --- */}
        <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
          <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
            {segments.map((s, i) => (
              <circle
                key={s._id}
                cx="18" cy="18" r="15.9"
                fill="transparent"
                stroke={['#3E2723', '#8D6E63', '#D7CCC8', '#BCAAA4'][i % 4]}
                strokeWidth="3.5"
                strokeDasharray={`${s.percent} ${100 - s.percent}`}
                strokeDashoffset={-s.start}
                className="transition-all duration-1000 ease-out"
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-[10px] font-black uppercase text-bloom-brown/30 tracking-widest">Total Wealth</p>
            <p className="text-xl font-black text-bloom-brown-dark">
              ₦{totalSavings > 1000000 ? (totalSavings / 1000000).toFixed(1) + 'M' : totalSavings.toLocaleString()}
            </p>
          </div>
        </div>
      </header>

      {/* --- INSIGHT CARDS --- */}
      <main className="px-6 py-8 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <InsightCard 
            icon={<TrendingUp className="text-green-600" />} 
            label="Growth" 
            value="+12.5%" 
            sub="from last month"
          />
          <InsightCard 
            icon={<Target className="text-blue-600" />} 
            label="Groups" 
            value={groups.length} 
            sub="Active Societies"
          />
        </div>

        {/* --- DISTRIBUTION LIST --- */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-soft border border-bloom-brown/5">
          <h3 className="text-sm font-black text-bloom-brown-dark uppercase tracking-widest mb-6">Distribution</h3>
          <div className="space-y-6">
            {segments.map((group, i) => (
              <div key={group._id} className="space-y-2">
                <div className="flex justify-between items-end">
                  <p className="font-bold text-bloom-brown-dark text-sm">{group.name}</p>
                  <p className="text-xs font-black text-bloom-brown">{group.percent.toFixed(1)}%</p>
                </div>
                <div className="h-2 w-full bg-bloom-sand/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${group.percent}%`, 
                      backgroundColor: ['#3E2723', '#8D6E63', '#A1887F', '#D7CCC8'][i % 4] 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

const InsightCard = ({ icon, label, value, sub }) => (
  <div className="bg-white p-6 rounded-[2.5rem] shadow-soft border border-bloom-brown/5">
    <div className="mb-3">{icon}</div>
    <p className="text-[10px] font-black text-bloom-brown/30 uppercase tracking-widest">{label}</p>
    <p className="text-xl font-black text-bloom-brown-dark">{value}</p>
    <p className="text-[9px] font-bold text-bloom-brown/40 mt-1">{sub}</p>
  </div>
);

export default Stats;