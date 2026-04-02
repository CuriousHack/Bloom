import React, { useState } from 'react';
import { User, Mail, Shield, LogOut, ChevronRight, ArrowLeft, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';

const Profile = () => {
  const navigate = useNavigate();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [newName, setNewName] = useState("");
  
  // Safely parse user data
  const user = JSON.parse(localStorage.getItem('user')) || { fullName: 'User', email: '' };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Updating profile...");
    try {
      const res = await api.put('/auth/profile', { fullName: newName });
      localStorage.setItem('user', JSON.stringify(res.data));
      toast.success("Profile updated! ✨", { id: loadingToast });
      setIsEditOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed", { id: loadingToast });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success("Logged out. See you soon! 👋");
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-bloom-cream pb-24">
      {/* --- ADAPTIVE HEADER --- */}
      <header className="bg-bloom-brown pt-[calc(env(safe-area-inset-top)+2rem)] pb-16 px-8 rounded-b-[3.5rem] shadow-xl relative text-center">
        <button 
          onClick={() => navigate('/dashboard')}
          className="absolute left-6 top-[calc(env(safe-area-inset-top)+2rem)] p-2 bg-white/10 rounded-full text-white active:scale-90 transition-transform"
        >
          <ArrowLeft size={20} />
        </button>
        
        <div className="relative inline-block mt-4">
          <div className="w-28 h-28 bg-bloom-cream rounded-[2.5rem] shadow-inner flex items-center justify-center text-bloom-brown text-4xl font-bold border-4 border-white/20">
            {user.fullName[0]}
          </div>
          <div className="absolute bottom-0 right-0 bg-bloom-brown-dark text-white p-2 rounded-xl shadow-lg border-2 border-bloom-brown">
            <Camera size={16} />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-white mt-4">{user.fullName}</h2>
        <p className="text-bloom-cream/60 text-sm font-medium">{user.email}</p>
      </header>

      {/* --- SETTINGS LIST --- */}
      <main className="px-6 -mt-8 relative z-20">
        <div className="bg-white rounded-[2.5rem] shadow-soft border border-bloom-brown/5 overflow-hidden">
          
          {/* Actionable Profile Items */}
          <ProfileItem 
            icon={<User size={20} className="text-bloom-brown" />} 
            label="Edit Full Name" 
            sub={user.fullName}
            onClick={() => {
              setNewName(user.fullName);
              setIsEditOpen(true);
            }}
          />
          
          <ProfileItem 
            icon={<Mail size={20} className="text-bloom-brown" />} 
            label="Email Address" 
            sub={user.email}
            onClick={() => toast("Email cannot be changed yet", { icon: '🔒' })}
          />
          
          <ProfileItem 
            icon={<Shield size={20} className="text-bloom-brown" />} 
            label="Security" 
            sub="Password and Two-Factor"
            onClick={() => toast.error("Security settings coming soon")}
          />
          
          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-6 hover:bg-red-50 active:bg-red-100 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-red-100 p-3 rounded-2xl text-red-600 group-hover:scale-110 transition-transform">
                <LogOut size={20} />
              </div>
              <div className="text-left">
                <p className="font-bold text-red-600">Logout</p>
                <p className="text-[10px] text-red-400 uppercase font-bold tracking-widest">End Current Session</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-red-200" />
          </button>
        </div>
      </main>

      {/* --- EDIT BOTTOM SHEET --- */}
      {isEditOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center">
          <div 
            className="absolute inset-0 bg-bloom-brown-dark/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsEditOpen(false)}
          />
          
          <div className="relative bg-white w-full max-w-lg rounded-t-[3.5rem] p-10 pb-[calc(env(safe-area-inset-bottom)+2rem)] animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1.5 bg-bloom-sand rounded-full mx-auto mb-8" />
            
            <h3 className="text-2xl font-bold text-bloom-brown-dark mb-2">Update Name</h3>
            <p className="text-sm text-bloom-brown/40 mb-8 font-medium">How should we address you in Bloom?</p>
            
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="bg-bloom-cream/50 p-4 rounded-2xl border border-bloom-brown/10">
                <input 
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-transparent w-full outline-none text-bloom-brown-dark font-bold text-base"
                  placeholder="Full Name"
                  autoFocus
                />
              </div>
              
              <button 
                type="submit"
                className="w-full bg-bloom-brown text-white py-5 rounded-[2rem] font-bold shadow-xl active:scale-95 transition-all"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- FOOTER INFO --- */}
      <div className="text-center mt-8 px-8">
        <p className="text-[10px] text-bloom-brown/30 font-bold uppercase tracking-[0.2em]">Bloom v2.0.0</p>
        <p className="text-[10px] text-bloom-brown/20 mt-1 font-medium italic">Crafted for cooperative growth</p>
      </div>
    </div>
  );
};

// Fixed ProfileItem: Now handles its own click but isn't nested inside another button
const ProfileItem = ({ icon, label, sub, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-6 border-b border-bloom-sand/30 last:border-0 active:bg-bloom-sand/10 transition-colors outline-none"
  >
    <div className="flex items-center gap-4">
      <div className="bg-bloom-sand/20 p-3 rounded-2xl">
        {icon}
      </div>
      <div className="text-left">
        <p className="font-bold text-bloom-brown-dark">{label}</p>
        <p className="text-[10px] text-bloom-brown/40 uppercase font-bold tracking-widest">{sub}</p>
      </div>
    </div>
    <ChevronRight size={18} className="text-bloom-brown/20" />
  </button>
);

export default Profile;