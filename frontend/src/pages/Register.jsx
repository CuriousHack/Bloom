import React, { useState } from 'react';
import { Lock, Mail, User, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ 
    fullName: '', 
    email: '', 
    password: '',
    confirmPassword: '' 
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/register', {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password
      });
      
      // Save token and user info
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bloom-cream flex flex-col items-center justify-center px-6 py-10">
      
      {/* Back Button for Mobile UX */}
      <button 
        onClick={() => navigate('/dashboard')}
        className="self-start mb-6 flex items-center text-bloom-brown-dark font-semibold gap-2 active:scale-95 transition-transform"
      >
        <ArrowLeft size={20} />
        <span>Back to Login</span>
      </button>

      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-bloom-brown-dark tracking-tight">Join Bloom</h1>
        <p className="text-bloom-brown/60 mt-1 font-medium">Start tracking your contributions</p>
      </div>

      {/* Registration Card */}
      <div className="w-full max-w-md bg-bloom-sand/40 backdrop-blur-md p-8 rounded-[2.5rem] border border-bloom-brown/5 shadow-soft">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-bloom-brown-dark/60 ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-bloom-brown/40" size={18} />
              <input 
                type="text" 
                placeholder="John Doe"
                className="w-full bg-white py-4 pl-12 pr-4 rounded-2xl shadow-sm focus:ring-2 focus:ring-bloom-brown/20 outline-none transition-all"
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-bloom-brown-dark/60 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-bloom-brown/40" size={18} />
              <input 
                type="email" 
                placeholder="name@email.com"
                className="w-full bg-white py-4 pl-12 pr-4 rounded-2xl shadow-sm focus:ring-2 focus:ring-bloom-brown/20 outline-none transition-all"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-bloom-brown-dark/60 ml-1">Create Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-bloom-brown/40" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
                className="w-full bg-white py-4 pl-12 pr-12 rounded-2xl shadow-sm focus:ring-2 focus:ring-bloom-brown/20 outline-none transition-all"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-bloom-brown/40 hover:text-bloom-brown"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-bloom-brown-dark/60 ml-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-bloom-brown/40" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
                className="w-full bg-white py-4 pl-12 pr-4 rounded-2xl shadow-sm focus:ring-2 focus:ring-bloom-brown/20 outline-none transition-all"
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                required
              />
            </div>
          </div>

          {error && (
              <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl border border-red-100 mb-4 text-center font-bold">
                {error}
              </div>
            )}

          {/* Action Button */}
          <button 
            type="submit"
            className="w-full bg-bloom-brown hover:bg-bloom-brown-dark text-white py-4 rounded-2xl font-bold shadow-lg shadow-bloom-brown/20 active:scale-[0.98] transition-all mt-4"
          >
            Create Account
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-bloom-brown/60 text-sm">
            Already have an account? <button onClick={() => navigate('/')} className="text-bloom-brown font-bold hover:underline">Sign In</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;