import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bloom-cream flex flex-col items-center justify-center px-6 py-12">
      {/* Logo Section */}
      <div className="mb-10 text-center">
        <div className="w-20 h-20 bg-bloom-brown rounded-3xl mx-auto flex items-center justify-center shadow-lg mb-4">
          <span className="text-bloom-cream text-4xl font-serif italic font-bold">B</span>
        </div>
        <h1 className="text-3xl font-bold text-bloom-brown-dark tracking-tight">Welcome Back</h1>
        <p className="text-bloom-brown/60 mt-1 font-medium">Secure access to Bloom</p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-bloom-sand/50 backdrop-blur-sm p-8 rounded-[2.5rem] border border-bloom-brown/5 shadow-soft">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-bloom-brown-dark ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-bloom-brown/40 group-focus-within:text-bloom-brown transition-colors" size={20} />
              <input 
                type="email" 
                placeholder="name@email.com"
                className="w-full bg-white border-none py-4 pl-12 pr-4 rounded-2xl shadow-sm focus:ring-2 focus:ring-bloom-brown/20 outline-none transition-all placeholder:text-bloom-brown/30"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-bloom-brown-dark ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-bloom-brown/40 group-focus-within:text-bloom-brown transition-colors" size={20} />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
                className="w-full bg-white border-none py-4 pl-12 pr-12 rounded-2xl shadow-sm focus:ring-2 focus:ring-bloom-brown/20 outline-none transition-all placeholder:text-bloom-brown/30"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-bloom-brown/40 hover:text-bloom-brown"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
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
            Sign In
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-bloom-brown/60 text-sm">
            New to the society? <button onClick={() => navigate('/register')} 
            className="text-bloom-brown font-bold hover:underline">Register</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;